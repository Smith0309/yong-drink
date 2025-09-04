'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '@/lib/drink-types';

interface DrinkAmountChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
}

export const DrinkAmountChart: React.FC<DrinkAmountChartProps> = ({ 
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
                `${value}${name === 'totalSoju' ? '병' : '캔'}`,
                name === 'totalSoju' ? '소주' : '맥주'
              ]}
              labelFormatter={(label) => `기간: ${label}`}
            />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="totalSoju"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              name="소주"
            />
            <Line
              type="monotone"
              dataKey="totalBeer"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              name="맥주"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
