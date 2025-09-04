'use client';

import React from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  disabled?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate);
    
    // 시작일이 종료일보다 늦으면 종료일을 시작일로 설정
    if (newStartDate > endDate) {
      onEndDateChange(newStartDate);
    }
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    onEndDateChange(newEndDate);
    
    // 종료일이 시작일보다 이르면 시작일을 종료일로 설정
    if (newEndDate < startDate) {
      onStartDateChange(newEndDate);
    }
  };
  
  return (
    <div className="date-range-picker">
      <div className="date-input-group">
        <label htmlFor="start-date" className="date-label">
          시작일
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          max={today}
          disabled={disabled}
          className="date-input"
        />
      </div>
      
      <div className="date-separator">~</div>
      
      <div className="date-input-group">
        <label htmlFor="end-date" className="date-label">
          종료일
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate}
          max={today}
          disabled={disabled}
          className="date-input"
        />
      </div>
    </div>
  );
};
