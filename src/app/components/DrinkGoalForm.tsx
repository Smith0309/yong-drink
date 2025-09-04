'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DrinkGoal, DrinkGoalFormData } from '@/lib/drink-types';
import { createDrinkGoal, updateDrinkGoal, getDrinkGoal } from '@/lib/drink-service';

interface DrinkGoalFormProps {
  onSuccess?: () => void;
}

export const DrinkGoalForm: React.FC<DrinkGoalFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DrinkGoalFormData>({
    sojuBottles: 0,
    beerCans: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingGoal, setExistingGoal] = useState<DrinkGoal | null>(null);

  const loadExistingGoal = useCallback(async () => {
    if (!user) return;
    
    try {
      const goal = await getDrinkGoal(user.uid);
      if (goal) {
        setExistingGoal(goal);
        setFormData({
          sojuBottles: goal.sojuBottles,
          beerCans: goal.beerCans,
        });
      }
    } catch (error) {
      console.error('Error loading existing goal:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadExistingGoal();
    }
  }, [user, loadExistingGoal]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      if (existingGoal) {
        // 기존 목표 업데이트
        const result = await updateDrinkGoal(existingGoal.id, formData);
        if (result.error) {
          setError(result.error);
        } else {
          onSuccess?.();
        }
      } else {
        // 새 목표 생성
        const result = await createDrinkGoal(user.uid, formData);
        if (result.error) {
          setError(result.error);
        } else {
          onSuccess?.();
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DrinkGoalFormData, value: number) => {
    const newFormData = {
      ...formData,
      [field]: Math.max(0, value),
    };
    setFormData(newFormData);
    
    // 자동 저장 (0.5초 디바운스)
    if (user) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      autoSaveTimeout.current = setTimeout(() => {
        autoSave(newFormData);
      }, 500);
    }
  };

  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const autoSave = async (data: DrinkGoalFormData) => {
    if (!user || (data.sojuBottles === 0 && data.beerCans === 0)) return;

    try {
      if (existingGoal) {
        await updateDrinkGoal(existingGoal.id, data);
      } else {
        const result = await createDrinkGoal(user.uid, data);
        if (result.id) {
          setExistingGoal({
            id: result.id,
            userId: user.uid,
            sojuBottles: data.sojuBottles,
            beerCans: data.beerCans,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  return (
    <div className="drink-goal-form">
      <h3 className="form-title">
        {existingGoal ? '음주 목표 수정' : '음주 목표 설정'}
      </h3>
      <p className="form-subtitle">
        주간 목표를 설정하여 건강한 음주 습관을 만들어보세요.
      </p>

      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label htmlFor="sojuBottles" className="form-label">
            주간 소주 목표 (병)
          </label>
          <div className="input-group">
            <button
              type="button"
              className="input-button"
              onClick={() => handleInputChange('sojuBottles', formData.sojuBottles - 1)}
              disabled={formData.sojuBottles <= 0}
            >
              -
            </button>
            <input
              id="sojuBottles"
              type="number"
              min="0"
              value={formData.sojuBottles}
              onChange={(e) => handleInputChange('sojuBottles', parseInt(e.target.value) || 0)}
              className="form-input"
            />
            <button
              type="button"
              className="input-button"
              onClick={() => handleInputChange('sojuBottles', formData.sojuBottles + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="beerCans" className="form-label">
            주간 맥주 목표 (캔)
          </label>
          <div className="input-group">
            <button
              type="button"
              className="input-button"
              onClick={() => handleInputChange('beerCans', formData.beerCans - 1)}
              disabled={formData.beerCans <= 0}
            >
              -
            </button>
            <input
              id="beerCans"
              type="number"
              min="0"
              value={formData.beerCans}
              onChange={(e) => handleInputChange('beerCans', parseInt(e.target.value) || 0)}
              className="form-input"
            />
            <button
              type="button"
              className="input-button"
              onClick={() => handleInputChange('beerCans', formData.beerCans + 1)}
            >
              +
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (formData.sojuBottles === 0 && formData.beerCans === 0)}
          className="btn-primary"
        >
          {loading ? '저장 중...' : existingGoal ? '목표 수정' : '목표 설정'}
        </button>
      </form>
    </div>
  );
};
