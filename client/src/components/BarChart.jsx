import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

 




const GroupedBarChart = ({available,testing,used,inValid,expired}) => { 
  
  const chartRef = useRef();

 const data = {
  labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  datasets: [
    {
      label: 'متاح',
      data: available,
      backgroundColor: '#34D399', // emerald-400 (lighter green)
    },
    {
      label: 'مستخدم',
      data: used,
      backgroundColor: '#818CF8', // indigo-400 (lighter indigo)
    },
    {
      label: 'قيد الاختبار',
      data: testing,
      backgroundColor: '#FBBF24', // amber-400 (vibrant yellow)
    },
    {
      label: 'غير صالح',
      data: inValid,
      backgroundColor: '#EF4444', // red-500 (strong red)
    },
    {
      label: 'منتهي الصلاحية',
      data: expired,
      backgroundColor: '#D1D5DB', // gray-300 (soft gray)
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
    },
  },
};
  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  return <Bar data={data} options={options} />

};

export default GroupedBarChart;