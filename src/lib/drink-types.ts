// 음주 관련 타입 정의

export interface DrinkGoal {
  id: string;
  userId: string;
  sojuBottles: number; // 주간 소주 병수
  beerCans: number; // 주간 맥주 캔수
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyDrinkRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD 형식
  drank: boolean; // 마셨는지 여부
  sojuBottles?: number; // 마신 소주 병수 (마셨을 경우에만)
  beerCans?: number; // 마신 맥주 캔수 (마셨을 경우에만)
  createdAt: Date;
  updatedAt: Date;
}

export interface DrinkGoalFormData {
  sojuBottles: number;
  beerCans: number;
}

export interface DailyRecordFormData {
  drank: boolean;
  sojuBottles?: number;
  beerCans?: number;
}
