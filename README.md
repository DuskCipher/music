# 🎵 MUSIKUZYY

> Platform streaming musik modern, gratis, tanpa iklan. Nikmati jutaan lagu, buat playlist sendiri, ikuti teman, dan chat sesama pengguna — langsung dari browser!

**🌐 Live Demo:** [musickuzyy.vercel.app](https://musickuzyy.vercel.app)

---

## ⚠️ PERINGATAN PENTING SEBELUM MULAI

> Baca seluruh panduan ini dari atas ke bawah sebelum menjalankan perintah apa pun.
> Melewatkan langkah kecil sekalipun bisa menyebabkan aplikasi tidak berfungsi!

---

## ✨ Fitur Lengkap

| Kategori | Fitur |
|----------|-------|
| 🎵 **Musik** | Putar lagu, next/prev, shuffle, repeat, antrian |
| 🔍 **Pencarian** | Cari lagu, artis, album, dan playlist |
| 📝 **Lirik** | Lirik sinkron (synced) dan teks biasa otomatis |
| 📚 **Library** | Simpan lagu favorit, playlist, album, artis |
| 📊 **Top 50** | Lagu yang paling sering diputar |
| 🕐 **History** | Riwayat pemutaran lengkap |
| 🎨 **Dynamic BG** | Warna latar berubah sesuai artwork lagu |
| 👤 **Profil** | Profil publik dengan foto, banner, dan statistik |
| 👥 **Sosial** | Ikut / berhenti mengikuti pengguna lain |
| 💬 **Pesan** | Chat langsung (DM) antar pengguna secara real-time |
| 🔔 **Notifikasi** | Notifikasi personal dan global |
| 📱 **PWA** | Bisa diinstall sebagai aplikasi di HP/desktop |

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|---------|
| **Next.js 15** | Framework utama (App Router) |
| **React 19** | UI library |
| **TailwindCSS 4** | Styling |
| **Supabase** | Database, Autentikasi, dan Real-time |
| **Zustand** | State management (persisted) |
| **Motion** | Animasi (Framer Motion) |
| **Lucide React** | Ikon |
| **ytmusic-api** | Sumber data musik |
| **LRCLIB** | Lirik lagu |

---

## 📋 Persyaratan

Sebelum memulai, pastikan sudah terinstall:

- **Node.js** versi 18 ke atas — [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk bersama Node.js)
- **Git** — [git-scm.com](https://git-scm.com)
- Akun **Supabase** (gratis) — [supabase.com](https://supabase.com)
- Akun **Google Cloud** (gratis) — [console.cloud.google.com](https://console.cloud.google.com)

---

## 🚀 Panduan Setup dari Nol

### LANGKAH 1 — Clone Repository

```bash
git clone https://github.com/USERNAME/NAMA_REPO.git
cd NAMA_REPO
```

### LANGKAH 2 — Install Dependencies

```bash
npm install
```

> ⚠️ Jangan gunakan `npm install --force` kecuali ada error. Pastikan Node.js versi 18+ terinstall.

---

### LANGKAH 3 — Membuat Project Supabase

1. Buka [supabase.com](https://supabase.com) → **Start your project** → Login
2. Klik **New Project**
3. Isi:
   - **Name**: nama sesukamu (contoh: `musikuzyy`)
   - **Database Password**: buat password yang kuat, **simpan baik-baik!**
   - **Region**: pilih yang terdekat (contoh: `Southeast Asia (Singapore)`)
4. Klik **Create new project** → tunggu ~1-2 menit sampai selesai
5. Setelah selesai, buka **Project Settings** → **API**
6. Salin dua nilai ini:
   - **Project URL** → ini yang akan dipakai sebagai `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → ini yang akan dipakai sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### LANGKAH 4 — Menjalankan Database SQL

1. Di dashboard Supabase, klik **SQL Editor** di menu kiri
2. Klik **New query**
3. Buka file `database.sql` di folder project ini
4. Salin **seluruh** isinya dan tempel (*paste*) ke SQL Editor
5. Klik tombol **Run** (atau tekan `Ctrl+Enter`)
6. Pastikan muncul pesan **Success** — jika ada error, baca pesan errornya

> ⚠️ **PENTING:** Jalankan file `database.sql` ini SEKALI saja. Jika dijalankan ulang, tidak masalah karena menggunakan `IF NOT EXISTS` dan `DROP POLICY IF EXISTS`, tapi hindari menjalankannya berkali-kali tanpa alasan.

---

### LANGKAH 5 — Mengaktifkan Realtime (Untuk Chat)

1. Di Supabase Dashboard, klik **Database** → **Replication**
2. Pastikan tabel **`messages`** sudah muncul di daftar dengan status aktif
3. Jika belum, jalankan query ini di SQL Editor:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
   ```

---

### LANGKAH 6 — Membuat OAuth Google (Login dengan Google)

#### 6a. Buat Project di Google Cloud Console

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Klik **Select a project** di pojok kiri atas → **New Project**
3. Isi nama project → **Create**
4. Pastikan project yang baru dibuat sudah dipilih

#### 6b. Aktifkan Google+ API

1. Di menu kiri, klik **APIs & Services** → **Library**
2. Cari `Google+ API` → klik → **Enable**
3. Cari juga `Google Identity API` → **Enable**

#### 6c. Buat OAuth Credentials

1. Klik **APIs & Services** → **Credentials**
2. Klik **+ CREATE CREDENTIALS** → pilih **OAuth client ID**
3. Jika diminta, klik **CONFIGURE CONSENT SCREEN** terlebih dahulu:
   - Pilih **External** → **Create**
   - Isi **App name**: nama aplikasimu
   - Isi **User support email**: email-mu
   - Isi **Developer contact information**: email-mu
   - Klik **Save and Continue** (lewati langkah optional)
   - Di langkah terakhir klik **Back to Dashboard**
4. Kembali ke **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Pilih **Application type**: `Web application`
6. Isi **Name**: nama sesukamu
7. Di bagian **Authorized redirect URIs**, tambahkan:
   ```
   https://SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   Ganti `SUPABASE_PROJECT_ID` dengan ID project Supabase-mu (terlihat di URL atau di Project Settings)
8. Klik **Create**
9. Salin:
   - **Client ID**
   - **Client Secret**

#### 6d. Hubungkan Google OAuth ke Supabase

1. Di Supabase Dashboard, klik **Authentication** → **Providers**
2. Cari **Google** → klik untuk expand
3. Toggle **Enable Google** → aktifkan
4. Masukkan:
   - **Client ID**: dari langkah 6c
   - **Client Secret**: dari langkah 6c
5. Klik **Save**

---

### LANGKAH 7 — Setup Environment Variables

Buat file `.env.local` di root folder project (setingkat dengan `package.json`):

```bash
# Di Windows (PowerShell):
New-Item .env.local

# Di Mac/Linux:
touch .env.local
```

Isi file `.env.local` dengan:

```env
# =============================================
# SUPABASE — Wajib diisi
# Ambil dari: Supabase Dashboard → Settings → API
# =============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

> ⚠️ **JANGAN pernah commit file `.env.local` ke GitHub!**
> File ini sudah otomatis diabaikan karena ada di `.gitignore`.
> Jika tidak, kredensialmu akan bocor ke publik!

---

### LANGKAH 8 — Konfigurasi URL di Supabase

1. Di Supabase Dashboard, klik **Authentication** → **URL Configuration**
2. Isi **Site URL** dengan URL deploy-mu:
   - Untuk development lokal: `http://localhost:3000`
   - Untuk Vercel: `https://nama-app-mu.vercel.app`
3. Di **Redirect URLs**, tambahkan:
   ```
   http://localhost:3000/**
   https://nama-app-mu.vercel.app/**
   ```
4. Klik **Save**

---

### LANGKAH 9 — Jalankan Aplikasi

```bash
# Mode development (dengan hot-reload)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

```bash
# Build untuk production
npm run build
npm run start
```

---

## ☁️ Deploy ke Vercel

### Cara Deploy:

1. Push code ke GitHub terlebih dahulu
2. Buka [vercel.com](https://vercel.com) → Login dengan GitHub
3. Klik **Add New Project** → pilih repository-mu
4. Di bagian **Environment Variables**, tambahkan:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase-mu |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key Supabase-mu |
5. Klik **Deploy**
6. Tunggu hingga selesai (~2-3 menit)

> ⚠️ Setelah deploy, jangan lupa update **Site URL** dan **Redirect URLs** di Supabase Authentication Settings ke URL Vercel-mu!

---

## 📁 Struktur Project

```
MUSIKUZYY/
├── app/                    # Halaman & API Routes (Next.js App Router)
│   ├── api/                # Backend API endpoints
│   ├── album/              # Halaman detail album
│   ├── artist/             # Halaman detail artis
│   ├── auth/               # Halaman login/daftar
│   ├── developer/          # Halaman tentang developer
│   ├── history/            # Riwayat pemutaran
│   ├── library/            # Library (playlist, favorit, album)
│   ├── messages/           # Kotak masuk & halaman chat
│   ├── playlist/           # Detail playlist
│   ├── profile/            # Profil pengguna sendiri
│   ├── search/             # Halaman pencarian
│   ├── top50/              # Top 50 lagu terbanyak diputar
│   └── user/[id]/          # Profil publik pengguna lain
├── components/             # Komponen UI yang dapat digunakan ulang
│   ├── profile/            # Komponen khusus halaman profil
│   ├── FollowButton.tsx    # Tombol ikut/berhenti mengikuti
│   ├── FollowsModal.tsx    # Modal daftar pengikut/mengikuti
│   ├── MessageButton.tsx   # Tombol mulai obrolan
│   └── Sidebar.tsx         # Sidebar navigasi utama
├── hooks/                  # Custom React hooks
├── lib/
│   ├── db.ts               # Semua fungsi database Supabase
│   ├── store.ts            # State management (Zustand)
│   └── supabase/           # Konfigurasi Supabase client
├── public/                 # Asset statis & file PWA
├── database.sql            # ⭐ Schema database lengkap
└── .env.local              # Environment variables (JANGAN di-commit!)
```

---

## 🗄️ Database

File `database.sql` berisi:

| Tabel | Fungsi |
|-------|--------|
| `profiles` | Profil publik pengguna (nama, avatar, banner) |
| `playlists` | Playlist yang dibuat pengguna |
| `liked_songs` | Lagu favorit pengguna |
| `play_history` | Riwayat pemutaran lagu |
| `subscribed_artists` | Artis yang diikuti pengguna |
| `saved_albums` | Album yang disimpan pengguna |
| `recent_searches` | Riwayat pencarian |
| `follows` | Sistem ikut-mengikuti antar pengguna |
| `notifications` | Notifikasi personal |
| `global_notifications` | Notifikasi untuk semua pengguna |
| `chat_rooms` | Ruang obrolan (DM / grup) |
| `chat_members` | Anggota setiap ruang obrolan |
| `messages` | Pesan di dalam obrolan |

---

## ❓ Troubleshooting (Solusi Masalah Umum)

### Login Google tidak berfungsi
- Pastikan **Client ID** dan **Client Secret** sudah benar di Supabase → Authentication → Providers → Google
- Pastikan **Redirect URI** di Google Cloud Console sudah tepat:
  `https://ID_PROJECT_SUPABASE.supabase.co/auth/v1/callback`
- Pastikan **Site URL** di Supabase Authentication sudah sesuai

### Nama pengguna muncul "Pengguna" bukan nama asli
Jalankan query berikut di SQL Editor Supabase:
```sql
INSERT INTO public.profiles (id, name, avatar_url)
SELECT id,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', 'Pengguna'),
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
WHERE public.profiles.name IS NULL OR public.profiles.name = 'Pengguna';
```

### Chat real-time tidak berfungsi
- Pastikan tabel `messages` sudah ditambahkan ke Supabase Realtime
- Jalankan: `ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;`

### Error "relation does not exist"
- Berarti tabel belum dibuat. Jalankan ulang file `database.sql` di SQL Editor Supabase

### Build error di Vercel
- Pastikan Environment Variables sudah diisi di Vercel Dashboard
- Cek log error di Vercel → Deployments → klik deployment yang gagal → View Logs

### Gambar/foto tidak muncul
- Pastikan domain Supabase sudah ditambahkan di `next.config.js` bagian `images.domains` atau `images.remotePatterns`

---

## 👨‍💻 Developer

**SANN404 FORUM**

---

Made with ❤️ — Musik untuk semua!
