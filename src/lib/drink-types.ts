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

// 분석 관련 타입 정의
export interface WeeklyAnalysis {
  weekNumber: number; // 1-52
  year: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number; // 해당 주의 총 일수
  drinkingDays: number; // 음주한 일수
  drinkingRate: number; // 음주 빈도율 (0-100)
  totalSojuBottles: number; // 총 소주 병수
  totalBeerCans: number; // 총 맥주 캔수
  goalAchievement: number; // 목표 달성률 (0-100)
}

export interface MonthlyAnalysis {
  month: number; // 1-12
  year: number;
  totalDays: number; // 해당 월의 총 일수
  drinkingDays: number; // 음주한 일수
  drinkingRate: number; // 음주 빈도율 (0-100)
  totalSojuBottles: number; // 총 소주 병수
  totalBeerCans: number; // 총 맥주 캔수
  averageDailySoju: number; // 일평균 소주 병수
  averageDailyBeer: number; // 일평균 맥주 캔수
  maxConsecutiveDays: number; // 최대 연속 음주 일수
  maxRestDays: number; // 최대 연속 휴식 일수
}

export interface CustomPeriodAnalysis {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number; // 선택한 기간의 총 일수
  drinkingDays: number; // 음주한 일수
  drinkingRate: number; // 음주 빈도율 (0-100)
  totalSojuBottles: number; // 총 소주 병수
  totalBeerCans: number; // 총 맥주 캔수
  averageDailySoju: number; // 일평균 소주 병수
  averageDailyBeer: number; // 일평균 맥주 캔수
  maxConsecutiveDays: number; // 최대 연속 음주 일수
  maxRestDays: number; // 최대 연속 휴식 일수
  weeklyBreakdown: WeeklyAnalysis[]; // 주간별 세부 분석
}

export interface ChartDataPoint {
  period: string; // 표시할 기간 (예: "1주차", "1월", "2024-01-01")
  drinkingRate: number; // 음주 빈도율
  totalSoju: number; // 소주 병수
  totalBeer: number; // 맥주 캔수
  drinkingDays: number; // 음주한 일수
  totalDays: number; // 총 일수
}

export interface AnalysisFilters {
  year: number;
  startDate?: string; // 사용자 정의 기간용
  endDate?: string; // 사용자 정의 기간용
}
