import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const API_MODEL_USAGE = `${BASE_URL}/admin/dashboard/models/`;

const ModelUsageChart = () => {
  const { token } = useAuth();
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch model usage data from API and filter active models
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_MODEL_USAGE, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const activeModels = response.data.filter(
          (model) => model.active_status === true
        );
        setModelData(activeModels);
      } catch (err) {
        setError(err);
        console.error("Error fetching model usage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModelData();
  }, [token]);

  if (loading)
    return <div className="text-center text-light">Loading chart...</div>;
  if (error)
    return (
      <div className="text-center text-danger">Error: {error.message}</div>
    );

  const labels = modelData.map((model) => model.name);
  const dataCounts = modelData.map((model) => model.usage_count);

  const data = {
    labels,
    datasets: [
      {
        label: "Reports per Model",
        data: dataCounts,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ccc",
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: { color: "#ccc" },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ccc",
          font: { size: 12, weight: "bold" },
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#ddd",
      },
    },
  };

  return (
    <div className="card shadow-lg border-light rounded mb-4">
      <div
        className="card-body"
        style={{ background: "#1f1f2e", color: "#fff", borderRadius: "12px" }}
      >
        <div className="d-flex align-items-center mb-3">
          <i
            className="bx bx-bar-chart me-2"
            style={{ fontSize: "26px", color: "#ff6384" }}
          ></i>
          <h5 style={{ margin: 0, fontWeight: "bold" }}>Model Usage Summary</h5>
        </div>
        <div style={{ width: "100%", height: "300px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ModelUsageChart;
