import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AddUserModal from "../../modals/AddUserModal";
import EditUserModal from "../../modals/EditUserModal";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config";

const API_USERS = `${BASE_URL}/admin/users/`;
const API_CREATE_USERS = `${BASE_URL}/admin/users/create/`;

const UsersAdmin = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [userTypeFilter, setUserTypeFilter] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [newUser, setNewUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    gender: "M",
    date_of_birth: "",
    phone_number: "",
    password1: "",
    password2: "",
    user_type: 2,
  });

  const [currentUser, setCurrentUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "M",
    age: "",
    date_of_birth: "",
    user_type: "user",
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_USERS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_USERS}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("User deleted successfully.");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user.");
      }
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
      is_active: user.is_active,
    });
    setEditId(id);
    setShowEditModal(true);
  };

  const handleChangeEdit = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleChangeAdd = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.patch(`${API_USERS}${editId}/`, currentUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      toast.success("User updated successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
    }
  };

  const handleSubmitAdd = async (data) => {
    console.log("Submitted Data:", data);
    try {
      await axios.post(`${API_CREATE_USERS}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal(false);
      toast.success("User added successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user.");
    }
  };

  const handleToggleActive = async (userId, currentState) => {
    try {
      await axios.patch(
        `${API_USERS}${userId}/`,
        { is_active: !currentState },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `User has been ${
          !currentState ? "activated" : "deactivated"
        } successfully.`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error toggling active state:", error);
      toast.error("Failed to update user active state.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();

    const matchesName = fullName.includes(searchName.toLowerCase());
    const matchesEmail = email.includes(searchEmail.toLowerCase());

    const gender = genderFilter.toLowerCase();
    const userType = userTypeFilter.toLowerCase();

    const matchesGender =
      gender === "all" || user.gender?.toLowerCase() === gender;
    const matchesUserType =
      userType === "all" || String(user.user_type).toLowerCase() === userType;

    return matchesName && matchesEmail && matchesGender && matchesUserType;
  });

  const usersToDisplay = filteredUsers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="container-fluid">
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">
              <i
                className="bx bx-user me-2"
                style={{ color: "#4c74af", fontSize: "24px" }}
              ></i>
              Users
            </h4>
            <button
              className="btn btn-primary"
              onClick={() => {
                setNewUser({
                  email: "",
                  first_name: "",
                  last_name: "",
                  gender: "M",
                  date_of_birth: "",
                  phone_number: "",
                  password1: "",
                  password2: "",
                  user_type: 2,
                });
                setShowAddModal(true);
              }}
            >
              + Add User
            </button>
          </div>
          <div className="row mb-3 align-items-center">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <div className="col-md-3 mb-2">
                <select
                  className="form-select"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="All">All Genders</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select
                  className="form-select"
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                >
                  <option value="All">All User Types</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          </div>

          <div className="d-none d-lg-block">
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
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {usersToDisplay.map((user, idx) => (
                    <tr key={user.id}>
                      <td>{idx + 1 + currentPage * itemsPerPage}</td>
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
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEdit(user, user.id)}
                            title="Edit"
                          ></i>
                          <i
                            className="bx bx-trash text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          ></i>
                        </div>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={user.is_active}
                          onChange={() =>
                            handleToggleActive(user.id, user.is_active)
                          }
                          title={
                            user.is_active ? "Deactivate user" : "Activate user"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-block d-lg-none">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {usersToDisplay.map((user, idx) => (
                <div className="col" key={user.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <p>
                        <strong>#:</strong>{" "}
                        {idx + 1 + currentPage * itemsPerPage}
                      </p>
                      <p className="card-text">
                        <strong>User: </strong>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="card-text">
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p className="card-text">
                        <strong>Gender:</strong> {user.gender}
                      </p>
                      <p className="card-text">
                        <strong>Age:</strong> {user.age}
                      </p>
                      <p className="card-text">
                        <strong>DoB:</strong> {user.date_of_birth}
                      </p>
                      <p className="card-text">
                        <strong>UserType:</strong> {user.user_type}
                      </p>
                      <p className="card-text">
                        <strong>Status:</strong>{" "}
                        {user.is_active ? "Active" : "Inactive"}
                      </p>
                      <div className="d-flex justify-content-end gap-3">
                        <i
                          className="bx bx-edit text-warning fs-5"
                          onClick={() => handleEdit(user, user.id)}
                          title="Edit"
                          style={{ cursor: "pointer" }}
                        ></i>
                        <i
                          className="bx bx-trash text-danger fs-5"
                          onClick={() => handleDelete(user.id)}
                          title="Delete"
                          style={{ cursor: "pointer" }}
                        ></i>
                        <input
                          type="checkbox"
                          checked={user.is_active}
                          onChange={() =>
                            handleToggleActive(user.id, user.is_active)
                          }
                          title={
                            user.is_active ? "Deactivate user" : "Activate user"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ReactPaginate
            pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
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
        </div>
      </div>
      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onChange={handleChangeAdd}
        onSubmit={handleSubmitAdd}
        newUser={newUser}
      />
      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onChange={handleChangeEdit}
        onSubmit={handleSubmitEdit}
        currentUser={currentUser}
      />
    </div>
  );
};

export default UsersAdmin;
