# IPL System - Manajemen Iuran Warga

Aplikasi Manajemen Iuran Warga Perumahan & Kampung (White-Label Ready)

## Tech Stack

- **Frontend:** Nuxt 3 (Vue 3)
- **UI:** Nuxt UI (Tailwind CSS)
- **ORM:** Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Hosting:** Netlify

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `NUXT_AUTH_SECRET` - Random secret for auth

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## CI/CD Setup (GitHub Actions + Netlify)

### 1. Setup Netlify

1. Create a new site on [Netlify](https://netlify.com)
2. Get your **Site ID** from Site Settings > General
3. Generate a **Personal Access Token** from User Settings > Applications

### 2. Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NUXT_AUTH_SECRET` | Random secret for auth |
| `NETLIFY_AUTH_TOKEN` | Netlify Personal Access Token |
| `NETLIFY_SITE_ID` | Netlify Site ID |

### 3. Push to Main

Once secrets are configured, push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

The GitHub Action will:
1. Run CI checks (lint, typecheck, build)
2. Deploy to Netlify automatically

## Features

- ✅ Multi-tenant (White-Label Ready)
- ✅ Master Data (Kategori Iuran, Rumah)
- ✅ Input Meteran (Form & Excel)
- ✅ Billing Calculation (Flat & Meteran)
- ✅ Pembayaran (Single & Multi-Periode)
- ✅ Kas Masuk/Keluar
- ✅ Tutup Buku Bulanan
- ✅ User Management
- ✅ Audit Trail
- ✅ Laporan & Export Excel
- ✅ Landing Page Warga (Cek Tagihan)

## Project Structure

```
ipl-system/
├── pages/          # Nuxt pages
├── components/     # Vue components
├── composables/    # Vue composables
├── layouts/        # Nuxt layouts
├── middleware/      # Nuxt middleware
├── server/         # Server API routes
│   ├── api/        # API endpoints
│   └── utils/      # Server utilities
├── prisma/         # Prisma schema
└── public/         # Static assets
```

## License

Private - IPL System
