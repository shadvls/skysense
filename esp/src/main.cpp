#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include <ArduinoJson.h>
#include <Servo.h>
#include "config.h"

WiFiClientSecure client;
UniversalTelegramBot bot(BOT_TOKEN, client);
Servo jemuranServo;

bool laundryProtected = false;
bool isAutomated = true;

unsigned long lastTimeBotRan = 0;
unsigned long lastTimeDashboardUpdate = 0;

void connectWiFi();
void handleNewMessages(int numNewMessages);
void sendDataToDashboard(int sensorValue, String status, String mode);
void checkPendingCommands();

void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;
    Serial.print("Connecting to WiFi...");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
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
    if (http.begin(httpsClient, DASHBOARD_API)) {
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<192> doc;
        doc["sensorValue"] = sensorValue;
        doc["status"] = status;
        doc["mode"] = mode;

        String requestBody;
        serializeJson(doc, requestBody);
        int httpCode = http.POST(requestBody);

        if (httpCode > 0) {
            String response = http.getString();
            StaticJsonDocument<96> respDoc;
            DeserializationError err = deserializeJson(respDoc, response);
            if (!err && respDoc["pending"]) {
                String cmd = respDoc["pending"].as<String>();
                if (cmd == "push" && !isAutomated) {
                    jemuranServo.write(0);
                    laundryProtected = false;
                } else if (cmd == "pull" && !isAutomated) {
                    jemuranServo.write(180);
                    laundryProtected = true;
                }
            }
        }

        http.end();
    }
}

void checkPendingCommands() {
    WiFiClientSecure httpsClient;
    httpsClient.setInsecure();

    HTTPClient http;
    if (http.begin(httpsClient, CONTROL_API)) {
        int httpCode = http.GET();
        if (httpCode > 0) {
            String response = http.getString();
            StaticJsonDocument<96> respDoc;
            DeserializationError err = deserializeJson(respDoc, response);
            if (!err && respDoc["action"] && respDoc["pending"] == true) {
                String cmd = respDoc["action"].as<String>();
                if (cmd == "push" && !isAutomated) {
                    jemuranServo.write(0);
                    laundryProtected = false;
                    bot.sendMessage(CHAT_ID, "☀️ *Remote:* Membuka jemuran", "Markdown");
                } else if (cmd == "pull" && !isAutomated) {
                    jemuranServo.write(180);
                    laundryProtected = true;
                    bot.sendMessage(CHAT_ID, "🌧️ *Remote:* Menutup jemuran", "Markdown");
                }
            }
        }
        http.end();
    }
}

void handleNewMessages(int numNewMessages) {
    for (int i = 0; i < numNewMessages; i++) {
        String chat_id = String(bot.messages[i].chat_id);
        if (chat_id != CHAT_ID) continue;

        String text = bot.messages[i].text;

        if (text == "/manual") {
            isAutomated = false;
            bot.sendMessage(CHAT_ID, "🛠️ *Mode Manual Aktif:* Sensor hujan dinonaktifkan.", "Markdown");
        }
        else if (text == "/automate") {
            isAutomated = true;
            bot.sendMessage(CHAT_ID, "🤖 *Mode Automate Aktif:* Sistem kembali memantau cuaca.", "Markdown");
        }
        else if (text == "/push") {
            if (!isAutomated) {
                jemuranServo.write(0);
                laundryProtected = false;
                bot.sendMessage(CHAT_ID, "☀️ *Manual:* Membuka jemuran", "Markdown");
            } else {
                bot.sendMessage(CHAT_ID, "❌ Gagal. Ubah ke mode `/manual` terlebih dahulu.", "Markdown");
            }
        }
        else if (text == "/pull") {
            if (!isAutomated) {
                jemuranServo.write(180);
                laundryProtected = true;
                bot.sendMessage(CHAT_ID, "🌧️ *Manual:* Menutup jemuran", "Markdown");
            } else {
                bot.sendMessage(CHAT_ID, "❌ Gagal. Ubah ke mode `/manual` terlebih dahulu.", "Markdown");
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

    bot.sendMessage(CHAT_ID, "🤖 *SkySense Online!*\nMode Default: *Automate*\n\nCommands:\n/manual - Mode Kendali Tangan\n/automate - Mode Sensor Otomatis", "Markdown");
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) connectWiFi();
    unsigned long currentMillis = millis();

    int sensorValue = analogRead(RAIN_SENSOR_PIN);
    String currentStatus = (sensorValue < RAIN_THRESHOLD) ? "Basah" : "Kering";
    String currentMode = isAutomated ? "Automate" : "Manual";

    if (isAutomated) {
        if (sensorValue < RAIN_THRESHOLD && !laundryProtected) {
            jemuranServo.write(180);
            laundryProtected = true;
            bot.sendMessage(CHAT_ID, "⚠️ *Otomatis:* Hujan! Menutup jemuran.", "Markdown");
        }
        else if (sensorValue > (RAIN_THRESHOLD + 100) && laundryProtected) {
            jemuranServo.write(0);
            laundryProtected = false;
            bot.sendMessage(CHAT_ID, "☀️ *Otomatis:* Terang! Membuka jemuran.", "Markdown");
        }
    }

    if (currentMillis - lastTimeDashboardUpdate > DASHBOARD_INTERVAL) {
        sendDataToDashboard(sensorValue, currentStatus, currentMode);
        lastTimeDashboardUpdate = currentMillis;
    }

    if (currentMillis - lastTimeBotRan > BOT_REQUEST_DELAY) {
        int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
        if (numNewMessages) handleNewMessages(numNewMessages);
        lastTimeBotRan = currentMillis;
    }
}
