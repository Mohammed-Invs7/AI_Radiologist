import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Admin_Sidebar from "../../Components/Admin/Admin_Sidebar";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const AdminReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const itemsPerPage = 10;
    

    useEffect(() => {
        if (!user) return;
        fetchReports();
    }, [user]);

    const fetchReports = async () => {
        try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/v1/admin/users/reports/", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
        } catch (error) {
        console.error("Error fetching reports:", error);
        }
    };

    const fetchReportDetails = async (id) => {
        try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://127.0.0.1:8000/api/v1/admin/users/reports/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedReport(res.data);
        setShowViewModal(true);
        } catch (error) {
        console.error("Error fetching report details:", error);
        toast.error("Failed to load report details.");
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const reportsToDisplay = reports.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="container-fluid p-0">
        <ToastContainer />
        <div className="container-fluid min-vh-100" style={{ background: "#f8f9fa" }}>
            <div className="row">
            <div style={{ width: "20%" }} className="bg-white vh-100">
                <Admin_Sidebar />
            </div>
            <div className="col">
                <AdminNavbar />
                <div className="flex-grow-1 p-4">
                <h4 className="mb-4">Reports</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover table-sm">
                    <thead className="table-dark text-center align-middle">
                        <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>User</th>
                        <th>Modality</th>
                        <th>Body Region</th>
                        <th>Date</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                        <tbody className="text-center align-middle">
                            {reportsToDisplay.map((report, idx) => (
                                <tr key={report.id}>
                                <td>{idx + 1 + currentPage * itemsPerPage}</td>
                                <td>{report.title}</td>
                                <td>{report.user_full_name}</td>
                                <td>{report.radiology_modality}</td>
                                <td>{report.body_anatomical_region}</td>
                                <td>{new Date(report.report_date).toLocaleDateString()}</td>
                                <td>
                                    <i
                                        className="bx bx-show text-info"
                                        style={{ cursor: "pointer", fontSize: "1.3rem"  }}
                                        onClick={() => fetchReportDetails(report.id)}
                                        title="View"
                                    ></i>
                                </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <ReactPaginate
                    pageCount={Math.ceil(reports.length / itemsPerPage)}
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

                {/* View Report Modal with Framer Motion */}
                {showViewModal && selectedReport && (
                    <motion.div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content rounded shadow-lg">
                        <div className="modal-header">
                            <h5 className="modal-title">Report Details</h5>
                            <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {/* Display the image first */}
                            <div className=" d-flex text-center justify-content-center  mb-3">
                            <img
                                src={selectedReport.image_path}
                                alt="Report"
                                className="img-fluid rounded border shadow-sm "
                                style={{ maxWidth: "50%", maxHeight: "400px" }}
                            />
                            </div>

                            <p><strong>Title:</strong> {selectedReport.title}</p>
                            <p><strong>User:</strong> {selectedReport.user_full_name}</p>
                            <p><strong>Modality:</strong> {selectedReport.radiology_modality}</p>
                            <p><strong>Body Region:</strong> {selectedReport.body_anatomical_region}</p>
                            <p><strong>Date:</strong> {new Date(selectedReport.report_date).toLocaleDateString()}</p>
                            <p><strong>Details:</strong> {selectedReport.report_details}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                        </div>
                    </div>
                    </motion.div>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default AdminReports;
