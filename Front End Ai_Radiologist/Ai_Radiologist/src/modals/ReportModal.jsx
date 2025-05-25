import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import axios from "axios";

const API_REPOROTS = `${BASE_URL}/user/reports/`;

const ReportModal = ({ selectedReport, onClose }) => {
  const { user, token } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const handleDownloadPDF = async () => {
    if (!selectedReport?.id) {
      toast.error("No report available to download.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_REPOROTS}${selectedReport.id}/pdf/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Medical_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download report.");
    }
  };

  return (
    <motion.div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="modal-dialog">
        <div className="modal-content rounded shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Report Details</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body w-100">
            <div className="d-flex justify-content-center mb-3">
              <img
                src={selectedReport.image_path}
                alt="Report"
                className="img-fluid rounded border shadow-sm"
                style={{ maxWidth: "50%", maxHeight: "400px" }}
              />
            </div>
            <div className="card-body">
              <p>
                <strong>Title:</strong> {selectedReport.title}
              </p>

              {!pathname.includes("/AdminPanel/Reports%20Admin") && (
                <p>
                  <strong>Name:</strong>{" "}
                  {`${user?.first_name || ""} ${user?.last_name || ""}`}
                </p>
              )}
              {!pathname.includes("/profile_User") && (
                <p>
                  <strong>Model:</strong> {selectedReport.model}
                </p>
              )}

              <p>
                <strong>Modality:</strong> {selectedReport.radiology_modality}
              </p>
              <p>
                <strong>Body Region:</strong>{" "}
                {selectedReport.body_anatomical_region}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedReport.report_date).toLocaleDateString()}
              </p>

              <h5 className="text-primary mb-3">Technical Description</h5>
              <p>
                A {selectedReport.body_anatomical_region}{" "}
                {selectedReport.radiology_modality}
                {""} was performed using a standard{" "}
                {selectedReport.radiology_modality} machine.
              </p>

              <h5 style={{ color: "red" }} className="mt-4">
                Results
              </h5>
              {(selectedReport.report_details || "No details available")
                .split("\n")
                .map((line, index) => {
                  const match = line.match(/^([^:]+:)(.*)$/);
                  if (match) {
                    const [, heading, rest] = match;
                    return (
                      <p key={index}>
                        <strong>{heading}</strong>
                        {rest}
                      </p>
                    );
                  } else {
                    return <p key={index}>{line}</p>;
                  }
                })}
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            {location.pathname !== "/AdminPanel/Reports%20Admin" && (
              <button
                onClick={handleDownloadPDF}
                className="btn btn-outline-primary"
              >
                <i className="bi bi-download me-2"></i> Download PDF Report
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportModal;
