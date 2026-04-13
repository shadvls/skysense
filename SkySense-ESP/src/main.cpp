#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include <ArduinoJson.h>
#include <Servo.h>

// --- CONFIG ---
const char* ssid = "Yansha";
const char* password = "28282828";
const char* botToken = "8692047221:AAEkiiYD-wWjnO74M5GujImCgkK40s9BDYA";
const char* chatId = "8086923204";

// URL Dashboard Baru
const char* dashboardApi = "https://skysense.yansha.dev/api/status"; 

// --- PIN MAPPING ---
const int RAIN_SENSOR_PIN = A0;
const int SERVO_PIN = D1;

// --- PARAMETER & STATE ---
const int RAIN_THRESHOLD = 750; 

// Optimasi Delay: Secepat mungkin
const int botRequestDelay = 500;        // Polling Telegram (Batas aman API Telegram)
const int dashboardInterval = 100;      // Update Dashboard (0.1 detik untuk realtime feel)

unsigned long lastTimeBotRan = 0;
unsigned long lastTimeDashboardUpdate = 0;

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
        delay(100); // Fast retry
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");
}

void sendDataToDashboard(int sensorValue, String status) {
    WiFiClientSecure httpsClient;
    httpsClient.setInsecure(); 
    
    HTTPClient http;
    if (http.begin(httpsClient, dashboardApi)) {
        http.addHeader("Content-Type", "application/json");
        
        StaticJsonDocument<128> doc;
        doc["sensorValue"] = sensorValue;
        doc["status"] = status;
        
        String requestBody;
        serializeJson(doc, requestBody);
        
        int httpResponseCode = http.POST(requestBody);
        // Serial log dikurangi untuk performa
        if (httpResponseCode < 0) {
            Serial.printf("[HTTP] Error: %s\n", http.errorToString(httpResponseCode).c_str());
        }
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
            bot.sendMessage(chatId, "☀️ *Manual:* Membuka jemuran", "Markdown");
        } else if (text == "/pull") {
            jemuranServo.write(180);
            laundryProtected = true;
            bot.sendMessage(chatId, "🌧️ *Manual:* Menutup jemuran", "Markdown");
        }
    }
}

void setup() {
    Serial.begin(115200);
    
    jemuranServo.attach(SERVO_PIN);
    jemuranServo.write(0);
    
    pinMode(RAIN_SENSOR_PIN, INPUT);
    
    connectWiFi();
    client.setInsecure();
    
    bot.sendMessage(chatId, "🤖 *SkySense Realtime Online!*", "Markdown");
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) connectWiFi();

    unsigned long currentMillis = millis();

    // 1. Baca Sensor & Logika Otomatis (INSTAN - Tanpa Delay)
    int sensorValue = analogRead(RAIN_SENSOR_PIN);
    String currentStatus = (sensorValue < RAIN_THRESHOLD) ? "Basah" : "Kering";

    if (sensorValue < RAIN_THRESHOLD && !laundryProtected) {
        jemuranServo.write(180);
        laundryProtected = true;
        bot.sendMessage(chatId, "⚠️ *Otomatis:* Hujan!", "Markdown");
    } 
    else if (sensorValue > (RAIN_THRESHOLD + 100) && laundryProtected) {
        jemuranServo.write(0);
        laundryProtected = false;
        bot.sendMessage(chatId, "☀️ *Otomatis:* Cerah!", "Markdown");
    }

    // 2. Update Dashboard (Fast Track: 100ms)
    if (currentMillis - lastTimeDashboardUpdate > dashboardInterval) {
        sendDataToDashboard(sensorValue, currentStatus);
        lastTimeDashboardUpdate = currentMillis;
    }

    // 3. Cek Telegram (Normal Track: 500ms)
    // Polling Telegram berat, jadi diletakkan paling akhir agar tidak mengganggu sensor
    if (currentMillis - lastTimeBotRan > botRequestDelay) {
        int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        if (numNewMessages) {
            handleNewMessages(numNewMessages);
        }
        lastTimeBotRan = currentMillis;
    }
}