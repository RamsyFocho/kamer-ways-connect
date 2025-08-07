import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<any>;
  xKey: string;
  yKey: string;
  label?: string;
}

const CustomBarChart: React.FC<BarChartProps> = ({ data, xKey, yKey, label }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Bar dataKey={yKey} fill="#22c55e" name={label} />
    </BarChart>
  </ResponsiveContainer>
);

export default CustomBarChart;
