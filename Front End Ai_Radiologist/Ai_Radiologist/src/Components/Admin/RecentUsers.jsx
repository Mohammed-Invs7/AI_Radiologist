import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const API_RECENT_USERS = `${BASE_URL}/admin/dashboard/recent/users/`;

const RecentUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_RECENT_USERS, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10 },
        });

        setUsers(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching recent users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3 className="mb-4">Most Recent Users</h3>

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
              <th>Join Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="text-truncate" style={{ maxWidth: "100px" }}>
                  {user.first_name} {user.last_name}
                </td>
                <td className="text-truncate" style={{ maxWidth: "140px" }}>
                  {user.email}
                </td>
                <td>{new Date(user.join_date).toLocaleString()}</td>
                <td style={{ maxWidth: "70px" }}>{user.user_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-block d-md-none">
        <div className="d-flex flex-column gap-3">
          {users.map((user) => (
            <div key={user.id} className="card p-3 shadow-sm">
              <div>
                <strong>ID:</strong> {user.id}
              </div>
              <div>
                <strong>Full Name:</strong> {user.first_name} {user.last_name}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Join Date:</strong>{" "}
                {new Date(user.join_date).toLocaleString()}
              </div>
              <div>
                <strong>Type:</strong> {user.user_type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentUsers;
