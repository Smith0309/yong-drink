'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/app/components';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DrinkingRateChart, 
  DrinkAmountChart, 
  DrinkingDaysChart, 
  AnalysisSummary, 
  DateRangePicker 
} from '@/app/components';
import { 
  WeeklyAnalysis, 
  MonthlyAnalysis, 
  CustomPeriodAnalysis, 
  ChartDataPoint 
} from '@/lib/drink-types';
import { 
  getWeeklyAnalysis, 
  getMonthlyAnalysis, 
  getCustomPeriodAnalysis, 
  createChartDataPoints 
} from '@/lib/analysis-service';

type AnalysisType = 'weekly' | 'monthly' | 'custom';

export default function AnalysisPage() {
  const { user } = useAuth();
  const [analysisType, setAnalysisType] = useState<AnalysisType>('weekly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 분석 데이터 상태
  const [weeklyData, setWeeklyData] = useState<WeeklyAnalysis[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalysis[]>([]);
  const [customData, setCustomData] = useState<CustomPeriodAnalysis | null>(null);
  
  // 차트 데이터 상태
  const [drinkingRateData, setDrinkingRateData] = useState<ChartDataPoint[]>([]);
  const [drinkAmountData, setDrinkAmountData] = useState<ChartDataPoint[]>([]);
  const [drinkingDaysData, setDrinkingDaysData] = useState<ChartDataPoint[]>([]);

  // 사용자 정의 기간 초기화
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    setCustomStartDate(oneMonthAgo.toISOString().split('T')[0]);
    setCustomEndDate(today.toISOString().split('T')[0]);
  }, []);

  // 분석 데이터 로드
  const loadAnalysisData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        setError('로그인이 필요합니다.');
        return;
      }
      
      const userId = user.uid;
      console.log('Loading analysis data for user:', userId, 'type:', analysisType, 'year:', year);
      
      if (analysisType === 'weekly') {
        const data = await getWeeklyAnalysis(userId, year);
        console.log('Weekly analysis data:', data);
        setWeeklyData(data);
        setMonthlyData([]);
        setCustomData(null);
      } else if (analysisType === 'monthly') {
        const data = await getMonthlyAnalysis(userId, year);
        console.log('Monthly analysis data:', data);
        setMonthlyData(data);
        setWeeklyData([]);
        setCustomData(null);
      } else if (analysisType === 'custom') {
        if (!customStartDate || !customEndDate) {
          setError('시작일과 종료일을 모두 선택해주세요.');
          return;
        }
        const data = await getCustomPeriodAnalysis(userId, customStartDate, customEndDate);
        console.log('Custom analysis data:', data);
        setCustomData(data);
        setWeeklyData([]);
        setMonthlyData([]);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`분석 데이터를 불러오는 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  }, [analysisType, year, customStartDate, customEndDate, user]);

  // 차트 데이터 생성
  useEffect(() => {
    if (analysisType === 'weekly' && weeklyData.length > 0) {
      const chartData = createChartDataPoints(weeklyData, 'weekly');
      setDrinkingRateData(chartData);
      setDrinkAmountData(chartData);
      setDrinkingDaysData(chartData);
    } else if (analysisType === 'monthly' && monthlyData.length > 0) {
      const chartData = createChartDataPoints(monthlyData, 'monthly');
      setDrinkingRateData(chartData);
      setDrinkAmountData(chartData);
      setDrinkingDaysData(chartData);
    } else if (analysisType === 'custom' && customData) {
      const chartData = createChartDataPoints(customData, 'custom');
      setDrinkingRateData(chartData);
      setDrinkAmountData(chartData);
      setDrinkingDaysData(chartData);
    }
  }, [analysisType, weeklyData, monthlyData, customData]);

  // 분석 타입 변경 핸들러
  const handleAnalysisTypeChange = (type: AnalysisType) => {
    setAnalysisType(type);
  };

  // 연도 변경 핸들러
  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  // 사용자 정의 기간 변경 핸들러
  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  // 현재 분석 데이터 가져오기
  const getCurrentAnalysisData = () => {
    if (analysisType === 'weekly') return weeklyData;
    if (analysisType === 'monthly') return monthlyData;
    if (analysisType === 'custom') return customData;
    return [];
  };

  // 현재 분석 데이터가 있는지 확인
  const hasAnalysisData = () => {
    const data = getCurrentAnalysisData();
    return Array.isArray(data) ? data.length > 0 : data !== null;
  };

  return (
    <ProtectedRoute>
      <main className="analysis-page">
        <div className="analysis-container">
          <h1 className="analysis-title">AI 음주 분석</h1>
          <p className="analysis-subtitle">
            당신의 음주 패턴을 분석하고 건강한 음주 습관을 만들어보세요.
          </p>

          {/* 분석 타입 선택 */}
          <div className="analysis-type-selector">
            <button
              className={`type-button ${analysisType === 'weekly' ? 'active' : ''}`}
              onClick={() => handleAnalysisTypeChange('weekly')}
            >
              주간 분석 (1-52주)
            </button>
            <button
              className={`type-button ${analysisType === 'monthly' ? 'active' : ''}`}
              onClick={() => handleAnalysisTypeChange('monthly')}
            >
              월간 분석 (1-12월)
            </button>
            <button
              className={`type-button ${analysisType === 'custom' ? 'active' : ''}`}
              onClick={() => handleAnalysisTypeChange('custom')}
            >
              사용자 기간 설정
            </button>
          </div>

          {/* 필터 컨트롤 */}
          <div className="analysis-filters">
            {analysisType !== 'custom' && (
              <div className="year-selector">
                <label htmlFor="year-select">연도 선택:</label>
                <select
                  id="year-select"
                  value={year}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="year-select"
                >
                  {Array.from({ length: 7 }, (_, i) => {
                    const yearOption = new Date().getFullYear() - i;
                    return (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}년
                      </option>
                    );
                  })}
                  {Array.from({ length: 4 }, (_, i) => {
                    const yearOption = new Date().getFullYear() + i + 1;
                    return (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}년
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {analysisType === 'custom' && (
              <div className="custom-date-selector">
                <DateRangePicker
                  startDate={customStartDate}
                  endDate={customEndDate}
                  onStartDateChange={(date) => handleCustomDateChange(date, customEndDate)}
                  onEndDateChange={(date) => handleCustomDateChange(customStartDate, date)}
                />
              </div>
            )}

            <button
              onClick={loadAnalysisData}
              disabled={loading}
              className="analyze-button"
            >
              {loading ? '분석 중...' : '분석 실행'}
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* 분석 결과 */}
          {!loading && !error && hasAnalysisData() && (
            <div className="analysis-results">
              {/* 요약 정보 */}
              <AnalysisSummary
                data={getCurrentAnalysisData() as WeeklyAnalysis[] | MonthlyAnalysis[] | CustomPeriodAnalysis}
                type={analysisType}
              />

              {/* 차트들 */}
              <div className="charts-container">
                <DrinkingRateChart
                  data={drinkingRateData}
                  title="음주 빈도율 추이"
                />
                
                <DrinkAmountChart
                  data={drinkAmountData}
                  title="음주량 추이"
                />
                
                <DrinkingDaysChart
                  data={drinkingDaysData}
                  title="음주 일수 추이"
                />
              </div>
            </div>
          )}

          {/* 데이터가 없을 때 */}
          {!loading && !error && !hasAnalysisData() && (
            <div className="no-data-message">
              <p>선택한 기간에 분석할 데이터가 없습니다.</p>
              <p>음주 기록을 추가한 후 다시 시도해주세요.</p>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
