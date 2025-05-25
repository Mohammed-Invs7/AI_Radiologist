import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
import "react-toastify/dist/ReactToastify.css";
import ReportModal from "../../modals/ReportModal";
import { BASE_URL } from "../../config";

const API_REPORTS = `${BASE_URL}/admin/users/reports/`;
const API_SEL = `${BASE_URL}/admin/ai_models/radio-options/`;

const AdminReports = () => {
  const { user, token } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [modalitiesFilter, setModalitiesFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalitiesWithRegions, setModalitiesWithRegions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    fetchReports();
    fetchModalitiesWithRegions();
  }, [user]);

  const fetchModalitiesWithRegions = async () => {
    try {
      const res = await axios.get(API_SEL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalitiesWithRegions(res.data);
    } catch (error) {
      console.error("Error fetching modalities with regions:", error);
    }
  };

  const selectedRegions =
    modalitiesWithRegions.find(
      (item) => item.modality.name === modalitiesFilter
    )?.regions || [];

  useEffect(() => {
    setCurrentPage(0);
    filterReports();
  }, [
    reports,
    modelSearchTerm,
    titleSearchTerm,
    startDate,
    endDate,
    modalitiesFilter,
    regionFilter,
  ]);

  const filterReports = () => {
    console.log("Filtering Reports with:", {
      // userSearchTerm,
      titleSearchTerm,
      startDate,
      endDate,
      modalitiesFilter,
      regionFilter,
    });

    if (modalitiesFilter === "all") {
      setRegionFilter("all");
    }

    let filtered = reports.filter((report) => {
      const modelMatch = report.model
        ?.toLowerCase()
        .includes(modelSearchTerm.toLowerCase());

      const titleMatch = report.title
        ?.toLowerCase()
        .includes(titleSearchTerm.toLowerCase());

      const modalityMatch =
        modalitiesFilter === "all" ||
        report.radiology_modality === modalitiesFilter;

      const regionMatch =
        regionFilter === "all" ||
        report.body_anatomical_region === regionFilter;

      const dateMatch =
        (!startDate || new Date(report.report_date) >= new Date(startDate)) &&
        (!endDate || new Date(report.report_date) <= new Date(endDate));

      return (
        modelMatch && titleMatch && modalityMatch && regionMatch && dateMatch
      );
    });

    setFilteredReports(filtered);
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_REPORTS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchReportDetails = async (id) => {
    try {
      const res = await axios.get(`${API_REPORTS}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedReport(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error fetching report details:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const reportsToDisplay = filteredReports.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <h4 className="fw-bold ">
        <i
          className="bx bx-detail me-2"
          style={{ color: "#4c74af", fontSize: "24px" }}
        ></i>
        Reports
      </h4>
      <div className="flex-grow-1 p-4">
        {/* Search and Filters */}
        <div className="row mb-3 d-flex justify-content-center">
          <div className="col-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Model ..."
              value={modelSearchTerm}
              onChange={(e) => setModelSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Title..."
              value={titleSearchTerm}
              onChange={(e) => setTitleSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-2 mb-2 mx-1">
            <select
              className="form-select"
              value={modalitiesFilter}
              onChange={(e) => setModalitiesFilter(e.target.value)}
            >
              <option value="all">All Modalities</option>
              {modalitiesWithRegions.map((item) => (
                <option key={item.modality.id} value={item.modality.name}>
                  {item.modality.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-2 mb-2">
            <select
              className="form-select"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="all">All Regions</option>
              {modalitiesFilter !== "all" &&
                selectedRegions.map((region) => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-2 mb-2">
            <input
              type="date"
              className="form-control"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-2 mb-2">
            <input
              type="date"
              className="form-control"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Report Table or Cards */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-sm">
              <thead className="table-dark text-center align-middle">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Model</th>
                  <th>Modality</th>
                  <th>Anatomy</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {reportsToDisplay.map((report, idx) => (
                  <tr key={report.id}>
                    <td>{idx + 1 + currentPage * itemsPerPage}</td>
                    <td>{report.title}</td>
                    <td>{report.model}</td>
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
                    <p>
                      <strong>#:</strong> {idx + 1 + currentPage * itemsPerPage}
                    </p>
                    <h5 className="card-title">
                      <strong>Title: </strong> {report.title}
                    </h5>
                    <p className="card-text">
                      <strong>User:</strong> {report.user_full_name}
                    </p>
                    <p className="card-text">
                      <strong>Modality:</strong> {report.radiology_modality}
                    </p>
                    <p className="card-text">
                      <strong>Body Region:</strong>{" "}
                      {report.body_anatomical_region}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong>{" "}
                      {new Date(report.report_date).toLocaleDateString()}
                    </p>
                    <div className="d-flex justify-content-end gap-3">
                      <i
                        className="bx bx-show text-primary fs-5"
                        onClick={() => fetchReportDetails(report.id)}
                        title="View"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <ReactPaginate
          pageCount={Math.ceil(filteredReports.length / itemsPerPage)}
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
  );
};

export default AdminReports;
