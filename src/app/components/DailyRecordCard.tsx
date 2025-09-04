'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DailyDrinkRecord } from '@/lib/drink-types';
import { getDailyRecord } from '@/lib/drink-service';

interface DailyRecordCardProps {
  date?: string; // YYYY-MM-DD 형식, 기본값은 오늘
  onEdit?: () => void;
  onCalendar?: () => void;
}

export const DailyRecordCard: React.FC<DailyRecordCardProps> = ({ 
  date = new Date().toISOString().split('T')[0], 
  onEdit,
  onCalendar
}) => {
  const { user } = useAuth();
  const [record, setRecord] = useState<DailyDrinkRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRecord = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const recordData = await getDailyRecord(user.uid, date);
      setRecord(recordData);
    } catch (error) {
      console.error('Error loading record:', error);
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    if (user) {
      loadRecord();
    }
  }, [user, date, loadRecord]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (loading) {
    return (
      <div className="record-card">
        <div className="card-header">
          <h3>오늘의 음주 기록</h3>
        </div>
        <div className="card-content">
          <div className="loading">기록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="record-card">
        <div className="card-header">
          <h3>오늘의 음주 기록</h3>
        </div>
        <div className="card-content">
          <div className="no-record">
            <p>{formatDate(date)}의 기록이 없습니다.</p>
            <button onClick={onEdit} className="btn-primary">
              기록 추가하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="record-card">
      <div className="card-header">
        <h3>오늘의 음주 기록</h3>
        <div className="card-actions">
          {onCalendar && (
            <button onClick={onCalendar} className="calendar-button">
              📅
            </button>
          )}
          <button onClick={onEdit} className="edit-button">
            수정
          </button>
        </div>
      </div>
      <div className="card-content">
        <div className="record-status">
          <div className={`status-indicator ${record.drank ? 'drank' : 'not-drank'}`}>
            {record.drank ? '마셨습니다' : '마시지 않았습니다'}
          </div>
        </div>
        
        {record.drank && (
          <div className="record-details">
            <div className="record-stat">
              <div className="stat-label">소주</div>
              <div className="stat-value">{record.sojuBottles}병</div>
            </div>
            <div className="record-stat">
              <div className="stat-label">맥주</div>
              <div className="stat-value">{record.beerCans}캔</div>
            </div>
          </div>
        )}
        
        <div className="record-info">
          <p>기록 시간: {record.updatedAt.toLocaleString('ko-KR')}</p>
        </div>
      </div>
    </div>
  );
};
