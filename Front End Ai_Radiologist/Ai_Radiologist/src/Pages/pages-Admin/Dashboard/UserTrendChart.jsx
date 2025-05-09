import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext";

const API_TRENDS_USERS = `${BASE_URL}/admin/dashboard/trends/users/?days=30`;

const UserTrendChart = () => {
  const { token } = useAuth();

  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_TRENDS_USERS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrendData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching user trend data:", err);
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
        label: "User Registrations",
        data: trendData.data, // عدد التسجيلات
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  return <Line data={data} />;
};

export default UserTrendChart;
