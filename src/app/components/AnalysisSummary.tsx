'use client';

import React from 'react';
import { WeeklyAnalysis, MonthlyAnalysis, CustomPeriodAnalysis } from '@/lib/drink-types';

interface AnalysisSummaryProps {
  data: WeeklyAnalysis[] | MonthlyAnalysis[] | CustomPeriodAnalysis;
  type: 'weekly' | 'monthly' | 'custom';
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ data, type }) => {
  const getSummaryData = () => {
    if (type === 'custom') {
      const customData = data as CustomPeriodAnalysis;
      return {
        totalDays: customData.totalDays,
        drinkingDays: customData.drinkingDays,
        drinkingRate: customData.drinkingRate,
        totalSoju: customData.totalSojuBottles,
        totalBeer: customData.totalBeerCans,
        averageDailySoju: customData.averageDailySoju,
        averageDailyBeer: customData.averageDailyBeer,
        maxConsecutiveDays: customData.maxConsecutiveDays,
        maxRestDays: customData.maxRestDays,
        period: `${customData.startDate} ~ ${customData.endDate}`
      };
    }
    
    const analysisArray = data as WeeklyAnalysis[] | MonthlyAnalysis[];
    const totalDays = analysisArray.reduce((sum, item) => sum + item.totalDays, 0);
    const drinkingDays = analysisArray.reduce((sum, item) => sum + item.drinkingDays, 0);
    const totalSoju = analysisArray.reduce((sum, item) => sum + item.totalSojuBottles, 0);
    const totalBeer = analysisArray.reduce((sum, item) => sum + item.totalBeerCans, 0);
    const drinkingRate = totalDays > 0 ? (drinkingDays / totalDays) * 100 : 0;
    const averageDailySoju = totalDays > 0 ? totalSoju / totalDays : 0;
    const averageDailyBeer = totalDays > 0 ? totalBeer / totalDays : 0;
    
    // 연속 음주/휴식 일수는 월간 분석에서만 계산
    let maxConsecutiveDays = 0;
    let maxRestDays = 0;
    
    if (type === 'monthly') {
      const monthlyData = analysisArray as MonthlyAnalysis[];
      maxConsecutiveDays = Math.max(...monthlyData.map(item => item.maxConsecutiveDays));
      maxRestDays = Math.max(...monthlyData.map(item => item.maxRestDays));
    }
    
    return {
      totalDays,
      drinkingDays,
      drinkingRate,
      totalSoju,
      totalBeer,
      averageDailySoju,
      averageDailyBeer,
      maxConsecutiveDays,
      maxRestDays,
      period: type === 'weekly' ? '주간 분석' : '월간 분석'
    };
  };
  
  const summary = getSummaryData();
  
  return (
    <div className="analysis-summary">
      <h3 className="summary-title">분석 요약</h3>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">분석 기간</div>
          <div className="summary-value">{summary.period}</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">총 일수</div>
          <div className="summary-value">{summary.totalDays}일</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">음주한 일수</div>
          <div className="summary-value">{summary.drinkingDays}일</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">음주 빈도율</div>
          <div className="summary-value">{summary.drinkingRate.toFixed(1)}%</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">총 소주</div>
          <div className="summary-value">{summary.totalSoju}병</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">총 맥주</div>
          <div className="summary-value">{summary.totalBeer}캔</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">일평균 소주</div>
          <div className="summary-value">{summary.averageDailySoju.toFixed(1)}병</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">일평균 맥주</div>
          <div className="summary-value">{summary.averageDailyBeer.toFixed(1)}캔</div>
        </div>
        
        {(type === 'monthly' || type === 'custom') && (
          <>
            <div className="summary-card">
              <div className="summary-label">최대 연속 음주</div>
              <div className="summary-value">{summary.maxConsecutiveDays}일</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-label">최대 연속 휴식</div>
              <div className="summary-value">{summary.maxRestDays}일</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
