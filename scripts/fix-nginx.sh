#!/bin/bash
# Fix Nginx configuration for Cycle Paradise
# Run this script on your server with: sudo bash fix-nginx.sh

set -e

echo "=== Creating backup of current config ==="
cp /etc/nginx/sites-available/cycleparadise /etc/nginx/sites-available/cycleparadise.backup.$(date +%Y%m%d_%H%M%S)

echo "=== Creating correct Nginx configuration ==="
cat > /etc/nginx/sites-available/cycleparadise <<'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream backend
upstream cycleparadise_backend {
    server 127.0.0.1:4321;
    keepalive 64;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name cycleparadise.bike www.cycleparadise.bike;
    
    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cycleparadise.bike www.cycleparadise.bike;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/cycleparadise.bike/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cycleparadise.bike/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Client body size limit
    client_max_body_size 10M;
    
    # Proxy to Node.js application
    location / {
        proxy_pass http://cycleparadise_backend;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # Health check endpoint (optional - allow direct access)
    location /health {
        proxy_pass http://cycleparadise_backend;
        access_log off;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://cycleparadise_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "=== Testing Nginx configuration ==="
nginx -t

if [ $? -eq 0 ]; then
    echo "=== Reloading Nginx ==="
    systemctl reload nginx
    
    echo "=== Nginx status ==="
    systemctl status nginx --no-pager | head -20
    
    echo ""
    echo "✅ Nginx configuration fixed and reloaded successfully!"
    echo ""
    echo "Testing connections..."
    sleep 2
    
    echo "=== Testing HTTPS connection ==="
    curl -I https://cycleparadise.bike 2>&1 | head -10
    
    echo ""
    echo "🎉 Your site should now be accessible at https://cycleparadise.bike"
else
    echo "❌ Nginx configuration test failed. Not reloading."
    exit 1
fi
