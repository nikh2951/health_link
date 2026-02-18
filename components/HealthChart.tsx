
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WELLNESS_HISTORY } from '../constants';

export const HealthChart = () => {
  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={WELLNESS_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#004D40" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#004D40" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Area 
            name="Activity Score"
            type="monotone" 
            dataKey="activityScore" 
            stroke="#004D40" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorActivity)" 
          />
          <Area 
            name="Hydration %"
            type="monotone" 
            dataKey="hydrationLevel" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={0} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
