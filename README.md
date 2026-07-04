# 🎵 Music App

Platform streaming musik modern gratis tanpa iklan. Nikmati jutaan lagu, buat daftar putar sendiri, dan temukan musik baru setiap hari.

## ✨ Fitur

- 🔍 **Pencarian** — Cari lagu, artis, video, dan playlist
- 🎵 **Player** — Pemutar musik dengan kontrol lengkap (play/pause, next/prev, shuffle, repeat)
- 📝 **Lyrics** — Lirik sinkron (synced) dan plain text otomatis
- 📚 **Library** — Simpan lagu favorit, playlist, album, dan artis
- 📋 **Playlist** — Buat dan kelola playlist lokal
- 📊 **Top 50** — Lagu yang paling sering kamu putar
- 🕐 **History** — Riwayat putar lengkap
- 🎨 **Dynamic Background** — Warna latar berubah sesuai artwork lagu
- 📱 **PWA** — Install sebagai aplikasi di HP atau desktop
- ♾️ **Autoplay** — Lagu berikutnya otomatis diputar

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + TailwindCSS 4
- **State**: Zustand (persisted)
- **Database**: IndexedDB (idb)
- **Music API**: ytmusic-api
- **Lyrics**: LRCLIB + YouTube Music
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Setup environment

```bash
cp .env.example .env
```

### Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build production

```bash
npm run build
npm run start
```

## 📁 Struktur Project

```
├── app/              # Pages & API routes (Next.js App Router)
│   ├── api/          # 7 Backend API endpoints
│   ├── album/        # Album detail page
│   ├── artist/       # Artist detail page
│   ├── developer/    # About/Developer page
│   ├── history/      # Listening history
│   ├── library/      # Library (playlists, liked, albums)
│   ├── playlist/     # Playlist detail page
│   ├── search/       # Search page
│   └── top50/        # Top 50 most played
├── components/       # 16 Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, store, database
└── public/           # Static assets & PWA files
```

## 👨‍💻 Developer

**SANN404 FORUM**

---

Made with ❤️
