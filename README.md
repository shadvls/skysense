# SkySense - Smart Laundry Rain Sensor

IoT-based automatic laundry retraction system. ESP8266 detects rain via analog sensor, controls a servo motor to retract/deploy laundry, and provides real-time monitoring via a Telegram bot and Next.js dashboard.

[![Dashboard CI](https://github.com/shadvls/skysense/actions/workflows/ci.yml/badge.svg)](https://github.com/shadvls/skysense/actions/workflows/ci.yml)
[![Security Scan](https://github.com/shadvls/skysense/actions/workflows/security.yml/badge.svg)](https://github.com/shadvls/skysense/actions/workflows/security.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![ESP8266](https://img.shields.io/badge/ESP8266-PlatformIO-FF6600?logo=espressif&logoColor=white)](https://platformio.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## Structure

```
skysense/
  dashboard/    # Next.js 16 - web dashboard
  esp/          # ESP8266 firmware (PlatformIO / Arduino)
```

The ESP8266 posts sensor data to the dashboard API every 100ms. Telegram bot allows remote control and notifications.

---

## Prerequisites

- Node.js 20+
- PlatformIO (for ESP firmware)
- ESP8266 board (ESP12E)
- Rain sensor module (analog)
- Servo motor (SG90 or compatible)
- Telegram Bot Token

---

## Getting Started

### Dashboard

```bash
cd dashboard
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

### ESP Firmware

```bash
cd esp
pio run                      # Build firmware
pio run --target upload      # Upload to ESP8266
pio device monitor           # Serial monitor (115200 baud)
```

---

## Tech Stack

### Dashboard

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + clsx/tailwind-merge
- **Animation:** Framer Motion 12 + GSAP 3
- **Icons:** Lucide React

### Firmware

- **Board:** ESP8266 (ESP12E)
- **Framework:** Arduino (via PlatformIO)
- **Libraries:** UniversalTelegramBot, ArduinoJson

---

## Environment Variables

### Dashboard (`dashboard/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | Dashboard API base URL |

### Firmware (`esp/src/main.cpp`)

| Variable | Description |
|---|---|
| `WIFI_SSID` | WiFi network name |
| `WIFI_PASSWORD` | WiFi password |
| `BOT_TOKEN` | Telegram Bot API token |
| `CHAT_ID` | Authorized Telegram chat ID |
| `DASHBOARD_URL` | Dashboard API endpoint |

---

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/status` | Get current sensor state |
| POST | `/status` | Update sensor state (from ESP) |

---

## Telegram Bot Commands

| Command | Description |
|---|---|
| `/automate` | Enable automatic rain sensing mode |
| `/manual` | Switch to manual control mode |
| `/push` | Deploy laundry (manual mode only) |
| `/pull` | Retract laundry (manual mode only) |

The bot sends proactive notifications when rain starts or clears.

---

## Conventions

- Dashboard components: `PascalCase` for components, `camelCase` for utilities
- ESP firmware: Arduino conventions (`.cpp` / `.h`)
- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `perf:`)
- All documentation in English
