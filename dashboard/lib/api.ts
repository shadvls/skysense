import { STATUS_ENDPOINT, CONTROL_ENDPOINT, HEALTH_ENDPOINT } from "./constants";
import type { ApiResponse, SensorData } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export function fetchStatus(): Promise<SensorData> {
  return request<SensorData>(STATUS_ENDPOINT, {
    cache: "no-store",
  });
}

export function updateStatus(body: Partial<SensorData>): Promise<ApiResponse<SensorData>> {
  return request<ApiResponse<SensorData>>(STATUS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function sendControl(action: string): Promise<ApiResponse> {
  return request<ApiResponse>(CONTROL_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

export function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>(HEALTH_ENDPOINT);
}
