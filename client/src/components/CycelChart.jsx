import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);



const CycelChart = ({AU,AD,BU,BD,ABU,ABD,OU,OD}) => {
  const data = {
  labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  datasets: [
    {
      data: [AU, AD, BU, BD, ABU, ABD, OU, OD],
      backgroundColor: [
        '#fee2e2', // red-100 (lightest)
        '#fecaca', // red-200
        '#fca5a5', // red-300
        '#f87171', // red-400
        '#ef4444', // red-500
        '#dc2626', // red-600
        '#b91c1c', // red-700
        '#991b1b', // red-800 (darkest)
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { enabled: true },
  },
};
  return (
      <Doughnut data={data} options={options} />
  )
}

export default CycelChart
