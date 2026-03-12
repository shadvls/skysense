# SkySense - Sistem Jemuran Pintar

Sistem IoT untuk menjemur pakaian otomatis. ESP8266 mendeteksi hujan melalui sensor analog, mengontrol servo motor untuk menarik/membuka jemuran, serta memberikan monitoring real-time melalui bot Telegram dan dashboard web.

[![Dashboard CI](https://github.com/shadvls/skysense/actions/workflows/ci.yml/badge.svg)](https://github.com/shadvls/skysense/actions/workflows/ci.yml)
[![Security Scan](https://github.com/shadvls/skysense/actions/workflows/security.yml/badge.svg)](https://github.com/shadvls/skysense/actions/workflows/security.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![ESP8266](https://img.shields.io/badge/ESP8266-PlatformIO-FF6600?logo=espressif&logoColor=white)](https://platformio.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C8?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/shadvls/skysense/releases/tag/v1.0.0)

---

## Cara Kerja

1. Sensor hujan membaca tingkat curah hujan dan mengirim data ke dashboard setiap 100ms.
2. Saat hujan terdeteksi (nilai di bawah ambang 750), servo otomatis menarik jemuran.
3. Saat hujan reda dan nilai sensor naik di atas 850 (histeresis), servo membuka jemuran kembali.
4. Semua kejadian tercatat di dashboard web dan dikirim sebagai notifikasi Telegram.
5. Jika ESP offline (tidak ada data selama 10 detik), dashboard menampilkan status "OFFLINE".

---

## Kebutuhan Hardware

| Komponen | Spesifikasi |
|---|---|
| Mikrokontroler | ESP8266 (ESP12E) |
| Sensor Hujan | Modul sensor hujan analog |
| Servo Motor | SG90 atau kompatibel |
| Catu Daya | USB 5V |

### Wiring

| Pin ESP8266 | Komponen |
|---|---|
| A0 | Sensor hujan (keluaran analog) |
| D1 (GPIO5) | Kabel sinyal servo |
| 3.3V | VCC sensor hujan |
| GND | Ground bersama |

---

## Mulai Cepat

### 1. Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Untuk production, salin file environment:

```bash
cp .env.example .env.local
```

### 2. Firmware ESP

Salin template config dan isi kredensial Anda:

```bash
cd esp
cp include/config.example.h include/config.h
```

Edit `include/config.h` dengan kredensial WiFi dan Telegram, lalu build dan upload:

```bash
pio run
pio run --target upload
pio device monitor
```

> **Keamanan:** `config.h` sudah di `.gitignore` dan tidak akan pernah tercatat di git. Selalu gunakan `config.example.h` sebagai template.

---

## Penggunaan

### Mode Otomatis (default)

Sistem berjalan dalam mode otomatis secara default. Cukup nyalakan ESP8266 dan sistem akan:

- Memantau curah hujan 24/7
- Menarik jemuran otomatis saat hujan
- Membuka jemuran saat cuaca cerah
- Mengirim notifikasi Telegram
- Menampilkan data real-time di dashboard

### Mode Manual

Kirim `/manual` ke bot Telegram untuk menonaktifkan sensor otomatis. Dalam mode manual, Anda mengontrol jemuran melalui perintah Telegram atau tombol dashboard.

Untuk mengaktifkan kembali mode otomatis, kirim `/automate`.

### Kontrol Dashboard

| Tombol | Fungsi |
|---|---|
| FORCE_PUSH | Membuka jemuran (mode manual saja) |
| FORCE_PULL | Menarik jemuran (mode manual saja) |
| Refresh | Memuat ulang halaman dashboard |
| Input jadwal | Atur jam buka/tutup otomatis (dalam pengembangan) |

### Deteksi Offline

Dashboard memeriksa heartbeat ESP setiap 2 detik. Jika tidak ada data selama lebih dari 10 detik:

- Indikator status berubah merah dengan teks "ESP8266 Offline"
- Kartu sensor menampilkan peringatan "OFFLINE"
- Saat ESP terhubung kembali, dashboard kembali normal

---

## Perintah Bot Telegram

| Perintah | Fungsi | Butuh Mode Manual? |
|---|---|---|
| `/manual` | Beralih ke kontrol manual | Tidak |
| `/automate` | Aktifkan sensor otomatis | Tidak |
| `/push` | Buka jemuran | Ya |
| `/pull` | Tarik jemuran | Ya |

Bot mengirim notifikasi untuk:
- Hujan terdeteksi — "Hujan! Menutup jemuran."
- Cuaca cerah — "Terang! Membuka jemuran."
- Sistem menyala — "SkySense Online!"
- Konfirmasi perintah manual

---

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/status` | Ambil status sensor terkini + status online |
| POST | `/status` | Update status sensor (dari ESP) |
| GET | `/control` | Ambil perintah tertunda (di-poll oleh ESP) |
| POST | `/control` | Kirim perintah ke ESP (`push`/`pull`) |

### Contoh Response (GET /api/status)

```json
{
  "sensorValue": 450,
  "status": "Basah",
  "lastUpdate": "2026-06-09T12:00:00.000Z",
  "schedule": { "push": "08:00", "pull": "16:00" },
  "online": true
}
```

---

## Struktur Proyek

```
skysense/
  dashboard/            # Dashboard web Next.js 16
    app/
      api/
        status/route.ts # API status sensor
        control/route.ts# API antrian perintah
      components/
        sections/       # DashboardHeader, SensorCard, ScheduleCard
        shared/         # Preloader, ClientProvider, OverlaySystem, BackgroundGradient
      hooks/            # 11 custom hook animasi (GSAP + Framer Motion)
      page.tsx          # Halaman utama dashboard
      layout.tsx        # Layout root dengan tema gelap
  esp/                  # Firmware ESP8266
    src/main.cpp        # Source firmware
    include/
      config.example.h  # File konfigurasi template
      config.h          # Kredensial Anda (gitignored)
    platformio.ini      # Konfigurasi proyek PlatformIO
```

---

## Tech Stack

### Dashboard

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + clsx/tailwind-merge
- **Animasi:** Framer Motion 12 + GSAP 3
- **Ikon:** Lucide React

### Firmware

- **Board:** ESP8266 (ESP12E)
- **Framework:** Arduino (via PlatformIO)
- **Libraries:** UniversalTelegramBot 1.1+, ArduinoJson 6.21+

---

## Konfigurasi

### Dashboard (`dashboard/.env.local`)

Dashboard berjalan tanpa konfigurasi di mode development. Untuk production, atur:

| Variable | Deskripsi |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL API production |

### Firmware (`esp/include/config.h`)

Salin dari `config.example.h`, lalu isi:

| Variable | Deskripsi |
|---|---|
| `WIFI_SSID` | Nama jaringan WiFi |
| `WIFI_PASSWORD` | Password WiFi |
| `BOT_TOKEN` | Token API Bot Telegram |
| `CHAT_ID` | ID chat Telegram yang terotorisasi |
| `DASHBOARD_API` | URL API dashboard production |
| `CONTROL_API` | URL API kontrol production |
| `RAIN_THRESHOLD` | Ambang batas sensor (default: 750) |

---

## Sensor & Threshold

| Parameter | Nilai | Deskripsi |
|---|---|---|
| Ambang hujan | 750 | Di bawah ini = hujan |
| Histeresis | +100 | Re-trigger di 850 untuk mencegah toggle cepat |
| Update dashboard | Setiap 100ms | ESP kirim data ke API |
| Poll dashboard | Setiap 2s | Frontend refresh dari API |
| Heartbeat timeout | 10s | Waktu sebelum ESP dianggap offline |
| Poll Telegram | Setiap 500ms | ESP cek perintah bot |

---

## Rilis & Versioning

Rilis mengikuti [Semantic Versioning](https://semver.org/). Lihat [halaman rilis](https://github.com/shadvls/skysense/releases) untuk changelog.

---

## Lisensi

Proprietary. Lihat [LICENSE](LICENSE).

---

## Keamanan

- Kredensial disimpan di `esp/include/config.h` (gitignored)
- `config.example.h` menyediakan template dengan nilai placeholder
- Riwayat git telah dibersihkan dari kredensial yang sebelumnya bocor
- Gitleaks berjalan di CI untuk memindai rahasia di setiap push
- API dashboard tidak memiliki autentikasi — gunakan VPN atau proxy auth untuk production
