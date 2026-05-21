# Portal Lapor Kendala IT

Website laporan kendala IT dengan notifikasi langsung ke WhatsApp engineer via **Fonnte API**. Dibangun dengan Next.js (JavaScript) dan siap di-deploy ke **Vercel**.

## Fitur

- 2 tipe laporan: **Incident** & **Request**
- Form: Nama, Lokasi/Lantai, No. HP, Deskripsi
- Generate **Ticket ID** otomatis (INC-xxxxxx / REQ-xxxxxx)
- Notifikasi WhatsApp ke **1 atau banyak engineer sekaligus**
- Tampilan modern: gradient, rounded, floating blob animasi
- Token Fonnte aman di backend (serverless function)
- Responsive (desktop & mobile)

## Struktur Folder

```
lapor-kendala/
├── pages/
│   ├── _app.js
│   ├── index.js          # Frontend utama (3 step)
│   └── api/
│       └── lapor.js      # Serverless endpoint kirim Fonnte
├── styles/
│   └── globals.css
├── .env.example
├── package.json
└── next.config.js
```

## Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Copy file env dan isi token
cp .env.example .env.local
# Edit .env.local, isi FONNTE_TOKEN dan ENGINEER_WA

# 3. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Deploy ke Vercel

### Via Dashboard (recommended)

1. Push folder ini ke repository GitHub
2. Buka [vercel.com](https://vercel.com), klik **Add New Project**
3. Import repository tersebut
4. Sebelum klik **Deploy**, expand **Environment Variables** dan tambahkan:
   - `FONNTE_TOKEN` → token dari dashboard Fonnte
   - `ENGINEER_WA` → nomor engineer (format `628xxxxxxxxxx`)
5. Klik **Deploy**

### Via CLI

```bash
npm install -g vercel
vercel
# lalu set env via dashboard atau: vercel env add FONNTE_TOKEN
```

## Cara Dapat Token Fonnte

1. Daftar di [fonnte.com](https://fonnte.com)
2. Hubungkan perangkat WhatsApp (scan QR seperti WhatsApp Web)
3. Buka menu **Device** → copy **token API**
4. Set sebagai env `FONNTE_TOKEN` di Vercel

## Format Pesan WhatsApp yang Diterima Engineer

```
🚨 *LAPORAN INCIDENT*
━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket ID*  : INC-123456
🕒 *Waktu*      : 21 Mei 2026, 14.30 WIB
👤 *Pelapor*    : Muhammad Arif
📍 *Lokasi*     : Lantai 11
━━━━━━━━━━━━━━━━━━━━
📄 *Deskripsi:*
Tidak bisa akses email Outlook sejak pagi...
━━━━━━━━━━━━━━━━━━━━
_Pesan otomatis dari Portal Lapor Kendala_
```

## Ganti Nomor Engineer

Edit env `ENGINEER_WA` di Vercel dashboard → **Settings** → **Environment Variables**. Setelah save, redeploy project supaya perubahan aktif.

## Customisasi

- **Format pesan**: edit `pages/api/lapor.js`
- **Tampilan**: edit `pages/index.js` & `styles/globals.css`
- **Warna gradient**: edit CSS variable `--primary`, `--primary-2`, `--primary-3` di `globals.css`
