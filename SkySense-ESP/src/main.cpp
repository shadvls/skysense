#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include <ArduinoJson.h>
#include <Servo.h>

// --- CONFIG ---
const char* ssid = "Yansha";
const char* password = "YOUR_WIFI_PASSWORD";
const char* botToken = "YOUR_BOT_TOKEN";
const char* chatId = "YOUR_CHAT_ID";

// URL Dashboard Baru
const char* dashboardApi = "https://skysense.yansha.dev/api/status"; 

// --- PIN MAPPING ---
const int RAIN_SENSOR_PIN = A0;
const int SERVO_PIN = D1;

// --- PARAMETER & STATE ---
const int RAIN_THRESHOLD = 750; 
const int botRequestDelay = 100; 
unsigned long lastTimeBotRan = 0;
unsigned long lastTimeDashboardUpdate = 0;
const int dashboardInterval = 100; 

WiFiClientSecure client;
UniversalTelegramBot bot(botToken, client);
Servo jemuranServo;
bool laundryProtected = false;

// --- PROTOTYPES ---
void connectWiFi();
void handleNewMessages(int numNewMessages);
void sendDataToDashboard(int sensorValue, String status);

void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;
    Serial.print("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");
}

void sendDataToDashboard(int sensorValue, String status) {
    WiFiClientSecure httpsClient;
    httpsClient.setInsecure(); // Mengabaikan verifikasi SSL untuk performa
    
    HTTPClient http;
    if (http.begin(httpsClient, dashboardApi)) {
        http.addHeader("Content-Type", "application/json");
        
        StaticJsonDocument<128> doc;
        doc["sensorValue"] = sensorValue;
        doc["status"] = status;
        
        String requestBody;
        serializeJson(doc, requestBody);
        
        int httpResponseCode = http.POST(requestBody);
        Serial.printf("[HTTP] POST Response: %d\n", httpResponseCode);
        http.end();
    }
}

void handleNewMessages(int numNewMessages) {
    for (int i = 0; i < numNewMessages; i++) {
        String chat_id = String(bot.messages[i].chat_id);
        if (chat_id != chatId) continue;

        String text = bot.messages[i].text;
        if (text == "/push") {
            jemuranServo.write(0);
            laundryProtected = false;
            bot.sendMessage(chatId, "☀️ *Manual:* Membuka jemuran (0°)", "Markdown");
        } else if (text == "/pull") {
            jemuranServo.write(180);
            laundryProtected = true;
            bot.sendMessage(chatId, "🌧️ *Manual:* Menutup jemuran (180°)", "Markdown");
        }
    }
}

void setup() {
    Serial.begin(115200);
    
    jemuranServo.attach(SERVO_PIN);
    jemuranServo.write(0);
    
    pinMode(RAIN_SENSOR_PIN, INPUT);
    
    connectWiFi();
    
    // Sinkronisasi Waktu
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    client.setInsecure();
    
    bot.sendMessage(chatId, "🤖 *SkySense Online!*\nDashboard: https://skysense.yansha.dev/", "Markdown");
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) connectWiFi();

    unsigned long currentMillis = millis();

    // Jalankan pengecekan bot dan sensor
    if (currentMillis - lastTimeBotRan > botRequestDelay) {
        // 1. Cek Telegram
        int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        while (numNewMessages) {
            handleNewMessages(numNewMessages);
            numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        }

        // 2. Baca Sensor & Logika Otomatis
        int sensorValue = analogRead(RAIN_SENSOR_PIN);
        String currentStatus = (sensorValue < RAIN_THRESHOLD) ? "Basah" : "Kering";

        if (sensorValue < RAIN_THRESHOLD && !laundryProtected) {
            jemuranServo.write(180);
            bot.sendMessage(chatId, "⚠️ *Otomatis:* Hujan! Menutup jemuran...", "Markdown");
            laundryProtected = true;
        } 
        else if (sensorValue > (RAIN_THRESHOLD + 100) && laundryProtected) {
            jemuranServo.write(0);
            bot.sendMessage(chatId, "☀️ *Otomatis:* Cuaca membaik! Membuka kembali...", "Markdown");
            laundryProtected = false;
        }

        // 3. Update Dashboard Next.js
        if (currentMillis - lastTimeDashboardUpdate > dashboardInterval) {
            sendDataToDashboard(sensorValue, currentStatus);
            lastTimeDashboardUpdate = currentMillis;
        }

        lastTimeBotRan = currentMillis;
    }
}