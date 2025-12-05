# 🚀 Production Deployment Guide (Contabo Ubuntu 25 + Docker + GitHub Actions)

This document explains how to deploy **Cycle Paradise** to a Contabo Ubuntu 25 server using Docker, Nginx, and a GitHub Actions pipeline that publishes tagged releases. All references use the production domain **`cycleparadise.bike`**.

---

## 1. Architecture Overview

| Layer | Purpose | Notes |
| --- | --- | --- |
| Contabo VPS (Ubuntu 25) | Dedicated compute + storage | Hardened with UFW, Fail2ban, automatic updates |
| Docker Compose | Runs PostgreSQL + Astro app | Network-isolated `cycleparadise-network` |
| Nginx | Reverse proxy + SSL termination | Serves `cycleparadise.bike` and `www.cycleparadise.bike` |
| GitHub Container Registry (GHCR) | Stores versioned Docker images | One image per Git tag |
| GitHub Actions | CI/CD orchestrator | `deploy-production.yml` deploys on tags |

---

## 2. Prerequisites

1. **Domain**: `cycleparadise.bike`
   - Create A records pointing `@` and `www` to the Contabo server IP.
2. **Contabo VPS**: Ubuntu 25, at least 2 vCPU / 4 GB RAM / 80 GB SSD.
3. **GitHub Secrets** (`Settings → Secrets and variables → Actions`):
   - `SERVER_HOST` (server IP)
   - `SERVER_USER` (e.g., `deploy`)
   - `SERVER_SSH_KEY` (private key for the deploy user)
   - `GITHUB_TOKEN` (built-in; no action needed)
   - `POSTGRES_PASSWORD`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `CONTACT_EMAIL` (e.g., `info@cycleparadise.bike`)
   - `PUBLIC_SITE_URL` (`https://cycleparadise.bike`)

---

## 3. Server Bootstrap (run **once**)

SSH into the server as `root`, create the bootstrap script, then run it:

```bash
ssh root@YOUR_SERVER_IP
cat <<'EOF' > /root/setup.sh
#!/usr/bin/env bash
set -euo pipefail

apt update && apt upgrade -y
apt install -y curl wget git vim htop ufw fail2ban unattended-upgrades ca-certificates gnupg lsb-release
dpkg-reconfigure -plow unattended-upgrades

# Docker Engine + Compose
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
apt update && apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

# Nginx + Certbot
apt install -y nginx certbot python3-certbot-nginx

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Fail2ban
systemctl enable --now fail2ban

# Deploy user
if ! id deploy >/dev/null 2>&1; then
   useradd -m -s /bin/bash deploy
   usermod -aG docker deploy
   usermod -aG sudo deploy
   mkdir -p /home/deploy/.ssh && chmod 700 /home/deploy/.ssh
   touch /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys
   chown -R deploy:deploy /home/deploy/.ssh
   echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose" > /etc/sudoers.d/deploy
fi

mkdir -p /opt/cycleparadise
chown -R deploy:deploy /opt/cycleparadise

cat >> /etc/sysctl.conf <<'SYS'
fs.file-max = 200000
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
vm.swappiness = 10
SYS
sysctl -p
EOF

chmod +x /root/setup.sh
/root/setup.sh
```

> The script installs Docker, Docker Compose, Nginx, Certbot, Fail2ban, UFW rules, creates the `deploy` user, sets system limits, and prepares `/opt/cycleparadise`.

Copy your public key into `/home/deploy/.ssh/authorized_keys` so GitHub Actions can connect using `SERVER_SSH_KEY`.

---

## 4. Nginx + SSL for `cycleparadise.bike`

1. **Create an HTTP-only site config first** (`/etc/nginx/sites-available/cycleparadise`). Certbot can’t provision certificates if nginx references files that don’t exist yet, so start with just port 80:

```nginx
# /etc/nginx/sites-available/cycleparadise
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

upstream cycleparadise_backend {
   server 127.0.0.1:4321;
   keepalive 64;
}

server {
   listen 80;
   listen [::]:80;
   server_name cycleparadise.bike www.cycleparadise.bike;

   location /.well-known/acme-challenge/ { root /var/www/html; }

   # Temporary: serve HTTP traffic until certbot provisions TLS
   location / {
      proxy_pass http://cycleparadise_backend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
   }
}
```

2. **Enable and test**:

```bash
ln -sf /etc/nginx/sites-available/cycleparadise /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

3. **Issue SSL certificates** (after DNS propagates). The `--nginx` flag adds the HTTPS block automatically with the correct certificate paths:

```bash
certbot --nginx -d cycleparadise.bike -d www.cycleparadise.bike \
  --non-interactive --agree-tos -m info@cycleparadise.bike
certbot renew --dry-run
```

4. **Optional hardening**: Once Certbot has inserted the TLS `server { ... }` block, feel free to expand it with HSTS headers, rate limiting, or custom proxy rules. To temporarily disable the HTTPS block (for troubleshooting), prefix each line with `#` to comment it out.

---

## 5. Docker Compose Runtime (server)

Deploy files under `/opt/cycleparadise`:

```bash
sudo su - deploy
cd /opt/cycleparadise
git clone https://github.com/Software-Lifecycle-Consultants/cycleparadise.git .
cp .env.example .env
nano .env  # Fill in secure values - not needed when github runner is up this is for manual setup
```

`docker-compose.yml` already maps `127.0.0.1:4321` for the web container and `127.0.0.1:5432` for the database, keeping services internal.

**Manual start (optional fallback):**

```bash
docker-compose pull
docker-compose up -d
docker-compose exec web npx prisma migrate deploy
```

---

## 6. GitHub Actions Pipeline (tag-driven)

Workflow file: `.github/workflows/deploy-production.yml`

### Pipeline stages

1. **Build & Test**
   - `npm ci`
   - `npx prisma generate`
   - `npx tsc --noEmit`
   - `npm run build`

2. **Build & Push Docker Image**
   - Tags image as `ghcr.io/software-lifecycle-consultants/cycleparadise:vX.Y.Z`

3. **Deploy to Contabo**
   - SSH into server
   - Pull repo + compose file
   - Populate `.env`
   - `docker-compose pull && docker-compose down && docker-compose up -d`
   - Run `npx prisma migrate deploy`
   - Show logs + clean old images

4. **Health Check & Notification**
   - `curl https://cycleparadise.bike`
   - Optionally extend with Slack/Email alerts

### Required secrets recap

`SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`, `POSTGRES_PASSWORD`, `SMTP_*`, `CONTACT_EMAIL`, `PUBLIC_SITE_URL`.

---

## 7. Deployment Runbook

### Cut a release

```bash
git checkout main
git pull origin main
npm test && npm run build  # local verification

git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions automatically runs the pipeline and deploys the new release.

### Emergency redeploy (no new tag)

```bash
# Trigger workflow manually using the last tag
gh workflow run deploy-production.yml -f tag=v1.0.0
```

### Manual rollback

```bash
ssh deploy@SERVER_IP
cd /opt/cycleparadise
git checkout v0.9.0
TAG=v0.9.0 docker-compose pull
docker-compose down && docker-compose up -d
docker-compose exec web npx prisma migrate deploy --skip-seed
```

---

## 8. Production Readiness Checklist

| Area | Command / Action | Status |
| --- | --- | --- |
| **Domain** | `dig +short cycleparadise.bike` → matches server IP | ✅ |
| **SSL** | `curl -I https://cycleparadise.bike` (expect `200`) | ✅ |
| **Health Endpoint** | `curl https://cycleparadise.bike/health` | ✅ |
| **Database backups** | Verify `/opt/backups/postgres` contains recent `.sql.gz` | ✅ |
| **Firewall** | `ufw status` should show ports 22/80/443 only | ✅ |
| **Fail2ban** | `systemctl status fail2ban` (active) | ✅ |
| **Docker health** | `docker ps --format 'table {{.Names}}	{{.Status}}'` | ✅ |
| **Logs** | `docker-compose logs -f web` clean of errors | ✅ |
| **Monitoring** | UptimeRobot or similar hitting `https://cycleparadise.bike/health` | ✅ |
| **Secrets** | Stored in GitHub / server `.env` only | ✅ |

> Re-run this checklist whenever infrastructure changes.

---

## 9. Operational Commands Reference

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# View running containers
cd /opt/cycleparadise
docker-compose ps

# Tail logs
docker-compose logs -f web
docker-compose logs -f db

# Backup database manually
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U cycleparadise cycleparadise | \
  gzip > /opt/backups/postgres/manual_${TIMESTAMP}.sql.gz

# Restore database (downtime required)
cat /opt/backups/postgres/manual_20250101.sql.gz | gunzip | \
  docker-compose exec -T db psql -U cycleparadise cycleparadise

# Rotate and prune old Docker artifacts
docker system prune -af --volumes --filter "until=72h"
```

---

## 10. Next Steps

1. Add a Slack/Teams webhook to the workflow for deployment notifications.
2. Hook UptimeRobot / BetterStack to `https://cycleparadise.bike/health`.
3. Schedule `npm audit --production` and OS patching.
4. Continue with Phase 4+ admin features, tagging each release.

With this playbook, the infrastructure serves **cycleparadise.bike** securely, updates via Git tags, and stays production-ready with backups, monitoring, and hardened networking.
