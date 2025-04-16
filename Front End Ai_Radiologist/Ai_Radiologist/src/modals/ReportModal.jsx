import { motion } from "framer-motion";

const ReportModal = ({ selectedReport, onClose }) => {
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
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Display the image first */}
                        <div className=" d-flex text-center justify-content-center  mb-3">
                            <img
                                src={selectedReport.image_path}
                                alt="Report"
                                className="img-fluid rounded border shadow-sm"
                                style={{ maxWidth: "50%", maxHeight: "400px" }}
                            />
                        </div>

                        <p><strong>Title:</strong> {selectedReport.title}</p>
                        <p><strong>User:</strong> {selectedReport.user_full_name || 'N/A'}</p>
                        <p><strong>Modality:</strong> {selectedReport.radiology_modality}</p>
                        <p><strong>Body Region:</strong> {selectedReport.body_anatomical_region}</p>
                        <p><strong>Date:</strong> {new Date(selectedReport.report_date).toLocaleDateString()}</p>
                        <p><strong>Details:</strong> {selectedReport.report_details || 'No details available'}</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-blue btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportModal;
