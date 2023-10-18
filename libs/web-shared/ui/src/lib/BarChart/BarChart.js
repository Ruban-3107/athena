import './BarChart.css';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      display: true,

      grid: {
        display: false,
      },
    },
  },
};

const labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const data = {
  labels,
  datasets: [
    {
      barThickness: 13,
      maxBarThickness: 20,

      minBarLength: 1,

      maxBarLength: 1,
      borderRadius: 15,
      data: [10, 7, 18, 15, 6, 10, 8],
      fill: 'start',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, '#EA5F8B');
        gradient.addColorStop(1, '#6149CD');
        return gradient;
      },
    },
  ],
};
export function BarChart(props) {
  return <Bar options={options} data={data} height="95px" />;
}
export default BarChart;
