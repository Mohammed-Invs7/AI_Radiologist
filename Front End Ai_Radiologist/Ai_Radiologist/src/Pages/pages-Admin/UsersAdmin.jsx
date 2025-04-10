import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Admin_Sidebar from "../../Components/Admin/Admin_Sidebar";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import ReactPaginate from "react-paginate";

const UsersAdmin = () => {
  const { user } = useAuth();
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
    user_type: "user",
  });
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) {
      console.log("No Users");
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
      console.log("Users:", res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleEdit = (user, id) => {
    setCurrentUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      age: user.age,
      date_of_birth: user.date_of_birth,
      user_type: user.user_type,
    });
    setEditId(id);
    setEditMode(true);
    setShowModal(true);
  };

  // const handleAdd = () => {
  //   setCurrentUser({
  //     first_name: "",
  //     last_name: "",
  //     email: "",
  //     gender: "M",
  //     age: "",
  //     date_of_birth: "",
  //     user_type: "user",
  //   });
  //   setEditMode(false);
  //   setShowModal(true);
  // };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editMode) {
        await axios.put(`http://127.0.0.1:8000/api/v1/admin/users/${editId}/`, currentUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/v1/admin/users/", currentUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Pagination: Paginate users list
  const usersToDisplay = users.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="container-fluid p-0">
      <div style={{ background: "#f8f9fa" }} className="container-fluid min-vh-100">
        <div className="row">
          <div style={{ width: "20%" }} className="bg-white vh-100">
            <Admin_Sidebar />
          </div>
          <div className="col">
            <AdminNavbar />
            <div className="flex-grow-1 p-4">
              

              <div className="table-responsive">
                <table className="table table-bordered table-hover table-sm">
                  <thead className="table-dark text-center align-middle">
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Date of Birth</th>
                      <th>User Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-center align-middle">
                    {usersToDisplay.map((user, idx) => (
                      <tr key={user.id}>
                        <td>
                          {idx + 1 + currentPage * itemsPerPage}
                        </td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.gender}</td>
                        <td>{user.age}</td>
                        <td>{user.date_of_birth}</td>
                        <td>{user.user_type}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <i
                              className="bx bx-edit text-warning"
                              style={{ cursor: "pointer"}}
                              onClick={() => handleEdit(user, user.id)}
                              title="Edit"
                            ></i>
                            <i
                              className="bx bx-trash text-danger"
                              style={{ cursor: "pointer"}}
                              onClick={() => handleDelete(user.id)}
                              title="Delete"
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <ReactPaginate
                pageCount={Math.ceil(users.length / itemsPerPage)}
                onPageChange={handlePageClick}
                containerClassName="pagination justify-content-center mt-4"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
              />

              {/* <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-primary" onClick={handleAdd}>
                  + Add User
                </button>
              </div> */}

              {/* Modal */}
              {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{editMode ? "Edit User" : "Add User"}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="first_name"
                              value={currentUser.first_name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="last_name"
                              value={currentUser.last_name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={currentUser.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Gender</label>
                            <select
                              className="form-select"
                              name="gender"
                              value={currentUser.gender}
                              onChange={handleChange}
                            >
                              <option value="M">Male</option>
                              <option value="F">Female</option>
                            </select>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Date of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              name="date_of_birth"
                              value={currentUser.date_of_birth}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">User Type</label>
                            <select
                              className="form-select"
                              name="user_type"
                              value={currentUser.user_type}
                              onChange={handleChange}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;
