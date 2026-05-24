#ifndef NTP_SYNC_H
#define NTP_SYNC_H

#include <TimeLib.h>

bool syncNTP();
time_t getCurrentTime();
bool isTimeSynced();

#endif
