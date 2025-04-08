import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // استيراد useAuth
import Admin_Sidebar from "../../Components/Admin/Admin_Sidebar";
import Admin_Home from "./Admin_Home";

const UsersAdmin = () => {
  const { user, logout } = useAuth(); // الوصول إلى user و logout من AuthContext
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "M",
    age: "",
    date_of_birth: "",
    phone_number: "",
    user_type: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // التحقق من وجود مستخدم قبل استدعاء بيانات المستخدمين
    if (!user) {
      console.log("لا يوجد مستخدم مسجل الدخول");
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // جلب التوكن من localStorage
      const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/users/", {
        headers: {
          Authorization: `Bearer ${token}`, // إرسال التوكن مع الطلب
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => {
    logout(); // تسجيل الخروج باستخدام دالة logout من AuthContext
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID is missing, cannot delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token"); // الحصول على التوكن من localStorage
      if (!token) {
        console.error("No token found, unable to delete user.");
        return;
      }

      // إرسال الطلب لحذف المستخدم بناءً على ID
      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // إرسال التوكن مع الطلب
        },
      });

      alert("User deleted successfully.");
      fetchUsers(); // تحديث قائمة المستخدمين بعد الحذف
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleEdit = (user, id) => {
    setCurrentUser(user);
    setEditId(id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentUser({
      first_name: "",
      last_name: "",
      email: "",
      gender: "M",
      age: "",
      date_of_birth: "",
      phone_number: "",
      user_type: "",
    });
    setEditMode(false);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editMode) {
        await axios.put(
          `http://127.0.0.1:8000/api/v1/admin/users/${editId}/`,
          currentUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/v1/admin/users/",
          currentUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="container">
      <Admin_Sidebar />
      <h2 className="mb-4">Users Admin Dashboard</h2>

      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add User
      </button>

      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Logout
      </button>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Date of Birth</th>
            <th>Phone Number</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id}> {/* استخدم ID كـ key */}
              <td>{idx + 1}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.age}</td>
              <td>{user.date_of_birth}</td>
              <td>{user.phone_number}</td>
              <td>{user.user_type}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(user, user.id)} // تمرير الـ ID
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.id)} // تمرير الـ ID
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit User" : "Add User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {[ // قائمة الحقول
                    { label: "First Name", name: "first_name" },
                    { label: "Last Name", name: "last_name" },
                    { label: "Email", name: "email" },
                    { label: "Gender", name: "gender" },
                    { label: "Age", name: "age" },
                    { label: "Date of Birth", name: "date_of_birth", type: "date" },
                    { label: "Phone Number", name: "phone_number" },
                    { label: "User Type", name: "user_type" },
                  ].map((field, i) => (
                    <div className="col-md-6 mb-3" key={i}>
                      <label className="form-label">{field.label}</label>
                      <input
                        type={field.type || "text"}
                        className="form-control"
                        name={field.name}
                        value={currentUser[field.name]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSubmit}>
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
