import React, { FC, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./AdminReport.module.scss";
import { FaFileCsv } from "react-icons/fa";
import instance from "../../api/AxiosInstance";

interface AdminReportProps {}

const AdminReport: FC<AdminReportProps> = () => {
  ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.aspectRatio = 16 / 9;
  ChartJS.defaults.layout.padding = 48;
  ChartJS.defaults.datasets.bar.categoryPercentage = 0.4;

  const [userData, setUserData] = useState<any[]>([]);

  const getData = async () => {
    try {
      const response = await instance.get(`/like/all`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const vacationLikesCounts = userData.reduce((counts, vacation) => {
    const { destination } = vacation;

    counts[destination] = (counts[destination] || 0) + 1;
    return counts;
  }, {});

  const likesCounts = Object.values(vacationLikesCounts);
  const keysArray = Object.keys(vacationLikesCounts);

  const chartData = {
    type: `bar`,
    labels: keysArray,
    datasets: [
      {
        label: "Likes",
        data: likesCounts,
        borderRadius: 12,
        backgroundColor: `#4361ee`,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: "#5F7681",
        },
      },
      y: {
        ticks: {
          color: "#4361ee",
          precision: 0,
        },
      },
    },
  };

  const exportCSV = async () => {
    try {
      const response = await instance.get(`vacations/csv/export`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.AdminReport}>
      <div className={styles.header}>
        <div className={styles.filterBar}>
          <h2>Admin Reports Dashboard</h2>
          <button className={styles.secondary} onClick={exportCSV}>
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>
      <div className={styles.brief}></div>
      <div className={styles.main}>
        <Bar className={styles.vacationsReportTable} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminReport;
