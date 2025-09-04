import { 
  WeeklyAnalysis, 
  MonthlyAnalysis, 
  CustomPeriodAnalysis, 
  ChartDataPoint, 
  AnalysisFilters,
  DailyDrinkRecord,
  DrinkGoal
} from './drink-types';
import { getDailyRecords, getDrinkGoal } from './drink-service';

// 주간 분석 데이터 생성
export const getWeeklyAnalysis = async (userId: string, year: number): Promise<WeeklyAnalysis[]> => {
  console.log('Starting weekly analysis for user:', userId, 'year:', year);
  const weeklyAnalyses: WeeklyAnalysis[] = [];
  const goal = await getDrinkGoal(userId);
  console.log('Drink goal:', goal);
  
  // 해당 연도의 모든 일일 기록 가져오기
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const records = await getDailyRecords(userId, startDate, endDate);
  console.log('Retrieved records for analysis:', records.length);
  
  // 기록을 날짜별로 맵핑
  const recordsMap = new Map<string, DailyDrinkRecord>();
  records.forEach(record => {
    recordsMap.set(record.date, record);
  });
  
  // 52주 분석
  for (let week = 1; week <= 52; week++) {
    const weekData = getWeekDates(year, week);
    const weekRecords = getRecordsForWeek(recordsMap, weekData.startDate, weekData.endDate);
    
    const totalDays = weekData.totalDays;
    const drinkingDays = weekRecords.filter(r => r.drank).length;
    const drinkingRate = totalDays > 0 ? (drinkingDays / totalDays) * 100 : 0;
    
    const totalSojuBottles = weekRecords.reduce((sum, r) => sum + (r.sojuBottles || 0), 0);
    const totalBeerCans = weekRecords.reduce((sum, r) => sum + (r.beerCans || 0), 0);
    
    // 목표 달성률 계산
    let goalAchievement = 0;
    if (goal) {
      const goalSoju = goal.sojuBottles;
      const goalBeer = goal.beerCans;
      const actualSoju = totalSojuBottles;
      const actualBeer = totalBeerCans;
      
      if (goalSoju > 0 || goalBeer > 0) {
        const sojuRate = goalSoju > 0 ? Math.min(actualSoju / goalSoju, 1) : 0;
        const beerRate = goalBeer > 0 ? Math.min(actualBeer / goalBeer, 1) : 0;
        goalAchievement = ((sojuRate + beerRate) / 2) * 100;
      }
    }
    
    weeklyAnalyses.push({
      weekNumber: week,
      year,
      startDate: weekData.startDate,
      endDate: weekData.endDate,
      totalDays,
      drinkingDays,
      drinkingRate,
      totalSojuBottles,
      totalBeerCans,
      goalAchievement
    });
  }
  
  return weeklyAnalyses;
};

// 월간 분석 데이터 생성
export const getMonthlyAnalysis = async (userId: string, year: number): Promise<MonthlyAnalysis[]> => {
  console.log('Starting monthly analysis for user:', userId, 'year:', year);
  const monthlyAnalyses: MonthlyAnalysis[] = [];
  
  // 해당 연도의 모든 일일 기록 가져오기
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const records = await getDailyRecords(userId, startDate, endDate);
  console.log('Retrieved records for monthly analysis:', records.length);
  
  // 기록을 날짜별로 맵핑
  const recordsMap = new Map<string, DailyDrinkRecord>();
  records.forEach(record => {
    recordsMap.set(record.date, record);
  });
  
  // 12개월 분석
  for (let month = 1; month <= 12; month++) {
    const monthData = getMonthDates(year, month);
    const monthRecords = getRecordsForMonth(recordsMap, year, month);
    
    const totalDays = monthData.totalDays;
    const drinkingDays = monthRecords.filter(r => r.drank).length;
    const drinkingRate = totalDays > 0 ? (drinkingDays / totalDays) * 100 : 0;
    
    const totalSojuBottles = monthRecords.reduce((sum, r) => sum + (r.sojuBottles || 0), 0);
    const totalBeerCans = monthRecords.reduce((sum, r) => sum + (r.beerCans || 0), 0);
    
    const averageDailySoju = totalDays > 0 ? totalSojuBottles / totalDays : 0;
    const averageDailyBeer = totalDays > 0 ? totalBeerCans / totalDays : 0;
    
    // 연속 음주/휴식 일수 계산
    const { maxConsecutiveDays, maxRestDays } = calculateConsecutiveDays(monthRecords);
    
    monthlyAnalyses.push({
      month,
      year,
      totalDays,
      drinkingDays,
      drinkingRate,
      totalSojuBottles,
      totalBeerCans,
      averageDailySoju,
      averageDailyBeer,
      maxConsecutiveDays,
      maxRestDays
    });
  }
  
  return monthlyAnalyses;
};

// 사용자 정의 기간 분석 데이터 생성
export const getCustomPeriodAnalysis = async (
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<CustomPeriodAnalysis> => {
  console.log('Starting custom period analysis for user:', userId, 'from', startDate, 'to', endDate);
  const records = await getDailyRecords(userId, startDate, endDate);
  console.log('Retrieved records for custom analysis:', records.length);
  
  const totalDays = calculateDaysBetween(startDate, endDate);
  const drinkingDays = records.filter(r => r.drank).length;
  const drinkingRate = totalDays > 0 ? (drinkingDays / totalDays) * 100 : 0;
  
  const totalSojuBottles = records.reduce((sum, r) => sum + (r.sojuBottles || 0), 0);
  const totalBeerCans = records.reduce((sum, r) => sum + (r.beerCans || 0), 0);
  
  const averageDailySoju = totalDays > 0 ? totalSojuBottles / totalDays : 0;
  const averageDailyBeer = totalDays > 0 ? totalBeerCans / totalDays : 0;
  
  // 연속 음주/휴식 일수 계산
  const { maxConsecutiveDays, maxRestDays } = calculateConsecutiveDays(records);
  
  // 주간별 세부 분석
  const weeklyBreakdown = await getWeeklyBreakdownForPeriod(userId, startDate, endDate);
  
  return {
    startDate,
    endDate,
    totalDays,
    drinkingDays,
    drinkingRate,
    totalSojuBottles,
    totalBeerCans,
    averageDailySoju,
    averageDailyBeer,
    maxConsecutiveDays,
    maxRestDays,
    weeklyBreakdown
  };
};

// 차트 데이터 포인트 생성
export const createChartDataPoints = (
  analyses: WeeklyAnalysis[] | MonthlyAnalysis[] | CustomPeriodAnalysis,
  type: 'weekly' | 'monthly' | 'custom'
): ChartDataPoint[] => {
  if (type === 'custom') {
    const customAnalysis = analyses as CustomPeriodAnalysis;
    return customAnalysis.weeklyBreakdown.map(week => ({
      period: `${week.weekNumber}주차`,
      drinkingRate: week.drinkingRate,
      totalSoju: week.totalSojuBottles,
      totalBeer: week.totalBeerCans,
      drinkingDays: week.drinkingDays,
      totalDays: week.totalDays
    }));
  }
  
  const analysisArray = analyses as WeeklyAnalysis[] | MonthlyAnalysis[];
  
  return analysisArray.map(analysis => {
    if (type === 'weekly') {
      const weekAnalysis = analysis as WeeklyAnalysis;
      return {
        period: `${weekAnalysis.weekNumber}주차`,
        drinkingRate: weekAnalysis.drinkingRate,
        totalSoju: weekAnalysis.totalSojuBottles,
        totalBeer: weekAnalysis.totalBeerCans,
        drinkingDays: weekAnalysis.drinkingDays,
        totalDays: weekAnalysis.totalDays
      };
    } else {
      const monthAnalysis = analysis as MonthlyAnalysis;
      return {
        period: `${monthAnalysis.month}월`,
        drinkingRate: monthAnalysis.drinkingRate,
        totalSoju: monthAnalysis.totalSojuBottles,
        totalBeer: monthAnalysis.totalBeerCans,
        drinkingDays: monthAnalysis.drinkingDays,
        totalDays: monthAnalysis.totalDays
      };
    }
  });
};

// 유틸리티 함수들
function getWeekDates(year: number, week: number): { startDate: string; endDate: string; totalDays: number } {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstMonday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  firstMonday.setDate(firstDayOfYear.getDate() + daysToMonday);
  
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  // 연도 경계 처리
  if (weekStart.getFullYear() !== year) {
    weekStart.setFullYear(year);
  }
  if (weekEnd.getFullYear() !== year) {
    weekEnd.setFullYear(year);
  }
  
  const startDate = weekStart.toISOString().split('T')[0];
  const endDate = weekEnd.toISOString().split('T')[0];
  const totalDays = Math.min(7, calculateDaysBetween(startDate, endDate) + 1);
  
  return { startDate, endDate, totalDays };
}

function getMonthDates(year: number, month: number): { totalDays: number } {
  const lastDay = new Date(year, month, 0);
  return { totalDays: lastDay.getDate() };
}

function getRecordsForWeek(
  recordsMap: Map<string, DailyDrinkRecord>, 
  startDate: string, 
  endDate: string
): DailyDrinkRecord[] {
  const records: DailyDrinkRecord[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const record = recordsMap.get(dateStr);
    if (record) {
      records.push(record);
    }
  }
  
  return records;
}

function getRecordsForMonth(
  recordsMap: Map<string, DailyDrinkRecord>, 
  year: number, 
  month: number
): DailyDrinkRecord[] {
  const records: DailyDrinkRecord[] = [];
  const lastDay = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const record = recordsMap.get(dateStr);
    if (record) {
      records.push(record);
    }
  }
  
  return records;
}

function calculateConsecutiveDays(records: DailyDrinkRecord[]): { maxConsecutiveDays: number; maxRestDays: number } {
  let maxConsecutiveDays = 0;
  let maxRestDays = 0;
  let currentConsecutiveDays = 0;
  let currentRestDays = 0;
  
  // 날짜순으로 정렬
  const sortedRecords = records.sort((a, b) => a.date.localeCompare(b.date));
  
  for (const record of sortedRecords) {
    if (record.drank) {
      currentConsecutiveDays++;
      currentRestDays = 0;
      maxConsecutiveDays = Math.max(maxConsecutiveDays, currentConsecutiveDays);
    } else {
      currentRestDays++;
      currentConsecutiveDays = 0;
      maxRestDays = Math.max(maxRestDays, currentRestDays);
    }
  }
  
  return { maxConsecutiveDays, maxRestDays };
}

function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

async function getWeeklyBreakdownForPeriod(
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<WeeklyAnalysis[]> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  
  const weeklyAnalyses: WeeklyAnalysis[] = [];
  
  for (let year = startYear; year <= endYear; year++) {
    const yearStart = year === startYear ? startDate : `${year}-01-01`;
    const yearEnd = year === endYear ? endDate : `${year}-12-31`;
    
    const yearAnalyses = await getWeeklyAnalysis(userId, year);
    const filteredAnalyses = yearAnalyses.filter(analysis => 
      analysis.startDate >= yearStart && analysis.endDate <= yearEnd
    );
    
    weeklyAnalyses.push(...filteredAnalyses);
  }
  
  return weeklyAnalyses;
}
