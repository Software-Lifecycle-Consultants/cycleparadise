/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly DIRECT_URL: string;
  readonly SESSION_SECRET: string;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  readonly FROM_EMAIL: string;
  readonly ADMIN_EMAIL: string;
  readonly CONTACT_EMAIL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly IMAGE_QUALITY: string;
  readonly MAX_IMAGE_SIZE: string;
  readonly NODE_ENV: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user?: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: number;
    };
  }
}
