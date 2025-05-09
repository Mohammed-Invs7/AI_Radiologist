import { useState, useEffect } from "react";
import axios from "axios";
import UserTrendChart from "../UserTrendChart";
import { BASE_URL } from "../../../config";

const API_SUMMARY = `${BASE_URL}/api/v1/admin/dashboard/summary/`;

const UsersCard = () => {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_SUMMARY}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // التوكن من المحل
          },
        });
        setUsersData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching user summary data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="card">
      <div className="card-header">Users Overview</div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h5>Total Users: {usersData.total_users}</h5>
            <h5>Active Users: {usersData.users_by_type.active}</h5>
            <h5>Inactive Users: {usersData.users_by_type.inactive}</h5>
          </div>
          <div className="col-md-6">
            <UserTrendChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersCard;
