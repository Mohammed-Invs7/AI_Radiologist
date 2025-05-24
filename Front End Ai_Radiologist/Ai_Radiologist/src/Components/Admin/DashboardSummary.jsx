import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const API_DASHBOARD_SUMMARY = `${BASE_URL}/admin/dashboard/summary/`;

const DashboardSummary = () => {
  const { token } = useAuth();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_DASHBOARD_SUMMARY, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummaryData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching dashboard summary data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h4 className="mb-4 fw-bold">
        <i
          className="bx bx-bar-chart-alt-2 me-2"
          style={{ color: "#4caf50", fontSize: "24px" }}
        ></i>
        Dashboard
      </h4>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Total Users</h6>
                <h2 className="fw-bold">{summaryData.total_users}</h2>
              </div>
              <i
                className="bx bx-user"
                style={{ fontSize: "48px", color: "#2196f3" }}
              ></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Active Users</h6>
                <h2 className="fw-bold">{summaryData.active_users}</h2>
              </div>
              <i
                className="bx bx-user-check"
                style={{ fontSize: "48px", color: "#4caf50" }}
              ></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Inactive Users</h6>
                <h2 className="fw-bold">{summaryData.inactive_users}</h2>
              </div>
              <i
                className="bx bx-user-x"
                style={{ fontSize: "48px", color: "#f44336" }}
              ></i>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Total Reports</h6>
                <h2 className="fw-bold">{summaryData.total_reports}</h2>
              </div>
              <i
                className="bx bx-file"
                style={{ fontSize: "48px", color: "#00bcd4" }}
              ></i>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Reports Today</h6>
                <h2 className="fw-bold">{summaryData.reports_today}</h2>
              </div>
              <i
                className="bx bx-calendar"
                style={{ fontSize: "48px", color: "#ff9800" }}
              ></i>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body">
              <h6>
                <i
                  className="bx bx-category me-2"
                  style={{ color: "#9c27b0" }}
                ></i>
                Reports by Modality
              </h6>
              <ul className="list-group list-group-flush">
                {summaryData.reports_by_modality.map((modality) => (
                  <li
                    key={modality.modality}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{modality.modality}</span>
                    <span className="fw-bold">{modality.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body">
              <h6>
                <i
                  className="bx bx-group me-2"
                  style={{ color: "#673ab7" }}
                ></i>
                Users by Type
              </h6>
              <ul className="list-group list-group-flush">
                {summaryData.users_by_type.map((type) => (
                  <li
                    key={type.name}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{type.name}</span>
                    <span className="fw-bold">{type.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
