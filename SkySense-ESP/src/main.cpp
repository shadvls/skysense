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

// URL Dashboard
const char* dashboardApi = "https://skysense.yansha.dev/api/status"; 

// --- PIN MAPPING ---
const int RAIN_SENSOR_PIN = A0;
const int SERVO_PIN = D1;

// --- PARAMETER & STATE ---
const int RAIN_THRESHOLD = 750; 
const int botRequestDelay = 500; 
const int dashboardInterval = 100; 

unsigned long lastTimeBotRan = 0;
unsigned long lastTimeDashboardUpdate = 0;

WiFiClientSecure client;
UniversalTelegramBot bot(botToken, client);
Servo jemuranServo;

bool laundryProtected = false;
bool isAutomated = true; // State Mode: True = Otomatis, False = Manual

// --- PROTOTYPES ---
void connectWiFi();
void handleNewMessages(int numNewMessages);
void sendDataToDashboard(int sensorValue, String status, String mode);

void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;
    Serial.print("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");
}

void sendDataToDashboard(int sensorValue, String status, String mode) {
    WiFiClientSecure httpsClient;
    httpsClient.setInsecure(); 
    
    HTTPClient http;
    if (http.begin(httpsClient, dashboardApi)) {
        http.addHeader("Content-Type", "application/json");
        
        StaticJsonDocument<128> doc;
        doc["sensorValue"] = sensorValue;
        doc["status"] = status;
        doc["mode"] = mode; // Kirim info mode ke dashboard juga
        
        String requestBody;
        serializeJson(doc, requestBody);
        http.POST(requestBody);
        http.end();
    }
}

void handleNewMessages(int numNewMessages) {
    for (int i = 0; i < numNewMessages; i++) {
        String chat_id = String(bot.messages[i].chat_id);
        if (chat_id != chatId) continue;

        String text = bot.messages[i].text;

        if (text == "/manual") {
            isAutomated = false;
            bot.sendMessage(chatId, "🛠️ *Mode Manual Aktif:* Sensor hujan dinonaktifkan.", "Markdown");
        } 
        else if (text == "/automate") {
            isAutomated = true;
            bot.sendMessage(chatId, "🤖 *Mode Automate Aktif:* Sistem kembali memantau cuaca.", "Markdown");
        }
        else if (text == "/push") {
            if (!isAutomated) {
                jemuranServo.write(0);
                laundryProtected = false;
                bot.sendMessage(chatId, "☀️ *Manual:* Membuka jemuran", "Markdown");
            } else {
                bot.sendMessage(chatId, "❌ Gagal. Ubah ke mode `/manual` terlebih dahulu.", "Markdown");
            }
        } 
        else if (text == "/pull") {
            if (!isAutomated) {
                jemuranServo.write(180);
                laundryProtected = true;
                bot.sendMessage(chatId, "🌧️ *Manual:* Menutup jemuran", "Markdown");
            } else {
                bot.sendMessage(chatId, "❌ Gagal. Ubah ke mode `/manual` terlebih dahulu.", "Markdown");
            }
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
    
    bot.sendMessage(chatId, "🤖 *SkySense Online!*\nMode Default: *Automate*\n\nCommands:\n/manual - Mode Kendali Tangan\n/automate - Mode Sensor Otomatis", "Markdown");
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) connectWiFi();
    unsigned long currentMillis = millis();

    int sensorValue = analogRead(RAIN_SENSOR_PIN);
    String currentStatus = (sensorValue < RAIN_THRESHOLD) ? "Basah" : "Kering";
    String currentMode = isAutomated ? "Automate" : "Manual";

    // 1. Logika Otomatis (Hanya jalan jika isAutomated == true)
    if (isAutomated) {
        if (sensorValue < RAIN_THRESHOLD && !laundryProtected) {
            jemuranServo.write(180);
            laundryProtected = true;
            bot.sendMessage(chatId, "⚠️ *Otomatis:* Hujan! Menutup jemuran.", "Markdown");
        } 
        else if (sensorValue > (RAIN_THRESHOLD + 100) && laundryProtected) {
            jemuranServo.write(0);
            laundryProtected = false;
            bot.sendMessage(chatId, "☀️ *Otomatis:* Terang! Membuka jemuran.", "Markdown");
        }
    }

    // 2. Update Dashboard (Realtime 100ms)
    if (currentMillis - lastTimeDashboardUpdate > dashboardInterval) {
        sendDataToDashboard(sensorValue, currentStatus, currentMode);
        lastTimeDashboardUpdate = currentMillis;
    }

    // 3. Telegram Polling (500ms)
    if (currentMillis - lastTimeBotRan > botRequestDelay) {
        int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        if (numNewMessages) handleNewMessages(numNewMessages);
        lastTimeBotRan = currentMillis;
    }
}