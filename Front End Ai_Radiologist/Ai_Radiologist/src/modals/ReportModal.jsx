import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

const ReportModal = ({ selectedReport, onClose }) => {
  const { user } = useAuth();

  const location = useLocation();
  const pathname = location.pathname;

  const getImageBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = () => reject("Could not load image");
      img.src = url;
    });

  const addMultilineText = (pdf, text, x, y, maxWidth) => {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const lineHeight = 8;
    const bottomMargin = 20;
    const lines = pdf.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      if (y + lineHeight > pageHeight - bottomMargin) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, x, y);
      y += lineHeight;
    }
    return y;
  };

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 102);
    pdf.text(selectedReport.title || "Radiology Report", pageWidth / 2, 15, {
      align: "center",
    });
    pdf.setDrawColor(0, 51, 102);
    pdf.line(15, 20, pageWidth - 15, 20);

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    let cursorY = 30;

    [
      `Name: ${
        location.pathname.includes("/AdminPanel/Reports%20Admin")
          ? selectedReport?.user_full_name || ""
          : `${user?.first_name || ""} ${user?.last_name || ""}`
      }, 
      Date: ${new Date(selectedReport.report_date).toLocaleDateString()}`,
      `Modality: ${selectedReport.radiology_modality}`,
      `Body Region: ${selectedReport.body_anatomical_region}`,
    ].forEach((line) => {
      pdf.text(line, 15, cursorY);
      cursorY += 8;
    });

    cursorY += 5;

    if (selectedReport.image_path) {
      try {
        const imgData = await getImageBase64(selectedReport.image_path);
        const imgWidth = 80;
        const imgHeight = 60;

        if (cursorY + imgHeight > pageHeight - 20) {
          pdf.addPage();
          cursorY = 20;
        }

        pdf.addImage(
          imgData,
          "JPEG",
          (pageWidth - imgWidth) / 2,
          cursorY,
          imgWidth,
          imgHeight
        );
        cursorY += imgHeight + 10;
      } catch {}
    }

    const addSection = (title, text, color = [23, 162, 184]) => {
      if (cursorY + 10 > pageHeight - 20) {
        pdf.addPage();
        cursorY = 20;
      }
      pdf.setFontSize(14);
      pdf.setTextColor(...color);
      pdf.setFont(undefined, "bold");
      pdf.text(title, 15, cursorY);
      cursorY += 8;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, "normal");
      cursorY = addMultilineText(pdf, text, 15, cursorY, pageWidth - 30);
      cursorY += 10;
    };

    addSection(
      "Technical Description",
      "A chest X-ray was performed using a standard X-ray machine. The chest was imaged in both anterior and posterior positions."
    );

    addSection(
      "Results",
      selectedReport.report_details || "No details available",
      [255, 0, 0]
    );

    addSection(
      "Clinical Interpretation",
      "The model demonstrates low accuracy in detecting minor changes. Results are preliminary and must be confirmed."
    );

    if (cursorY + 30 > pageHeight - 20) {
      pdf.addPage();
      cursorY = 20;
    }
    pdf.setFontSize(14);
    pdf.setTextColor(...[23, 162, 184]);
    pdf.setFont(undefined, "bold");
    pdf.text("Recommendations", 15, cursorY);
    cursorY += 8;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");

    [
      "Further tests are advised.",
      "Follow-up with a physician is needed.",
    ].forEach((rec, i) => {
      if (cursorY + 8 > pageHeight - 20) {
        pdf.addPage();
        cursorY = 20;
      }
      pdf.text(`${i + 1}. ${rec}`, 20, cursorY);
      cursorY += 8;
    });

    cursorY += 10;

    addSection(
      "Confidence Level",
      "Approximate confidence is 70% based on AI performance."
    );

    if (cursorY + 30 > pageHeight - 20) {
      pdf.addPage();
      cursorY = 20;
    }
    pdf.setFontSize(14);
    pdf.setTextColor(...[23, 162, 184]);
    pdf.setFont(undefined, "bold");
    pdf.text("Additional Notes", 15, cursorY);
    cursorY += 8;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");

    ["AI model still under development.", "Human evaluation required."].forEach(
      (note) => {
        if (cursorY + 8 > pageHeight - 20) {
          pdf.addPage();
          cursorY = 20;
        }
        pdf.text(`- ${note}`, 20, cursorY);
        cursorY += 8;
      }
    );

    pdf.save(`${selectedReport.title || "report"}.pdf`);
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

              <p>
                <strong>Name:</strong>{" "}
                {pathname.includes("/AdminPanel/Reports%20Admin")
                  ? selectedReport?.user_full_name || ""
                  : `${user?.first_name || ""} ${user?.last_name || ""}`}
              </p>

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
                A chest X-ray was performed using a standard X-ray machine. The
                chest was imaged in both anterior and posterior positions.
              </p>

              <h5 style={{ color: "red" }} className="mt-4">
                Results
              </h5>
              <p>{selectedReport.report_details || "No details available"}</p>

              <h5 className="text-info mt-4">Clinical Interpretation</h5>
              <p>
                The model demonstrates low accuracy in detecting minor changes.
                Results are preliminary and must be confirmed.
              </p>

              <h5 className="text-info mt-4">Recommendations</h5>
              <ol>
                <li>Further tests are advised.</li>
                <li>Follow-up with a physician is needed.</li>
              </ol>

              <h5 className="text-info mt-4">Confidence Level</h5>
              <p>Approximate confidence is 70% based on AI performance.</p>

              <h5 className="text-info mt-4">Additional Notes</h5>
              <ul>
                <li>AI model still under development.</li>
                <li>Human evaluation required.</li>
              </ul>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={handleDownloadPDF}
            >
              Download as PDF
            </button>
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
