import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
import "react-toastify/dist/ReactToastify.css";
import ReportModal from "../../modals/ReportModal"; 

const AdminReports = () => {
    const { user , token } = useAuth();
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
            <div className="container-fluid m-4">
                <div className="flex-grow-1 p-4">
                    
                    <div className="d-none d-lg-block">
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
                    </div>

                    <div className="d-block d-lg-none">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {reportsToDisplay.map((report, idx) => (
                                <div className="col" key={report.id}>
                                    <div className="card shadow-sm">
                                        <div className="card-body">
                                            <p>{idx + 1 + currentPage * itemsPerPage}</p>
                                            <h5 className="card-title"><strong>Title: </strong> {report.title}</h5>
                                            <p className="card-text"><strong>User:</strong> {report.user_full_name}</p>
                                            <p className="card-text"><strong>Modality:</strong> {report.radiology_modality}</p>
                                            <p className="card-text"><strong>Body Region:</strong> {report.body_anatomical_region}</p>
                                            <p className="card-text"><strong>Date:</strong> {new Date(report.report_date).toLocaleDateString()}</p>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn-blue btn-info btn-sm" onClick={() => fetchReportDetails(report.id)}>
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
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
