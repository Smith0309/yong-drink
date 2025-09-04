'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DailyDrinkRecord, DailyRecordFormData } from '@/lib/drink-types';
import { createDailyRecord, updateDailyRecord, getDailyRecord } from '@/lib/drink-service';

interface DailyRecordFormProps {
  date?: string; // YYYY-MM-DD 형식, 기본값은 오늘
  onSuccess?: () => void;
}

export const DailyRecordForm: React.FC<DailyRecordFormProps> = ({ 
  date = new Date().toISOString().split('T')[0], 
  onSuccess 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DailyRecordFormData>({
    drank: false,
    sojuBottles: 0,
    beerCans: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingRecord, setExistingRecord] = useState<DailyDrinkRecord | null>(null);

  const loadExistingRecord = useCallback(async () => {
    if (!user) return;
    
    try {
      const record = await getDailyRecord(user.uid, date);
      if (record) {
        setExistingRecord(record);
        setFormData({
          drank: record.drank,
          sojuBottles: record.sojuBottles || 0,
          beerCans: record.beerCans || 0,
        });
      } else {
        setFormData({
          drank: false,
          sojuBottles: 0,
          beerCans: 0,
        });
        setExistingRecord(null);
      }
    } catch (error) {
      console.error('Error loading existing record:', error);
    }
  }, [user, date]);

  useEffect(() => {
    if (user) {
      loadExistingRecord();
    }
  }, [user, date, loadExistingRecord]);

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
      if (existingRecord) {
        // 기존 기록 업데이트
        const result = await updateDailyRecord(existingRecord.id, formData);
        if (result.error) {
          setError(result.error);
        } else {
          onSuccess?.();
        }
      } else {
        // 새 기록 생성
        const result = await createDailyRecord(user.uid, date, formData);
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

  const handleDrankChange = (drank: boolean) => {
    const newFormData = {
      ...formData,
      drank,
      sojuBottles: drank ? formData.sojuBottles : 0,
      beerCans: drank ? formData.beerCans : 0,
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

  const handleAmountChange = (field: 'sojuBottles' | 'beerCans', value: number) => {
    const newFormData = {
      ...formData,
      [field]: Math.max(0, value),
    };
    setFormData(newFormData);
    
    // 자동 저장 (0.5초 디바운스)
    if (user && formData.drank) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      autoSaveTimeout.current = setTimeout(() => {
        autoSave(newFormData);
      }, 500);
    }
  };

  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const autoSave = async (data: DailyRecordFormData) => {
    if (!user) return;

    try {
      if (existingRecord) {
        await updateDailyRecord(existingRecord.id, data);
      } else {
        const result = await createDailyRecord(user.uid, date, data);
        if (result.id) {
          setExistingRecord({
            id: result.id,
            userId: user.uid,
            date: date,
            drank: data.drank,
            sojuBottles: data.sojuBottles || 0,
            beerCans: data.beerCans || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <div className="daily-record-form">
      <h3 className="form-title">
        {existingRecord ? '음주 기록 수정' : '음주 기록 추가'}
      </h3>
      <p className="form-subtitle">
        {formatDate(date)}의 음주 기록을 남겨보세요.
      </p>

      <form onSubmit={handleSubmit} className="record-form">
        <div className="form-group">
          <label className="form-label">오늘 술을 마셨나요?</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="drank"
                checked={formData.drank}
                onChange={() => handleDrankChange(true)}
                className="radio-input"
              />
              <span className="radio-text">네, 마셨습니다</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="drank"
                checked={!formData.drank}
                onChange={() => handleDrankChange(false)}
                className="radio-input"
              />
              <span className="radio-text">아니요, 마시지 않았습니다</span>
            </label>
          </div>
        </div>

        {formData.drank && (
          <>
            <div className="form-group">
              <label htmlFor="sojuBottles" className="form-label">
                소주 (병)
              </label>
              <div className="input-group">
                <button
                  type="button"
                  className="input-button"
                  onClick={() => handleAmountChange('sojuBottles', formData.sojuBottles! - 1)}
                  disabled={formData.sojuBottles! <= 0}
                >
                  -
                </button>
                <input
                  id="sojuBottles"
                  type="number"
                  min="0"
                  value={formData.sojuBottles}
                  onChange={(e) => handleAmountChange('sojuBottles', parseInt(e.target.value) || 0)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="input-button"
                  onClick={() => handleAmountChange('sojuBottles', formData.sojuBottles! + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="beerCans" className="form-label">
                맥주 (캔)
              </label>
              <div className="input-group">
                <button
                  type="button"
                  className="input-button"
                  onClick={() => handleAmountChange('beerCans', formData.beerCans! - 1)}
                  disabled={formData.beerCans! <= 0}
                >
                  -
                </button>
                <input
                  id="beerCans"
                  type="number"
                  min="0"
                  value={formData.beerCans}
                  onChange={(e) => handleAmountChange('beerCans', parseInt(e.target.value) || 0)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="input-button"
                  onClick={() => handleAmountChange('beerCans', formData.beerCans! + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? '저장 중...' : existingRecord ? '기록 수정' : '기록 저장'}
        </button>
      </form>
    </div>
  );
};
