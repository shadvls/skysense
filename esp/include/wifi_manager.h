#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <ESP8266WiFi.h>

class WiFiManager {
public:
    void connect();
    bool isConnected();
    void disconnect();
    unsigned long getUptime();
private:
    unsigned long _connectedSince = 0;
    int _retryCount = 0;
    int _maxRetries = 10;
};

#endif
