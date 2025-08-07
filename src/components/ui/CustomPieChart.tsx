import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieChartProps {
  data: Array<any>;
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

const COLORS = ['#2563eb', '#22c55e', '#f59e42', '#ef4444', '#a855f7', '#14b8a6'];

const CustomPieChart: React.FC<PieChartProps> = ({ data, dataKey, nameKey, colors = COLORS }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#2563eb"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default CustomPieChart;
