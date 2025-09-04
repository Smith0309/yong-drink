'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DrinkGoal } from '@/lib/drink-types';
import { getDrinkGoal } from '@/lib/drink-service';

interface DrinkGoalCardProps {
  onEdit?: () => void;
}

export const DrinkGoalCard: React.FC<DrinkGoalCardProps> = ({ onEdit }) => {
  const { user } = useAuth();
  const [goal, setGoal] = useState<DrinkGoal | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGoal = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const goalData = await getDrinkGoal(user.uid);
      setGoal(goalData);
    } catch (error) {
      console.error('Error loading goal:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadGoal();
    }
  }, [user, loadGoal]);

  if (loading) {
    return (
      <div className="goal-card">
        <div className="card-header">
          <h3>음주 목표</h3>
        </div>
        <div className="card-content">
          <div className="loading">목표를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="goal-card">
        <div className="card-header">
          <h3>음주 목표</h3>
        </div>
        <div className="card-content">
          <div className="no-goal">
            <p>아직 설정된 목표가 없습니다.</p>
            <button onClick={onEdit} className="btn-secondary">
              목표 설정하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-card">
      <div className="card-header">
        <h3>음주 목표</h3>
        <button onClick={onEdit} className="edit-button">
          수정
        </button>
      </div>
      <div className="card-content">
        <div className="goal-stats">
          <div className="goal-stat">
            <div className="stat-label">주간 소주 목표</div>
            <div className="stat-value">{goal.sojuBottles}병</div>
          </div>
          <div className="goal-stat">
            <div className="stat-label">주간 맥주 목표</div>
            <div className="stat-value">{goal.beerCans}캔</div>
          </div>
        </div>
        <div className="goal-info">
          <p>마지막 업데이트: {goal.updatedAt.toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
    </div>
  );
};
