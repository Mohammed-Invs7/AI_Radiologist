import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const UserTrendChart = () => {
  const { token } = useAuth();
  const [trendData, setTrendData] = useState(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/admin/dashboard/trends/users/?days=${selectedDays}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrendData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching user trend data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [token, selectedDays]);

  if (loading)
    return <div className="text-center text-light">Loading chart...</div>;
  if (error)
    return (
      <div className="text-center text-danger">Error: {error.message}</div>
    );

  const gradientFill = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(0, 255, 164, 0.7)");
    gradient.addColorStop(1, "rgba(0, 90, 60, 0.3)");
    return gradient;
  };

  const data = {
    labels: trendData.labels,
    datasets: [
      {
        label: `User Registrations (${selectedDays} Days)`,
        data: trendData.data,
        fill: true,
        backgroundColor: (ctx) => gradientFill(ctx.chart.ctx),
        borderColor: "#00ffa4",
        pointBackgroundColor: "#00ffa4",
        pointBorderColor: "#fff",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ccc",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#ddd",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#aaa",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#aaa",
        },
      },
    },
  };

  return (
    <div
      className="card mb-4"
      style={{
        background: "#1f1f2e",
        borderRadius: "12px",
        border: "none",
        padding: "20px",
        color: "#fff",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center">
          <i
            className="bx bx-user-plus me-2"
            style={{ fontSize: "26px", color: "#00ffa4" }}
          ></i>
          <h5 style={{ margin: 0, fontWeight: "bold" }}>
            User Registrations (Last {selectedDays} Days)
          </h5>
        </div>

        <select
          className="form-select form-select-sm"
          style={{ width: "120px" }}
          value={selectedDays}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      <div
        className="w-100"
        style={{ height: "250px", maxHeight: "300px", overflowX: "auto" }}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default UserTrendChart;
