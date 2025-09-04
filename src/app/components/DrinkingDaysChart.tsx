'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/lib/drink-types';

interface DrinkingDaysChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
}

export const DrinkingDaysChart: React.FC<DrinkingDaysChartProps> = ({ 
  data, 
  title, 
  height = 300 
}) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="period" 
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => [
                `${value}일`,
                name === 'drinkingDays' ? '음주한 일수' : '총 일수'
              ]}
              labelFormatter={(label) => `기간: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="drinkingDays"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="totalDays"
              stroke="#6B7280"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={{ fill: '#6B7280', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5, stroke: '#6B7280', strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
