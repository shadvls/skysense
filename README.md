# SkySense - Smart Laundry Rain Sensor

IoT-based automatic laundry retraction system. ESP8266 detects rain via analog sensor, controls a servo motor to retract/deploy laundry, and provides real-time monitoring via a Telegram bot and Next.js dashboard.

[![Dashboard CI](https://github.com/shadvls/skysense/actions/workflows/ci.yml/badge.svg)](https://github.com/shadvls/skysense/actions/workflows/ci.yml)
[![Security Scan](https://github.com/shadvls/skysense/actions/workflows/security.yml/badge.svg)](https://github.com/shadvls/skysense/actions/workflows/security.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![ESP8266](https://img.shields.io/badge/ESP8266-PlatformIO-FF6600?logo=espressif&logoColor=white)](https://platformio.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/shadvls/skysense/releases/tag/v1.0.0)

---

## How It Works

1. The rain sensor continuously reads precipitation levels and sends data to the dashboard every 100ms.
2. When rain is detected (value drops below threshold 750), the servo automatically retracts the laundry.
3. When the rain stops and the sensor reading rises above 850 (hysteresis), the servo deploys the laundry again.
4. All events are logged to the web dashboard and sent as Telegram notifications.
5. If the ESP goes offline (no data for 10 seconds), the dashboard shows "OFFLINE" status.

---

## Hardware Requirements

| Component | Spec |
|---|---|
| Microcontroller | ESP8266 (ESP12E) |
| Rain Sensor | Analog rain sensor module |
| Servo Motor | SG90 or compatible |
| Power | 5V USB power supply |

### Wiring

| ESP8266 Pin | Component |
|---|---|
| A0 | Rain sensor (analog out) |
| D1 (GPIO5) | Servo signal wire |
| 3.3V | Rain sensor VCC |
| GND | Common ground |

---

## Quick Start

### 1. Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To deploy to production, set your environment variables:

```bash
cp .env.example .env.local
```

### 2. ESP Firmware

Copy the config template and fill in your credentials:

```bash
cd esp
cp include/config.example.h include/config.h
```

Edit `include/config.h` with your WiFi and Telegram credentials, then build and upload:

```bash
pio run
pio run --target upload
pio device monitor
```

> **Security:** `config.h` is in `.gitignore` and will never be committed. Always use `config.example.h` as the template.

---

## Usage

### Automatic Mode (default)

The system runs in automatic mode by default. Simply power on the ESP8266 and it will:

- Monitor rain levels 24/7
- Automatically retract laundry when rain is detected
- Automatically deploy laundry when weather clears
- Send Telegram notifications on state changes
- Stream real-time data to the dashboard

### Manual Mode

Send `/manual` to the Telegram bot to disable automatic rain sensing. In manual mode, you control the laundry via Telegram commands or the dashboard buttons.

To re-enable automatic mode, send `/automate`.

### Dashboard Controls

| Control | Action |
|---|---|
| FORCE_PUSH | Deploy laundry (manual mode only) |
| FORCE_PULL | Retract laundry (manual mode only) |
| Refresh button | Reload dashboard page |
| Schedule inputs | Set auto deploy/retract times (in development) |

### Offline Detection

The dashboard checks for ESP heartbeats every 2 seconds. If no data is received for more than 10 seconds:

- The status indicator turns red with "ESP8266 Offline" text
- The sensor card displays a full-screen "OFFLINE" warning
- As soon as the ESP reconnects and sends data, the dashboard resumes normal display

---

## Telegram Bot Commands

| Command | Description | Requires Manual Mode? |
|---|---|---|
| `/manual` | Switch to manual control | No |
| `/automate` | Enable automatic rain sensing | No |
| `/push` | Deploy laundry | Yes |
| `/pull` | Retract laundry | Yes |

The bot sends proactive notifications for:
- Rain detected — "Hujan! Menutup jemuran."
- Weather cleared — "Terang! Membuka jemuran."
- System startup — "SkySense Online!"
- Manual commands confirmation

---

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/status` | Get current sensor state + online status |
| POST | `/status` | Update sensor state (from ESP) |
| GET | `/control` | Get pending command (polled by ESP) |
| POST | `/control` | Send command to ESP (`push`/`pull`) |

### Response Schema (GET /api/status)

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

## Project Structure

```
skysense/
  dashboard/            # Next.js 16 web dashboard
    app/
      api/
        status/route.ts # Sensor state API
        control/route.ts# Command queue API
      components/
        sections/       # DashboardHeader, SensorCard, ScheduleCard
        shared/         # Preloader, ClientProvider, OverlaySystem, BackgroundGradient
      hooks/            # 11 custom animation hooks (GSAP + Framer Motion)
      page.tsx          # Main dashboard page
      layout.tsx        # Root layout with dark theme
  esp/                  # ESP8266 firmware
    src/main.cpp        # Firmware source
    include/
      config.example.h  # Template config file
      config.h          # Your credentials (gitignored)
    platformio.ini      # PlatformIO project config
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
- **Libraries:** UniversalTelegramBot 1.1+, ArduinoJson 6.21+

---

## Configuration

### Dashboard (`dashboard/.env.local`)

Currently the dashboard runs with zero configuration in development. For production deployment, set:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Your production API base URL |

### Firmware (`esp/include/config.h`)

Copy from `config.example.h`, then fill in:

| Variable | Description |
|---|---|
| `WIFI_SSID` | WiFi network name |
| `WIFI_PASSWORD` | WiFi password |
| `BOT_TOKEN` | Telegram Bot API token |
| `CHAT_ID` | Authorized Telegram chat ID |
| `DASHBOARD_API` | Production dashboard API URL |
| `CONTROL_API` | Production control API URL |
| `RAIN_THRESHOLD` | Sensor threshold (default: 750) |

---

## Sensors & Thresholds

| Parameter | Value | Description |
|---|---|---|
| Rain threshold | 750 | Below this = rain detected |
| Hysteresis | +100 | Re-trigger at 850 to prevent rapid toggling |
| Dashboard update | Every 100ms | ESP sends data to API |
| Dashboard poll | Every 2s | Frontend refreshes from API |
| Heartbeat timeout | 10s | Time before ESP marked offline |
| Telegram polling | Every 500ms | ESP checks for bot commands |

---

## Release & Versioning

Releases follow [Semantic Versioning](https://semver.org/). See the [releases page](https://github.com/shadvls/skysense/releases) for changelogs.

---

## License

Proprietary. See [LICENSE](LICENSE).

---

## Security

- Secrets are stored in `esp/include/config.h` (gitignored)
- `config.example.h` provides a template with placeholder values
- Git history has been sanitized to remove previously leaked credentials
- Gitleaks runs in CI to scan for secrets on every push
- The dashboard API has no authentication — deploy behind a VPN or auth proxy for production
