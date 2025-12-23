// lib/api/types.ts

export interface LoginResponse {
  userId: string;
}

export interface DailyCodingStat {
  todayDate: string;
  codingTimeMs: number;
}

export interface CodingStatsResponse {
  daily: DailyCodingStat[];
  avgWeeklyCodingTime: number;
  maxWeeklyCodingTime: number;
  totalWeeklyCodingTime: number;
}
