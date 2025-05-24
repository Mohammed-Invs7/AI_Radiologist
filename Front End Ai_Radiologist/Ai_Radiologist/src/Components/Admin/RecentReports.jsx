import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const API_RECENT_REPORTS = `${BASE_URL}/admin/dashboard/recent/reports/`;

const RecentReports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_RECENT_REPORTS, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10 },
        });

        setReports(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching recent reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3 className="mb-4">Most Recent Reports</h3>

      <div className="table-responsive d-none d-md-block">
        <table
          className="table table-bordered table-sm"
          style={{ fontSize: "14px" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Modality</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  {report.full_name}
                </td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  {report.user}
                </td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  {report.modality}
                </td>
                <td>{new Date(report.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-block d-md-none">
        <div className="d-flex flex-column gap-3">
          {reports.map((report) => (
            <div key={report.id} className="card p-3 shadow-sm">
              <div>
                <strong>ID:</strong> {report.id}
              </div>
              <div>
                <strong>Full Name:</strong> {report.full_name}
              </div>
              <div>
                <strong>Email:</strong> {report.user}
              </div>
              <div>
                <strong>Modality:</strong> {report.modality}
              </div>
              <div>
                <strong>Date:</strong> {new Date(report.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentReports;
