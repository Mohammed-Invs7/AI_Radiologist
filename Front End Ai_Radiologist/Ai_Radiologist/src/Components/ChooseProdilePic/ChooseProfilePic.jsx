import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Registration/Login/Login.css";
import Image1 from "../../assets/Vectorprofile.png";

const API_URL = "http://localhost:5000/upload-profile";  // ✅ API لتخزين الصورة
const DEFAULT_PROFILE_PIC =Image1 // ✅ الصورة الافتراضية

const ChooseProfilePic = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null); // ✅ تخزين الصورة
    const [preview, setPreview] = useState(null); // ✅ رابط المعاينة
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fileInputRef = useRef(null);  // ✅ ref لفتح نافذة اختيار الملف عند الضغط على الزر

    const username = localStorage.getItem("username") || "Guest";
    // ✅ التعامل مع تغيير الصورة
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // ✅ إنشاء رابط معاينة
        }
    };

    // ✅ إرسال الصورة إلى السيرفر
    const handleUpload = async () => {
        if (!file) {
            setMessage("❌ الرجاء اختيار صورة قبل الإرسال!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("profilePic", file); // ✅ إضافة الصورة إلى `FormData`

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            localStorage.setItem("userProfilePic", response.data.profilePicUrl); // ✅ حفظ الصورة الجديدة
            navigate("/dashboard"); // ✅ التوجيه إلى الصفحة الرئيسية
        } catch (error) {
            setMessage("Error");
            console.error(" Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ المستخدم اختار تخطي (Skip)
    const handleSkip = () => {
        localStorage.setItem("userProfilePic", DEFAULT_PROFILE_PIC); // ✅ حفظ الصورة الافتراضية
        navigate("/dashboard"); // ✅ التوجيه إلى الصفحة الرئيسية
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* قسم السلايدر */}
                <div className="col-md-4 d-flex justify-content-center align-items-center p-0 m-0">
                    <div className="sidebar text-center">
                        <h2>AI Radiologist</h2>
                        <p className="fs-5 mt-3">
                            At Your Service For <br /> Better Health
                        </p>
                        {/* يمكنك إضافة السلايدر هنا */}
                    </div>
                </div>

                {/* قسم باقي المحتوى */}
                <div className="col-md-8 d-flex justify-content-center ">
                    <div className="container text-center flex-column d-flex align-items-center justify-content-center p-0">
                        <h2 className="mb-5">Welcome {username}</h2>

                        {/* عرض الصورة المختارة أو الافتراضية */}
                        <div className="d-flex justify-content-center align-items-center" style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", background: "#E7E7FF" }}>
                        <img 
                            src={preview || DEFAULT_PROFILE_PIC}
                            alt="Profile Preview"
                            className="img-fluid "  // تكيف مع جميع أحجام الشاشات
                            style={{ objectFit: "cover" , width:"85%" }}  // تضمن تغطية الصورة للحاوية بالكامل
                        />
                        </div>

                        <div style={{gap:"200px"}} className="d-flex justify-content-center align-items-center  mt-5 ">
                            {/* زر اختيار الصورة */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="btn btn-secondary px-3 rounded-4 "
                                style={{ minWidth: "200px", background: "linear-gradient(90deg, #017276 0%, #80DFDF 100%)" }}  // تضمن حجم الزر
                            >
                                Choose Image
                            </button>

                            {/* إخفاء input type="file" */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: "none" }} // إخفاء العنصر
                                
                            />

                            {/* زر تخطي الصورة */}
                            <button
                                onClick={handleSkip}
                                className="btn btn-secondary px-5 rounded-4"
                                style={{ minWidth: "200px", background:"linear-gradient(90deg, #017276 0%, #80DFDF 100%)" }}  // تضمن حجم الزر
                            >
                                    
                                
                                Skip
                            </button>
                        </div>

                        <div>
                        {/* عرض زر الحفظ فقط بعد اختيار صورة */}
                        {file && (
                            <button
                                onClick={handleUpload}
                                className="btn mt-4 rounded-4"
                                disabled={loading}
                                    style={{
                                        minWidth: "200px",
                                        background: "#017276"  // تضمن حجم الزر
                                    }}    
                            >
                                {loading ? "Seving" : "Seve Image"}
                            </button>
                        )}
                        </div>
                        {/* عرض الرسالة بعد الحفظ أو التخطي */}
                        {message && <p className="mt-3 d-none">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseProfilePic;
