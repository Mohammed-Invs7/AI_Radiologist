import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NavBar from "./NavBar";
import image1 from "../assets/image-upload.png";

const Upload = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedType, setSelectedType] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // لإدارة رابط الصورة

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file)); // إنشاء رابط عرض للصورة
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleCheckImage = () => {
    alert(`Checking the ${selectedType} image: ${fileName}`);
    // هنا يمكنك تنفيذ أي منطق لفحص الصورة مثل إرسالها إلى خادم
  };

  return (
    <div>
      <NavBar />
      <div className="d-flex flex-column align-items-center "
        style={{
          background: "#fff",
          margin: "50px 10%",
          borderRadius: "4px",
          height: "508px"
        }}>
        <div className="mt-5 d-flex flex-column align-items-center">
          <h3>Upload Your Image</h3>
          <p style={{ margin: "0px" }}>Upload X-ray</p>
          <hr style={{
            background: "#000",
            width: "100%",
            margin: "2px 0px 19px"
          }} />
        </div>
        <div className="d-flex flex-column align-items-center text-center"
          style={{
            width: "80%",
            border: "2px dashed #785a5a6b", // إطار بخط متقطع
            padding: "20px", // مسافة داخلية
            borderRadius: "10px", // زاوية مستديرة للإطار
          }} >
          {/* عرض صورة افتراضية أو صورة تم رفعها */}
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ) : (
            <img src={image1} style={{ width: "80px" }} alt="Upload" />
          )}

          {/* العنصر المخفي */}
          <input
            type="file"
            id="actual-btn"
            hidden
            onChange={handleFileChange}
            accept="image/*" // السماح برفع الصور فقط
          />

          {/* زر رفع الملف المخصص */}
          <label
            htmlFor="actual-btn"
            style={{
              background:"#80808038",
              border:"1px double #00a84f",
              color: "black",
              padding: "0.5rem",
              fontFamily: "sans-serif",
              borderRadius: "0.3rem",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Choose File
          </label>

          {/* اسم الملف الذي تم اختياره */}
          <span
            id="file-chosen"
            style={{
              marginLeft: "0.3rem",
            }}
          >
            {fileName}
          </span>

          {/* القائمة المنسدلة */}
          <select
            value={selectedType}
            onChange={handleTypeChange}
            style={{
              padding: "1.5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginTop: "10px",
            }}
          >
            <option value="">Choose the type</option>
            <option value="X-ray">X-ray</option>
            <option value="MRI">MRI</option>
            <option value="CT Scan">CT Scan</option>
          </select>

          {/* زر الفحص */}
          <button
            className=" mt-3"
            onClick={handleCheckImage}
            disabled={!imagePreview || !selectedType} // الزر معطل إذا لم يتم إدخال المدخلات المطلوبة
            style={{
              background:"#00a84f",
              borderRadius: "5px",
            }}
          >
            Check X-ray
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
