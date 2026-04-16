export interface ScheduleState {
  push: string;
  pull: string;
}

export interface SensorData {
  sensorValue: number;
  status: string;
  lastUpdate: string;
  schedule: ScheduleState;
  online: boolean;
  uptime: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
