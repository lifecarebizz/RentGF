# RentGF - Production Setup Guide

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Razorpay
- **Email**: Resend
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Deployment**: Cloudflare Pages

---

## Quick Start

```bash
cd rentgf
npm install
cp .env.example .env.local
# Fill in your .env.local values
npx prisma db push
npm run dev
```

---

## Required Environment Variables

See `.env.example` for all variables. The critical ones are:

| Variable | Description | Where to get |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Neon, Supabase, Railway |
| `NEXTAUTH_SECRET` | JWT signing secret (32+ chars) | Generate: `openssl rand -base64 32` |
| `RAZORPAY_KEY_ID` | Razorpay public key | dashboard.razorpay.com |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | dashboard.razorpay.com |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as KEY_ID (for frontend) | Same as above |
| `RESEND_API_KEY` | Email sending | resend.com |
| `R2_ACCOUNT_ID` | Cloudflare account ID | dash.cloudflare.com |
| `R2_ACCESS_KEY_ID` | R2 access key | Cloudflare R2 settings |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | Cloudflare R2 settings |
| `R2_BUCKET_NAME` | R2 bucket name | Create at dash.cloudflare.com/r2 |
| `R2_PUBLIC_URL` | Public URL for your R2 bucket | Cloudflare R2 bucket settings |

---

## Database Setup

1. Create a PostgreSQL database (recommended: [Neon](https://neon.tech) — free tier)
2. Copy your connection string to `DATABASE_URL`
3. Run migrations:
   ```bash
   npx prisma db push
   ```
4. (Optional) Seed sample data:
   ```bash
   npm run db:seed
   ```

---

## Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Generate Key ID and Secret
4. Add to `.env.local`
5. For production, complete KYC on Razorpay dashboard

---

## Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Verify your sender domain or use sandbox email
3. Create API key and add to `RESEND_API_KEY`
4. Set `EMAIL_FROM` to your verified sender address

---

## File Storage Setup (Cloudflare R2)

1. Go to [Cloudflare dashboard](https://dash.cloudflare.com) → R2
2. Create a bucket named `rentgf-uploads`
3. Create R2 API token with read/write permissions
4. Enable public access or custom domain for the bucket
5. Add all R2 variables to `.env.local`

---

## Cloudflare Pages Deployment

1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `.next`
4. Add all environment variables in Cloudflare Pages settings
5. Set framework preset: **Next.js**

---

## Admin User Setup

After first deploy, manually set a user's role to ADMIN in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
```

---

## Production Checklist

- [ ] `NEXTAUTH_SECRET` is a strong random string (not the default)
- [ ] Database migrations run (`prisma db push`)
- [ ] Razorpay KYC completed for live payments
- [ ] Resend domain verified
- [ ] R2 bucket created with public access configured
- [ ] Admin user role set in database
- [ ] All env vars set in Cloudflare Pages
