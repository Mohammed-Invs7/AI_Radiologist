import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AddUserModal from "../../modals/AddUserModal";
import EditUserModal from "../../modals/EditUserModal";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const UsersAdmin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);

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
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/users/", {
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
        const token = localStorage.getItem("token");
        await axios.delete(`http://127.0.0.1:8000/api/v1/admin/users/${id}/`, {
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
      const token = localStorage.getItem("token");
      await axios.put(`http://127.0.0.1:8000/api/v1/admin/users/${editId}/`, currentUser, {
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
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/v1/admin/users/create/", data, {
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

  const usersToDisplay = users.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="container-fluid">
        <div className="flex-grow-1">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn-blue btn-primary"
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
                    <p> Num: {idx + 1 + currentPage * itemsPerPage}</p>
                      <p className="card-text"><strong>User: </strong>{user.first_name} {user.last_name}</p>
                      <p className="card-text"><strong>Email:</strong> {user.email}</p>
                      <p className="card-text"><strong>Gender:</strong> {user.gender}</p>
                      <p className="card-text"><strong>Age:</strong> {user.age}</p>
                      <p className="card-text"><strong>DoB:</strong> {user.date_of_birth}</p>
                      <p className="card-text"><strong>UserType:</strong> {user.user_type}</p>
                      <div className="d-flex justify-content-between mx-4">
                        <button className="btn btn-warning d-flex align-items-center " onClick={() => handleEdit(user, user.id)}>
                          <i className='bx bx-edit'></i> Edit
                        </button>

                        <button className="btn btn-danger d-flex align-items-center " onClick={() => handleDelete(user.id)}>
                          <i className='bx bx-trash'></i> Delete
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
