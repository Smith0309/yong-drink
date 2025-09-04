'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DailyDrinkRecord } from '@/lib/drink-types';
import { getDailyRecords } from '@/lib/drink-service';

interface DrinkCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const DrinkCalendar: React.FC<DrinkCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<Record<string, DailyDrinkRecord>>({});
  const [loading, setLoading] = useState(false);

  const loadMonthRecords = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const monthRecords = await getDailyRecords(user.uid, startDate, endDate);
      
      const recordsMap: Record<string, DailyDrinkRecord> = {};
      monthRecords.forEach(record => {
        recordsMap[record.date] = record;
      });
      
      setRecords(recordsMap);
    } catch (error) {
      console.error('Error loading month records:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentDate]);

  useEffect(() => {
    if (user) {
      loadMonthRecords();
    }
  }, [user, currentDate, loadMonthRecords]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    onDateSelect(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return dateStr === selectedDate;
  };

  const getRecordStatus = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const record = records[dateStr];
    
    if (!record) return 'none';
    return record.drank ? 'drank' : 'not-drank';
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="drink-calendar">
      <div className="calendar-header">
        <button 
          onClick={() => navigateMonth('prev')}
          className="nav-button"
          disabled={loading}
        >
          ‹
        </button>
        <h3 className="calendar-title">
          {formatMonthYear(currentDate)}
        </h3>
        <button 
          onClick={() => navigateMonth('next')}
          className="nav-button"
          disabled={loading}
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="calendar-day empty" />;
          }

          const status = getRecordStatus(day);
          const isTodayDate = isToday(day);
          const isSelectedDate = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`calendar-day ${status} ${isTodayDate ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}`}
              disabled={loading}
            >
              <span className="day-number">{day}</span>
              {status === 'drank' && (
                <div className="status-indicator drank">🍺</div>
              )}
              {status === 'not-drank' && (
                <div className="status-indicator not-drank">✓</div>
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="calendar-loading">
          기록을 불러오는 중...
        </div>
      )}
    </div>
  );
};
