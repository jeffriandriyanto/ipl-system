# PROJECT PLAN: IPL System - Manajemen Iuran Warga

> Aplikasi Manajemen Iuran Warga Perumahan & Kampung (White-Label Ready)

**Status:** Development
**Last Updated:** 2026-07-21

---

## Tech Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| Frontend | Nuxt 3 (Vue 3) | SSR/SSG, auto-routing, server API routes |
| UI | Nuxt UI (Tailwind-based) | Komponen Vue yang cantik |
| Backend | Nuxt Server Routes (Nitro) | Built-in, simple deployment |
| ORM | Prisma ORM | Type-safe, mudah migrate database |
| Database | PostgreSQL (Supabase) | SQL penuh, free tier 500MB |
| Auth | Supabase Auth | Gratis, support email/password |
| Storage | Supabase Storage | Untuk foto meteran, bukti bayar |
| Excel | SheetJS (xlsx) | Client-side, untuk template & export |
| Hosting | Netlify (free tier) | Deploy mudah, cukup untuk start |
| Tenant | Multi-tenant ready | White-label, bisa dijual |

---

## Keunggulan Tech Stack Ini

### Prisma ORM
```
┌─────────────────────────────────────────────────────────────┐
│                    PRISMA ORM                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Prisma = Translator antara CODE ↔ DATABASE                 │
│                                                             │
│  MANFAAT:                                                   │
│  ✅ Type-safe queries (auto-complete di VS Code)            │
│  ✅ Tulis code JavaScript, buhan SQL string                 │
│  ✅ Auto generate migration (ubah schema)                   │
│  ✅ Handle relasi antar tabel otomatis                      │
│  ✅ Ganti database mudah (PostgreSQL → MySQL → SQLite)      │
│                                                             │
│  MIGRATION PATH:                                            │
│  ├── Supabase → Shared Hosting (export SQL)                 │
│  ├── Ganti provider: "postgresql" → "mysql"                 │
│  └── Estimasi migrate: 1-2 hari                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Supabase Free Tier
```
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE FREE TIER                             │
├─────────────────────────────────────────────────────────────┤
│  Database:          500 MB PostgreSQL                       │
│  API Requests:      UNLIMITED                               │
│  Monthly Users:     50,000 MAU                              │
│  Bandwidth:         5 GB                                    │
│  File Storage:      1 GB                                    │
│                                                             │
│  ESTIMASI KAPASITAS:                                        │
│  ├── 30-40 tenants (100 rumah each) = SANGAT AMAN          │
│  ├── 50-60 tenants = AMAN (dengan archive)                  │
│  └── 70+ tenants = Perlu upgrade ($25/bulan)                │
│                                                             │
│  COST: Rp 0/bulan (sampai 50+ tenants!)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## White-Label Architecture

### Multi-Tenant Structure
```text
┌─────────────────────────────────────────────────────────────┐
│          MULTI-TENANT: SHARED DATABASE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1 DATABASE (PostgreSQL / MySQL Ready)                      │
│  ├── tenants/ (daftar semua perumahan)                      │
│  ├── users/ (dengan tenant_id)                              │
│  ├── rumah/ (dengan tenant_id)                              │
│  ├── tagihan/ (dengan tenant_id)                            │
│  └── ... (semua tabel ada tenant_id)                        │
│                                                             │
│  SETIAP QUERY SELALU FILTER tenant_id:                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ // Contoh Prisma Query di API Route                 │    │
│  │ const rumah = await prisma.rumah.findMany({         │    │
│  │    where: { tenant_id: event.context.user.tenant_id }│   │
│  │ })                                                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  KEAMANAN (APPLICATION LAYER ISOLATION):                    │
│  ├── Nuxt Server Middleware validasi Auth Token             │
│  ├── Inject `tenant_id` ke context request (H3 Event)       │
│  ├── Prisma Force Filter by `tenant_id` dari context        │
│  └── Database-Agnostic (Bypass RLS Postgres)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### White-Label Config
```
┌─────────────────────────────────────────────────────────────┐
│         WHITE-LABEL CONFIGURATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  tenants/ table:                                            │
│  ├── nama: "IPL Perumahan Waris 1"                         │
│  ├── slug: "ipl-waris1" (untuk URL)                         │
│  ├── logo: "https://..."                                    │
│  ├── primary_color: "#2563EB"                               │
│  ├── secondary_color: "#1E40AF"                             │
│  ├── footer_text: "© 2026 IPL Waris 1"                      │
│  ├── kontak: "0812xxxx"                                     │
│  ├── domain: "waris1.ipl-system.netlify.app"                │
│  ├── status: "aktif" | "trial" | "expired"                  │
│  └── expired_at: timestamp                                  │
│                                                             │
│  SUPER ADMIN:                                               │
│  ├── Manage semua tenants                                   │
│  ├── Set white-label config per tenant                      │
│  ├── Monitor usage                                          │
│  └── Set billing & subscription                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Akses & Role

### WARGA (Tanpa Login)
- `/cek-tagihan` - Input blok + nomor rumah → Lihat tagihan bulan ini saja
- **TANPA history** - hemat reads, cukup tahu berapa yang harus dibayar bulan ini
- Mobile-friendly design

### PETUGAS (Login Required)
- Input meteran per rumah
- Upload meteran via Excel
- Lihat rekap bulanan (read only)
- Hanya bisa edit data yang dia input

### ADMIN (Login Required)
- Semua fitur petugas
- Master data (kategori, rumah)
- Input pembayaran (single + multi-periode)
- Kas masuk/keluar manual
- Saldo lebih bayar management
- Tutup buku bulanan
- User management
- Laporan & export
- Audit trail

### SUPER ADMIN (Login Required - Terpisah)
- Manage semua tenants
- Set white-label config
- Monitor usage & billing
- Akses ke semua data tenant

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Multi-tenant support
model Tenant {
  id              String    @id @default(cuid())
  nama            String
  slug            String    @unique
  logo            String?
  primary_color   String    @default("#2563EB")
  secondary_color String    @default("#1E40AF")
  footer_text     String?
  kontak          String?
  domain          String?
  status          String    @default("aktif") // aktif, trial, expired
  expired_at      DateTime?
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  users           User[]
  kategori_iuran  KategoriIuran[]
  rumah           Rumah[]
  periode         Periode[]
  tagihan         Tagihan[]
  pembayaran      Pembayaran[]
  kas_transaksi   KasTransaksi[]
  audit_log       AuditLog[]
  settings        Settings?
}

model User {
  id          String   @id @default(cuid())
  tenant_id   String
  email       String
  nama        String
  role        String   // admin, petugas
  status      String   @default("aktif") // aktif, nonaktif
  telepon     String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenant_id], references: [id])
  @@unique([tenant_id, email])
  @@index([tenant_id])
}

model KategoriIuran {
  id            String   @id @default(cuid())
  tenant_id     String
  nama          String
  tipe          String   // meteran, flat
  tarif_flat    Int      @default(0)
  tarif_per_m3  Int      @default(0)
  minimum_kuota Int      @default(0)
  minimum_tarif Int      @default(0)
  status        String   @default("aktif") // aktif, nonaktif
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenant_id], references: [id])
  tagihan_detail TagihanDetail[]
  @@unique([tenant_id, nama])
  @@index([tenant_id])
}

model Rumah {
  id              String   @id @default(cuid())
  tenant_id       String
  blok            String
  nomor           String
  alamat          String?
  tipe            String   // pribadi, kontrakan, fasum
  status          String   @default("aktif") // aktif, nonaktif
  pic_nama        String?
  pic_telepon     String?
  pic_email       String?
  pemilik_nama    String?
  pemilik_telepon String?
  kategori_iuran  String[] // Array of kategori IDs
  keterangan      String?
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenant_id], references: [id])
  tagihan         Tagihan[]
  pembayaran      Pembayaran[]
  @@unique([tenant_id, blok, nomor])
  @@index([tenant_id])
}

model Periode {
  id            String   @id @default(cuid())
  tenant_id     String
  periode       String   // "2026-07"
  status        String   @default("draft") // draft, ditutup
  ditutup_pada  DateTime?
  ditutup_oleh  String?
  total_tagihan Int      @default(0)
  total_bayar   Int      @default(0)
  total_selisih Int      @default(0)
  jumlah_rumah  Int      @default(0)
  jumlah_lunas  Int      @default(0)
  jumlah_belum  Int      @default(0)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenant_id], references: [id])
  tagihan       Tagihan[]
  @@unique([tenant_id, periode])
  @@index([tenant_id])
}

model Tagihan {
  id              String   @id @default(cuid())
  tenant_id       String
  periode_id      String
  rumah_id        String
  blok            String
  nomor_rumah     String
  tipe_rumah      String
  status_penghuni String   @default("ada") // ada, kosong
  pic_nama        String?
  pic_telepon     String?
  total_tagihan   Int      @default(0)
  total_bayar     Int      @default(0)
  selisih         Int      @default(0)
  status          String   @default("belum_bayar") // belum_bayar, lunas, kurang, lebih
  saldo_lebih     Int      @default(0)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenant_id], references: [id])
  periode         Periode  @relation(fields: [periode_id], references: [id])
  rumah           Rumah    @relation(fields: [rumah_id], references: [id])
  items           TagihanDetail[]
  pembayaran      Pembayaran[]
  @@unique([tenant_id, periode_id, rumah_id])
  @@index([tenant_id])
  @@index([periode_id])
  @@index([rumah_id])
}

model TagihanDetail {
  id              String   @id @default(cuid())
  tagihan_id      String
  kategori_id     String
  kategori_nama   String
  tipe            String   // meteran, flat
  meter_lalu      Int?
  meter_sekarang  Int?
  pemakaian       Int?
  tagihan         Int

  tagihan         Tagihan  @relation(fields: [tagihan_id], references: [id])
  kategori        KategoriIuran @relation(fields: [kategori_id], references: [id])
  @@index([tagihan_id])
  @@index([kategori_id])
}

model Pembayaran {
  id            String   @id @default(cuid())
  tenant_id     String
  rumah_id      String
  tagihan_id    String
  periode       String
  jumlah        Int
  tanggal       DateTime
  metode        String   // transfer, cash
  keterangan    String?
  input_oleh    String
  created_at    DateTime @default(now())

  tenant        Tenant   @relation(fields: [tenant_id], references: [id])
  rumah         Rumah    @relation(fields: [rumah_id], references: [id])
  tagihan       Tagihan  @relation(fields: [tagihan_id], references: [id])
  @@index([tenant_id])
  @@index([rumah_id])
  @@index([tagihan_id])
}

model KasTransaksi {
  id            String   @id @default(cuid())
  tenant_id     String
  tipe          String   // masuk, keluar
  jumlah        Int
  tanggal       DateTime
  keterangan    String?
  kategori      String   // donasi, operasional, lainnya
  input_oleh    String
  created_at    DateTime @default(now())

  tenant        Tenant   @relation(fields: [tenant_id], references: [id])
  @@index([tenant_id])
}

model AuditLog {
  id            String   @id @default(cuid())
  tenant_id     String
  aksi          String   // create, update, delete
  koleksi       String
  dokumen_id    String
  perubahan     Json     // { before: {}, after: {} }
  user_id       String
  user_nama     String
  timestamp     DateTime @default(now())

  tenant        Tenant   @relation(fields: [tenant_id], references: [id])
  @@index([tenant_id])
  @@index([timestamp])
}

model Settings {
  id             String @id @default(cuid())
  tenant_id      String @unique
  nama_aplikasi  String
  nama_perumahan String?
  alamat         String?
  kontak         String?

  tenant         Tenant @relation(fields: [tenant_id], references: [id])
  @@index([tenant_id])
}
```

---

## Billing Logic

### Tipe FLAT (Sampah, Keamanan, dll)
```
tagihan = tarif_flat
```

### Tipe METERAN (Air)
```
if (pemakaian <= minimum_kuota) {
  tagihan = minimum_tarif;
} else {
  kelebihan = pemakaian - minimum_kuota;
  tagihan = minimum_tarif + (kelebihan * tarif_per_m3);
}
```

### Contoh Perhitungan
```
Kasus 1: Pemakaian 7m³ (≤ 10m³)
- Sampah: Rp 25.000 (flat)
- Air: Rp 25.000 (minimum)
- TOTAL: Rp 50.000

Kasus 2: Pemakaian 15m³ (> 10m³)
- Sampah: Rp 25.000 (flat)
- Air: Rp 25.000 + (5 × Rp 3.000) = Rp 40.000
- TOTAL: Rp 65.000

Kasus 3: FASUM (hanya Air, 10m³)
- Air: Rp 25.000 (minimum)
- TOTAL: Rp 25.000
```

### Kategori Iuran per Rumah
```
Setiap rumah bisa punya kategori iuran yang berbeda:

Rumah A-12 (pribadi):
├── kategori_iuran: ["air", "sampah"]
└── Tagihan: Air + Sampah

FASUM-1 (masjid):
├── kategori_iuran: ["air"]
└── Tagihan: Air saja

Rumah B-5 (pribadi):
├── kategori_iuran: ["air", "sampah", "keamanan"]
└── Tagihan: Air + Sampah + Keamanan
```

---

## Validation Rules

### Input Meteran
- ✅ Meter sekarang >= meter lalu (wajib)
- ⚠️ Meter sekarang < meter lalu → ALERT (admin bisa override, wajib keterangan)
- ✅ Meter sekarang = meter lalu → Konfirmasi (rumah kosong/tidak pakai)

### Pembayaran
- ✅ Jumlah bayar > 0 (wajib)
- ✅ Bisa bayar lebih dari tagihan → saldo lebih
- ✅ Bisa bayar untuk beberapa bulan sekaligus
- ✅ Tanggal bayar harus valid

### Master Rumah
- ✅ Blok + Nomor harus unik (per tenant)
- ✅ Tipe wajib: pribadi/kontrakan/fasum
- ✅ Status wajib: aktif/nonaktif
- ✅ PIC_nama wajib jika status aktif
- ✅ kategori_iuran wajib minimal 1

### Master Kategori
- ✅ Nama kategori harus unik (per tenant)
- ✅ Tipe wajib: flat/meteran
- ✅ Jika meteran: tarif_per_m3, minimum_kuota wajib
- ✅ Jika flat: tarif_flat wajib

### Tutup Buku
- ✅ Semua rumah aktif harus ada tagihan
- ✅ Semua meteran harus sudah diinput
- ✅ Konfirmasi sebelum tutup (tidak bisa undo)

---

## Fitur Multi-Periode Payment

```
Contoh: Warga bayar 3 bulan sekaligus

┌─────────────────────────────────────────────┐
│ Rumah: A-12                                 │
│                                             │
│ Periode yang belum bayar:                   │
│ ☑ Mei 2026    → Tagihan: Rp 50.000         │
│ ☑ Juni 2026   → Tagihan: Rp 65.000         │
│ ☑ Juli 2026   → Tagihan: Rp 55.000         │
│                                             │
│ Total Tagihan: Rp 170.000                   │
│ Jumlah Bayar: [Rp 200.000]                  │
│                                             │
│ Alokasi:                                    │
│ Mei 2026   ← Rp 50.000  → Lunas            │
│ Juni 2026  ← Rp 65.000  → Lunas            │
│ Juli 2026  ← Rp 55.000  → Lunas            │
│ Sisa       ← Rp 30.000  → Saldo lebih      │
└─────────────────────────────────────────────┘
```

---

## Fitur Saldo Lebih Bayar (Manual)

```
Menu: /admin/saldo-lebih

- Tercatat di data tagihan rumah
- Admin bisa lihat daftar rumah dengan saldo lebih
- Admin bisa adjust manual:
  → Kurangi tagihan bulan depan
  → Atau biarkan sampai warga konfirmasi
- Setiap adjust tercatat di audit_log
```

---

## Page Routes

```
/                           → Redirect ke /cek-tagihan
/cek-tagihan                → Warga cek tagihan (tanpa login, tanpa history)

/login                      → Login admin/petugas

/admin                      → Dashboard (statistik)
/admin/kategori             → CRUD kategori iuran
/admin/rumah                → CRUD master rumah + Excel
/admin/meteran              → Input meteran + rekap
/admin/meteran/upload       → Upload Excel meteran
/admin/pembayaran           → Input pembayaran (single + multi)
/admin/pembayaran/upload    → Upload Excel pembayaran
/admin/kas                  → Kas masuk/keluar manual
/admin/saldo-lebih          → Daftar rumah dengan saldo lebih
/admin/tutup-buku           → Tutup buku bulanan
/admin/users                → User management
/admin/audit-log            → Audit trail
/admin/laporan              → Laporan & export Excel
/admin/settings             → Pengaturan white-label

/super-admin                → Super admin dashboard
/super-admin/tenants        → Manage tenants
/super-admin/billing        → Billing & subscription
/super-admin/monitoring     → Monitoring usage
```

---

## Landing Page Warga (Tanpa History)

```
┌─────────────────────────────────────────────┐
│         CEK TAGIHAN                         │
├─────────────────────────────────────────────┤
│                                             │
│  [Logo Perumahan] ← Dynamic dari tenant     │
│                                             │
│  Blok: [▼ Pilih]                            │
│  No. Rumah: [▼ Pilih]                       │
│                                             │
│  [CEK TAGIHAN]                              │
│                                             │
│  ─────────────────────────────────────────  │
│  Blok: A-12                                 │
│  Periode: Juli 2026                         │
│                                             │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Jenis    │ Pakai    │ Tagihan  │        │
│  ├──────────┼──────────┼──────────┤        │
│  │ Air      │ 15 m³    │ Rp40.000 │        │
│  │ Sampah   │ -        │ Rp25.000 │        │
│  ├──────────┼──────────┼──────────┤        │
│  │ TOTAL    │          │ Rp65.000 │        │
│  └──────────┴──────────┴──────────┘        │
│                                             │
│  Status: BELUM LUNAS                        │
│                                             │
│  [Footer dari tenant config]                │
│                                             │
└─────────────────────────────────────────────┘

READ COST: 3 queries (cached = 1 query)
- Load blok: 1 (cached)
- Load nomor: 1 (cached)
- Load tagihan: 1
```

---

## Input Meteran Workflow

```
┌─────────────────────────────────────────────────────────────┐
│         INPUT METERAN BULANAN                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Petugas input per rumah:                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Rumah: A-12                                         │    │
│  │ Tipe: Kontrakan                                     │    │
│  │                                                     │    │
│  │ Status Penghuni: [▼ Ada / Kosong]                   │    │
│  │ → Default: dari master, tapi bisa diubah            │    │
│  │ → Jika kosong: TIDAK PERLU input meteran            │    │
│  │                                                     │    │
│  │ PIC Bulan Ini: [Andi           ]                    │    │
│  │ → Default: dari master, tapi bisa diubah            │    │
│  │                                                     │    │
│  │ [Jika status=ada]                                   │    │
│  │ Meter Lalu: 100 (auto dari bulan lalu)              │    │
│  │ Meter Skrg: [150      ]                             │    │
│  │                                                     │    │
│  │ [SIMPAN]                                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  LOGIKA:                                                    │
│  ✅ Jika status_penghuni=kosong → skip, tidak ditagih       │
│  ✅ Jika status_penghuni=ada → wajib input meteran          │
│  ✅ Kontrakan: status bisa berubah tiap bulan               │
│  ✅ Pribadi: status selalu "ada" (kecuali kosong/renovasi)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
ipl-system/
├── nuxt.config.ts
├── package.json
├── .env
├── .env.example
├── prisma/
│   └── schema.prisma
├── pages/
│   ├── index.vue                 # Redirect → /cek-tagihan
│   ├── cek-tagihan.vue           # Landing page warga (mobile-friendly, tanpa history)
│   ├── login.vue                 # Login
│   └── admin/
│       ├── index.vue             # Dashboard
│       ├── kategori.vue          # Master kategori
│       ├── rumah.vue             # Master rumah + Excel
│       ├── meteran.vue           # Input meteran
│       ├── pembayaran.vue        # Input pembayaran (single + multi)
│       ├── kas.vue               # Kas masuk/keluar
│       ├── saldo-lebih.vue       # Daftar saldo lebih
│       ├── tutup-buku.vue        # Tutup buku bulanan
│       ├── users.vue             # User management
│       ├── audit-log.vue         # Audit trail
│       ├── laporan.vue           # Laporan & export
│       └── settings.vue          # Pengaturan white-label
├── components/
│   ├── FormKategori.vue
│   ├── FormRumah.vue
│   ├── FormMeteran.vue
│   ├── FormPembayaran.vue
│   ├── FormKas.vue
│   ├── FormUser.vue
│   ├── TabelRekap.vue
│   ├── TagihanCard.vue           # Landing page warga (tanpa history)
│   ├── AuditLogTable.vue
│   ├── UploadExcel.vue
│   └── DownloadTemplate.vue
├── composables/
│   ├── usePrisma.ts
│   ├── useAuth.ts
│   ├── useBilling.ts
│   ├── useAudit.ts
│   └── useCache.ts
├── server/
│   ├── api/
│   │   ├── tagihan/
│   │   │   ├── generate.post.ts
│   │   │   └── [rumah].get.ts
│   │   ├── pembayaran/
│   │   │   └── batch.post.ts
│   │   ├── tutup-buku/
│   │   │   └── [periode].post.ts
│   │   └── laporan/
│   │       └── export.get.ts
│   └── utils/
│       ├── prisma.ts
│       ├── billing.ts
│       ├── validation.ts
│       └── excel.ts
├── plugins/
│   └── auth.ts
├── middleware/
│   └── auth.ts
├── layouts/
│   ├── default.vue               # Public layout
│   └── admin.vue                 # Admin layout with sidebar
└── public/
    └── templates/
        ├── template-rumah.xlsx
        ├── template-meteran.xlsx
        └── template-pembayaran.xlsx
```

---

## Excel Templates

### 1. Template Master Rumah
| NO | BLOK | NO RUMAH | TIPE | STATUS | PIC | TELEPON | KATEGORI IURAN | KETERANGAN |
|----|------|----------|------|--------|-----|---------|----------------|------------|
| 1  | A    | 1        | pribadi | aktif | Budi | 0812xxx | air,sampah | |
| 2  | A    | 2        | kontrakan | aktif | Andi | 0813xxx | air,sampah | Dikontrakkan |
| 3  | FASUM | 1       | fasum | aktif | Pengurus | 0814xxx | air | Masjid |

### 2. Template Meteran
| NO | BLOK | NO RUMAH | STATUS PENGHUNI | PIC BULAN INI | METER LALU | METER SKRG | KETERANGAN |
|----|------|----------|-----------------|---------------|------------|------------|------------|
| 1  | A    | 1        | ada | Budi | 100 | 150 | |
| 2  | A    | 2        | kosong | - | - | - | Kontrakan kosong |
| 3  | FASUM | 1       | ada | Pengurus | 50 | 60 | Masjid |

### 3. Template Pembayaran
| NO | BLOK | NO RUMAH | PERIODE | BAYAR RP | KETERANGAN |
|----|------|----------|---------|----------|------------|
| 1  | A    | 1        | 2026-07 | 50000    | Transfer BCA |
| 2  | A    | 2        | 2026-07 | 65000    | Cash |
| 3  | FASUM | 1       | 2026-07 | 25000    | Transfer |

---

## Development Phases

### Phase 1 (Minggu 1-2): FOUNDATION
- [ ] Setup Nuxt 3 + Prisma + Supabase
- [ ] Supabase Auth (login/logout)
- [ ] User Management (CRUD)
- [ ] Middleware auth (route guard)
- [ ] Master Kategori Iuran (CRUD)
- [ ] Master Rumah (CRUD + Excel upload/download)

### Phase 2 (Minggu 3-4): CORE BILLING
- [ ] Input meteran per rumah (form)
- [ ] Validation (meter mundur, dll)
- [ ] Billing calculation engine (support kategori per rumah)
- [ ] Generate tagihan per periode
- [ ] Rekap tabel bulanan
- [ ] Audit trail system

### Phase 3 (Minggu 5): PAYMENT & CASH
- [ ] Input pembayaran single periode
- [ ] Input pembayaran multi-periode (bayar 3 bulan)
- [ ] Upload pembayaran via Excel
- [ ] Auto hitung selisih (lebih/kurang)
- [ ] Saldo lebih bayar management
- [ ] Kas masuk/keluar manual

### Phase 4 (Minggu 6): EXCEL & TUTUP BUKU
- [ ] Download template Excel (rumah, meteran, pembayaran)
- [ ] Upload & validasi Excel
- [ ] Export laporan ke Excel
- [ ] Tutup buku bulanan
- [ ] Validasi sebelum tutup buku

### Phase 5 (Minggu 7): LANDING PAGE WARGA
- [ ] Cek tagihan (tanpa login, TANPA history)
- [ ] Dropdown filter (blok + nomor rumah)
- [ ] Tampilan tagihan detail + status
- [ ] Mobile-friendly design

### Phase 6 (Minggu 8): POLISH & DEPLOY
- [ ] Dashboard admin dengan statistik
- [ ] Audit log viewer
- [ ] Laporan lengkap + export
- [ ] Responsive design check
- [ ] Testing semua fitur
- [ ] Deploy ke Netlify

### Phase 7 (Future): WHITE-LABEL & SUPER ADMIN
- [ ] Super admin panel
- [ ] Manage tenants
- [ ] White-label config per tenant
- [ ] Billing & subscription
- [ ] Monitoring usage

---

## Optimasi Database

### Query Optimization
```
1. INDEX pada kolom yang sering di-query:
   - tenant_id (semua tabel)
   - periode_id (tagihan)
   - rumah_id (tagihan, pembayaran)
   - timestamp (audit_log)

2. Pagination:
   - List rumah: 20 per halaman
   - Audit log: 50 per halaman
   - Pembayaran: filter tanggal

3. Caching:
   - Master kategori: cache di client
   - Master rumah: cache di client
   - Tenant config: cache di client

4. Batch Operations:
   - Generate tagihan: batch insert
   - Upload Excel: batch insert
   - Multi-periode payment: batch update
```

### Estimate (100 Rumah per Tenant)
```
Landing page cek tagihan (1x): 3 queries (cached = 1)
Buka admin dashboard: 10-20 queries
Input meteran 1 rumah: 2 queries, 3 writes
Input meteran Excel (100): 1 query, 100 writes (batch)
Upload pembayaran Excel (50): 50 writes (batch)

Harian (normal): ~70 queries, ~20 writes → AMAN!
```

---

## Responsive Design

### Landing Page Warga (`/cek-tagihan`)
- Mobile-first design
- Touch-friendly buttons & inputs
- Card layout untuk tagihan
- Mudah dibaca di layar kecil
- Dropdown filter (hemat queries)

### Admin Panel (`/admin/*`)
- Desktop-style layout
- Responsive (bisa diakses dari HP)
- Sidebar navigation
- Table bisa scroll horizontal
- Form tetap usable di mobile

---

## Backup Strategy

### Export Manual (per bulan)
- Export rekap tagihan → Excel
- Export rekap pembayaran → Excel
- Export daftar rumah → Excel
- Export audit log → Excel

### SQL Backup
- Supabase: Export SQL dump dari dashboard
- Shared hosting: mysqldump / pg_dump
- Simpan backup di Google Drive / local

### Kapan Export
- Setelah tutup buku bulanan
- Simpan file Excel di komputer/Google Drive

---

## Role Permissions Matrix

| Fitur | Super Admin | Admin | Petugas |
|-------|-------------|-------|---------|
| Manage Tenants | ✅ | ❌ | ❌ |
| White-Label Config | ✅ | ✅ (sendiri) | ❌ |
| Master Kategori | ✅ | ✅ CRUD | ❌ |
| Master Rumah | ✅ | ✅ CRUD | ❌ |
| Input Meteran | ✅ | ✅ CRUD | ✅ Create |
| Input Pembayaran | ✅ | ✅ CRUD | ❌ |
| Kas Masuk/Keluar | ✅ | ✅ CRUD | ❌ |
| Tutup Buku | ✅ | ✅ | ❌ |
| User Management | ✅ | ✅ (sendiri) | ❌ |
| Audit Trail | ✅ | ✅ View | ❌ |
| Laporan | ✅ | ✅ Full | ✅ Limited |

---

## Total Fitur Summary

| Kategori | Jumlah Fitur |
|----------|--------------|
| Master Data | 2 (kategori + rumah) |
| Input Bulanan | 2 (meteran + rekap) |
| Pembayaran | 3 (single + multi + Excel) |
| Kas Manual | 2 (masuk + keluar) |
| Saldo Lebih | 1 (management + adjust) |
| Tutup Buku | 1 (dengan validasi) |
| User Management | 1 (CRUD + role) |
| Audit Trail | 1 (log semua aksi) |
| Landing Page | 1 (cek tagihan, tanpa history) |
| Laporan | 4 (tagihan, bayar, tunggakan, kas) |
| Excel | 6 (3 download template + 3 export) |
| White-Label | 4 (tenants, config, billing, monitoring) |
| **TOTAL** | **28 fitur utama** |

---

## Migration Path

### Supabase → Shared Hosting (MySQL)
```
1. Export SQL dump dari Supabase
2. Import ke MySQL di shared hosting
3. Ganti provider di schema.prisma:
   provider = "postgresql" → provider = "mysql"
4. Run: npx prisma migrate dev
5. Ganti connection string di .env
6. Deploy backend Express/Laravel
7. Selesai! Estimasi: 1-2 hari
```

### Supabase → Shared Hosting (PostgreSQL)
```
1. Export SQL dump dari Supabase
2. Import ke PostgreSQL di shared hosting
3. Ganti connection string di .env
4. Deploy backend Express/Laravel
5. Selesai! Estimasi: 1 hari
```

---

*Document ini akan diupdate sesuai progress development.*
