import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import { BASE_URL } from "../../../config"
import { useAuth } from "../../../context/AuthContext";



const API_TRENDS_REPORTS = `${BASE_URL}/admin/dashboard/trends/reports/?days=30`;

const ReportTrendChart = () => {
      const { token } = useAuth();

  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_TRENDS_REPORTS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrendData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching report trend data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = {
    labels: trendData.labels, // تواريخ الأيام
    datasets: [
      {
        label: "Reports Created",
        data: trendData.data, // عدد التقارير
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  return <Line data={data} />;
};

export default ReportTrendChart;
