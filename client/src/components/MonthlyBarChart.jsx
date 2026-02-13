import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

const MonthlyLineChart = ({ monthly }) => {
  const data = {
    labels: [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ],
    datasets: [
      {
        label: "التبرعات",
        data: monthly.donations,
        borderColor: '#9DBDB8', // green
        backgroundColor: '#9DBDB8',
        tension: 0.3,
        fill: false,
        pointRadius: 4,

      },
      {
        label: "الصادرات",
        data: monthly.exports,
        borderColor: '#F0E7D6', // indigo
        backgroundColor: '#F0E7D6',
        tension: 0.3,
        fill: false,
        pointRadius: 4,

      },
      {
        label: "الواردات",
        data: monthly.imports,
        borderColor: '#EA2E00', // red
        backgroundColor: '#EA2E00',
        tension: 0.3,
        fill: false,
        pointRadius: 4,

      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: `Monthly Statistics`,
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { color: '#E5E7EB' }, // light gray grid
      },
    },
  };

  return (
    <div  className="bg-white shadow rounded-lg p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyLineChart;