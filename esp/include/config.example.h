#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// WiFi Credentials
const char* WIFI_SSID = "your_wifi_ssid";
const char* WIFI_PASSWORD = "your_wifi_password";

// Telegram Bot
const char* BOT_TOKEN = "your_bot_token";
const char* CHAT_ID = "your_chat_id";

// Dashboard API
const char* DASHBOARD_API = "http://localhost:3000/api/status";
const char* CONTROL_API = "http://localhost:3000/api/control";

// Thresholds & Timing
const int RAIN_THRESHOLD = 750;       // Below this = rain detected
const int DRY_THRESHOLD = 850;         // Above this = dry (with hysteresis)
const int BOT_REQUEST_DELAY = 500;     // ms between Telegram poll
const int DASHBOARD_INTERVAL = 100;    // ms between sensor data push
const int HEARTBEAT_TIMEOUT = 10000;   // ms before ESP marked offline
const int AUTO_RETRACT_DELAY = 2000;   // ms delay before auto-retract

// Pin Mapping
const int RAIN_SENSOR_PIN = A0;
const int SERVO_PIN = D1;

#endif
