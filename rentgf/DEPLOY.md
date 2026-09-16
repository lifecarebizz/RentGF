# RentGF — Deployment Guide

## Recommended: Railway (Easiest)

Railway Next.js ko automatically detect karta hai, database bhi provide karta hai.

1. [railway.app](https://railway.app) pe jao → **New Project**
2. **Deploy from GitHub** select karo
3. Apna repo (`RentGF`) select karo
4. Root directory set karo: `rentgf`
5. Railway auto-detect karega: Build = `npm run build`, Start = `npm start`
6. **Add PostgreSQL** → Railway ek database attach karega, `DATABASE_URL` automatically set ho jaayega
7. Baaki env vars **Variables** tab mein add karo (`.env.example` dekho)
8. Deploy!

---

## Alternative: Render

1. [render.com](https://render.com) → **New Web Service**
2. GitHub repo connect karo
3. Settings:
   - Root directory: `rentgf`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
4. Add PostgreSQL database (Render ka free tier hai)
5. Env vars add karo

---

## Alternative: VPS (DigitalOcean / Hetzner)

```bash
git clone https://github.com/lifecarebizz/RentGF
cd RentGF/rentgf
npm install
cp .env.example .env
# .env fill karo
npm run build
npm start
```

PM2 se background mein chalao:
```bash
npm install -g pm2
pm2 start npm --name rentgf -- start
pm2 save
```

---

## Environment Variables

Sab variables `.env.example` mein hain. Must-have:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | 32+ char random secret |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as KEY_ID |
| `RESEND_API_KEY` | Email API key |
| `EMAIL_FROM` | Verified sender email |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | R2 public URL |
| `NEXT_PUBLIC_APP_URL` | Your app's live URL |

---

## After Deployment

```bash
# Run DB migrations
npx prisma db push

# Set admin user
# Run this SQL on your database:
# UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```
