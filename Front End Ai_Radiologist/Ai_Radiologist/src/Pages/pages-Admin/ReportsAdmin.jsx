import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReportModal from "../../modals/ReportModal"; 

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
            <div className="container-fluid">
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
                                                style={{ cursor: "pointer", fontSize: "1.3rem" }}
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

                    {showViewModal && selectedReport && (
                        <ReportModal
                            selectedReport={selectedReport}
                            onClose={() => setShowViewModal(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
