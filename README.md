# ☕ Casa Neira Coffee — QRIS Payment System

Sistem pemesanan dan pembayaran digital berbasis **QRIS** untuk **Casa Neira Coffee**. Dibangun dengan React + Express, memungkinkan pelanggan memesan menu dan membayar langsung melalui scan QRIS.

## Fitur

- 📋 **Katalog Menu** — Lihat dan filter menu Coffee/Non-Coffee, lengkap dengan harga
- 🛒 **Keranjang Belanja** — Tambah pesanan dengan catatan khusus (less sugar, less ice, dll)
- 🏠 **Dine In / Take Away** — Pilih metode pemesanan dengan nomor meja untuk Dine In
- 💳 **Pembayaran QRIS** — Generate QR Code pembayaran via **Pakasir** payment gateway
- 🔄 **Polling Status** — Cek status pembayaran otomatis setiap 5 detik
- 🖨️ **Cetak Struk & Nota** — Cetak struk thermal 80mm dan nota pesanan untuk dapur
- 📱 **Responsive** — Tampilan mobile-friendly

## Tech Stack

### Frontend
- **React** ^19.2 — Library UI
- **Vite** ^8.0 — Build tool & dev server
- **React Router DOM** ^6.30 — Client-side routing
- **Tailwind CSS** ^4.3 — Utility-first styling
- **Framer Motion** ^12.40 — Animasi
- **Lucide React** — Ikon SVG
- **qrcode.react** — Generate QR Code
- **Supabase JS** ^2.108 — Client database (cadangan)

### Backend
- **Node.js** + **Express** ^5.1 — REST API server
- **Pakasir API** — Payment gateway QRIS
- **CORS** + **dotenv** — Middleware & environment config

### Database
- **Supabase (PostgreSQL)** — Terinisialisasi, siap pakai untuk pengembangan selanjutnya

## Arsitektur

```
Browser → React SPA → Vite Proxy (/api) → Express Server → Pakasir API
                          ↕
                   sessionStorage (cart & customer data)
```

Data pesanan disimpan di `sessionStorage` — cocok untuk skenario kiosk tanpa perlu login. Backend bertindak sebagai proxy tipis ke API Pakasir untuk membuat transaksi QRIS dan mengecek status pembayaran.

## Cara Menjalankan

### Prasyarat
- Node.js >= 18
- npm

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/username/projek-coffeeshop.git
cd projek-coffeeshop

# Install frontend
npm install

# Install backend
cd server
npm install
cd ..
```

### 2. Setup Environment Variables

**Frontend** — salin `.env.example` ke `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

**Backend** — salin `server/.env.example` ke `server/.env`:
```env
PORT=5000
PAKASIR_API_KEY=your_pakasir_api_key
PAKASIR_SLUG=your_slug
PAKASIR_BASE_URL=https://app.pakasir.com
```

### 3. Jalankan Aplikasi

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Buka `http://localhost:5173` di browser.

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/qris-create` | Buat transaksi QRIS |
| GET | `/api/qris-status` | Cek status pembayaran |
| GET | `/api/health` | Health check server |

## Struktur Proyek

```
projek-coffeeshop/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Routes
│   ├── index.css             # Tailwind + custom theme
│   ├── layouts/
│   │   └── MainLayout.jsx    # Layout utama
│   ├── pages/
│   │   ├── Menu.jsx          # Halaman menu & cart
│   │   └── Dashboard.jsx     # Halaman pembayaran
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CustomerModal.jsx
│   │   ├── Receipt.jsx       # Struk thermal 80mm
│   │   └── NotaPesanan.jsx   # Nota dapur
│   └── lib/
│       ├── products.js       # Data produk statis
│       └── supabase.js       # Client Supabase
├── server/
│   ├── package.json
│   ├── index.js              # Express server
│   └── .env.example
└── public/
```

## Deployment

- **Frontend**: Build dengan `npm run build` → folder `dist/` → deploy ke Vercel/Netlify
- **Backend**: Deploy sebagai serverless function via `vercel.json`

## Credits

Dibangun untuk **Casa Neira Coffee** — sistem pemesanan mandiri dengan pembayaran QRIS non-tunai.
