import ReportTrendChart from "../../Components/Admin/ReportTrendChart.jsx";
import UserTrendChart from "../../Components/Admin/UserTrendChart.jsx";
import ModelUsageChart from "../../Components/Admin/ModelUsageChart.jsx";
import RecentReports from "../../Components/Admin/RecentReports.jsx";
import RecentUsers from "../../Components/Admin/RecentUsers.jsx";
import DashboardSummary from "../../Components/Admin/DashboardSummary.jsx";

const AdminDashboard = () => {
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <DashboardSummary />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">
              <i
                className="bx bx-user me-2"
                style={{ color: "rgb(0, 255, 164)" }}
              ></i>
              User Trends
            </h5>
            <UserTrendChart />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">
              <i
                className="bx bx-file me-2"
                style={{ color: "rgb(0, 212, 255)" }}
              ></i>
              Report Trends
            </h5>
            <ReportTrendChart />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">
              <i
                className="bx bx-bar-chart-alt me-2"
                style={{ color: "rgb(255, 99, 132)" }}
              ></i>
              Model Usage
            </h5>
            <ModelUsageChart />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">
              <i
                className="bx bx-list-ul me-2"
                style={{ color: "#3f51b5" }}
              ></i>
              Recent Reports
            </h5>
            <RecentReports />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">
              <i
                className="bx bx-user-plus me-2"
                style={{ color: "#009688" }}
              ></i>
              Recent Users
            </h5>
            <RecentUsers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
