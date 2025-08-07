import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<any>;
  xKey: string;
  yKey: string;
  label?: string;
}

const CustomLineChart: React.FC<LineChartProps> = ({ data, xKey, yKey, label }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey={yKey} stroke="#2563eb" strokeWidth={2} name={label} />
    </LineChart>
  </ResponsiveContainer>
);

export default CustomLineChart;
