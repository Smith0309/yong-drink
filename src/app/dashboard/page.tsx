'use client';

import { useState } from 'react';
import { ProtectedRoute, DrinkGoalCard, DailyRecordCard, DrinkGoalForm, DailyRecordForm, DrinkCalendar } from '@/app/components';

export default function DashboardPage() {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGoalSuccess = () => {
    setShowGoalForm(false);
  };

  const handleRecordSuccess = () => {
    setShowRecordForm(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowRecordForm(true);
    setShowCalendar(false);
  };

  return (
    <ProtectedRoute>
      <main className="dashboard">
        <div className="dashboard-container">
          <h1 className="dashboard-title">대시보드</h1>
          <p className="dashboard-subtitle">
            안녕하세요! Yong Drink와 함께 건강한 음주 습관을 만들어보세요.
          </p>
          
          <div className="dashboard-content">
            {showGoalForm ? (
              <div className="dashboard-card full-width">
                <DrinkGoalForm onSuccess={handleGoalSuccess} />
                <button 
                  onClick={() => setShowGoalForm(false)}
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  취소
                </button>
              </div>
            ) : (
              <DrinkGoalCard onEdit={() => setShowGoalForm(true)} />
            )}

            {showCalendar ? (
              <div className="dashboard-card full-width">
                <DrinkCalendar 
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  닫기
                </button>
              </div>
            ) : showRecordForm ? (
              <div className="dashboard-card full-width">
                <DailyRecordForm 
                  date={selectedDate}
                  onSuccess={handleRecordSuccess} 
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => setShowRecordForm(false)}
                    className="btn-secondary"
                  >
                    취소
                  </button>
                  <button 
                    onClick={() => setShowCalendar(true)}
                    className="btn-secondary"
                  >
                    날짜 선택
                  </button>
                </div>
              </div>
            ) : (
              <DailyRecordCard 
                date={selectedDate}
                onEdit={() => setShowRecordForm(true)}
                onCalendar={() => setShowCalendar(true)}
              />
            )}
            
            <div className="dashboard-card">
              <h3>AI 분석</h3>
              <p>당신의 음주 패턴을 분석해보세요.</p>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = '/analysis'}
              >
                분석 보기
              </button>
            </div>
            
            <div className="dashboard-card">
              <h3>안전 가이드</h3>
              <p>현재 상태에 맞는 안전 가이드를 확인하세요.</p>
              <button className="btn-secondary">가이드 보기</button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
