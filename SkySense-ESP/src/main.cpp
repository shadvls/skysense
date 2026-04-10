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
const char* dashboardApi = "https://skysense.yansha.dev/api/status"; // Ganti setelah deploy

const int RAIN_SENSOR_PIN = A0;
const int SERVO_PIN = D1;

WiFiClientSecure client;
UniversalTelegramBot bot(botToken, client);
Servo jemuranServo;

unsigned long lastTimeUpdate = 0;
const int updateInterval = 200; // Update sensor setiap 200ms

void sendDataToDashboard(int sensorValue, String status) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        client.setInsecure();
        http.begin(client, dashboardApi);
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<200> doc;
        doc["sensorValue"] = sensorValue;
        doc["status"] = status;
        String requestBody;
        serializeJson(doc, requestBody);

        int httpResponseCode = http.POST(requestBody);
        http.end();
    }
}

void setup() {
    Serial.begin(115200);
    jemuranServo.attach(SERVO_PIN);
    client.setInsecure();
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) { delay(500); }
    configTime(0, 0, "pool.ntp.org");
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) connectWiFi();

    if (millis() > lastTimeBotRan + botRequestDelay) {
        // 1. CEK PESAN TELEGRAM
        int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        while (numNewMessages) {
            handleNewMessages(numNewMessages);
            numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        }

        // 2. CEK SENSOR OTOMATIS
        int sensorValue = analogRead(RAIN_SENSOR_PIN);
        Serial.print("Nilai Sensor: ");
        Serial.println(sensorValue);

        if (sensorValue < RAIN_THRESHOLD) { // KONDISI HUJAN
            if (!laundryProtected) {
                jemuranServo.write(180);
                bot.sendMessage(chatId, "⚠️ *Otomatis:* Hujan terdeteksi! Menutup...", "Markdown");
                laundryProtected = true;
            }
        } else { // KONDISI KERING
            if (laundryProtected && sensorValue > (RAIN_THRESHOLD + 100)) { 
                // (+100 untuk hysteresis agar tidak gerak-gerak terus saat sensor lembab)
                jemuranServo.write(0);
                bot.sendMessage(chatId, "☀️ *Otomatis:* Cuaca cerah! Membuka...", "Markdown");
                laundryProtected = false;
            }
        }
        
        lastTimeBotRan = millis();
    }
}