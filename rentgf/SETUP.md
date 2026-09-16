# RentGF - Production Setup Guide

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL) via Prisma ORM
- **Payments**: Razorpay
- **Email**: Resend
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Deployment**: Cloudflare Pages / Vercel

---

## Quick Start

```bash
cd rentgf
npm install
cp .env.example .env.local
# Fill in your .env.local values (see below)
npx prisma generate
npx prisma db push
npm run dev
```

---

## Supabase Database Setup ✅

**Project already created:** `GfRent` (ID: `qhrjkwvfujpzuurttkdx`, Region: ap-northeast-1)

### Step 1 — Get your connection strings

1. Go to [Supabase Dashboard → Your Project → Settings → Database](https://supabase.com/dashboard/project/qhrjkwvfujpzuurttkdx/settings/database)
2. Scroll to **Connection string** section
3. Copy two URLs:

| Variable | Connection Type | Port |
|---|---|---|
| `DATABASE_URL` | **Transaction** pooler (PgBouncer) | 6543 |
| `DIRECT_URL` | **Direct** connection | 5432 |

### Step 2 — Set in .env.local

```env
DATABASE_URL="postgresql://postgres.qhrjkwvfujpzuurttkdx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qhrjkwvfujpzuurttkdx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

Replace `[YOUR-PASSWORD]` with your Supabase project password.

### Step 3 — Generate Prisma Client

```bash
npx prisma generate
```

> **Note:** `prisma db push` is NOT needed — the Supabase database schema is already set up.

### Step 4 — Set Admin User

```sql
-- Run in Supabase SQL editor
UPDATE public.profiles SET role = 'ADMIN', is_admin = true WHERE email = 'your-admin@email.com';
```

---

## Required Environment Variables

| Variable | Description | Where to get |
|---|---|---|
| `DATABASE_URL` | Supabase Transaction pooler URL (port 6543) | Supabase Dashboard → Settings → Database |
| `DIRECT_URL` | Supabase Direct connection URL (port 5432) | Same as above |
| `NEXTAUTH_SECRET` | JWT signing secret (32+ chars) | `openssl rand -base64 32` |
| `RAZORPAY_KEY_ID` | Razorpay public key | dashboard.razorpay.com |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | dashboard.razorpay.com |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as KEY_ID (frontend) | Same as above |
| `RESEND_API_KEY` | Email sending | resend.com |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key | Cloudflare R2 settings |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret | Cloudflare R2 settings |
| `R2_BUCKET_NAME` | R2 bucket name | dash.cloudflare.com/r2 |
| `R2_PUBLIC_URL` | Public URL for R2 bucket | Cloudflare R2 bucket settings |

---

## Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Settings → API Keys → Generate Key ID and Secret
3. Add to `.env.local`
4. Complete KYC for live payments

---

## Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Verify your sender domain
3. Create API key → add to `RESEND_API_KEY`

---

## File Storage (Cloudflare R2)

1. Cloudflare Dashboard → R2 → Create bucket `rentgf-uploads`
2. Create R2 API token with read/write
3. Enable public access on the bucket
4. Add all R2 variables to `.env.local`

---

## Deployment

### Vercel (recommended)
1. Import GitHub repo in Vercel
2. Add all environment variables
3. Deploy

### Cloudflare Pages
1. Connect GitHub repo
2. Build command: `npm run build`
3. Output: `.next`
4. Add env vars → Deploy

---

## Production Checklist

- [x] Supabase database created and schema deployed
- [ ] `DATABASE_URL` + `DIRECT_URL` set in .env.local
- [ ] `npx prisma generate` run successfully
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] Razorpay KYC completed for live payments
- [ ] Resend domain verified
- [ ] R2 bucket created with public access
- [ ] Admin user role set in Supabase
- [ ] All env vars set in hosting platform
