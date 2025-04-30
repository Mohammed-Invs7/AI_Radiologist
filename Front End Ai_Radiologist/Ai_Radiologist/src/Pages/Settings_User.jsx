import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../Components/NavBar";
import Swal from "sweetalert2";
import InfoModal from "../modals/InfoModal";
import PasswordModal from "../modals/PasswordModal";
import { motion } from "framer-motion";
import "../assets/Styling/Setting_User.css";
import "../assets/Styling/Form_User.css";
import InfoUser from "../Components/infoUser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../modals/InfoModal";
import { passwordSchema } from "../modals/PasswordModal";
import { BASE_URL } from "../config";


const API_SETTING_USER = `${BASE_URL}/auth/user/`;
const API_PASS_CHANGE = `${BASE_URL}/auth/password/change/`;


const Settings_User = () => {
  const { user: authUser, updateUser, token } = useAuth();

  const [user, setUser] = useState({
    profile_image: authUser?.profile_image || null,
  });

  const [previewImage, setPreviewImage] = useState(
    authUser?.profile_image || null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: authUser?.first_name || "",
      last_name: authUser?.last_name || "",
      gender: authUser?.gender || "",
    },
    resolver: yupResolver(schema),
  });

  const { reset: resetPasswordForm } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const openInfoModal = () => {
    reset({
      first_name: authUser?.first_name || "",
      last_name: authUser?.last_name || "",
      gender: authUser?.gender || "",
    });
    setShowInfoModal(true);
  };

  const handleImageChange = (file) => {
    setUser((prev) => ({ ...prev, profile_image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateInfo = async (data) => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("gender", data.gender);
    if (user.profile_image && user.profile_image.name) {
      formData.append("profile_image", user.profile_image);
    }

    try {
      const response = await axios.patch(API_SETTING_USER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedUserData = {
          ...response.data,
          user_type: response.data.user_type === 1 ? "admin" : "user",
        };
        updateUser(updatedUserData);
        setPreviewImage(
          `http://127.0.0.1:8000${updatedUserData.profile_image}`
        );
        setShowInfoModal(false);

        Swal.fire({
          title: "Success",
          text: "✔ Info updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      }
    } catch (error) {
      console.error("Error updating info:", error);
      setMessage("An unexpected error occurred.");
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    const { new_password1, new_password2 } = data;
    setPasswordMessage("");

    try {
      const response = await axios.post(
        `${API_PASS_CHANGE}`,
        { new_password1, new_password2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPasswordMessage("Password changed successfully!");
        resetPasswordForm();
        setTimeout(() => setShowPasswordModal(false), 1500);

        Swal.fire({
          title: "Success",
          text: " Password changed successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Change password error:", error.response);
      const errText =
        error.response?.data?.new_password1?.[0] ||
        error.response?.data?.new_password2?.[0] ||
        error.response?.data?.detail ||
        "An unexpected error occurred.";

      setPasswordMessage(errText);
      Swal.fire({
        title: "Error",
        text: errText,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="page-form-Settings d-flex justify-content-center align-items-center flex-column mt-3">
        <InfoUser />

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <motion.div
          className="table-responsive mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="table table-custom table-bordered">
            <thead>
              <tr>
                <th
                  style={{ background: "#017276", color: "white" }}
                  colSpan="2"
                >
                  Account Information
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="d-flex justify-content-between align-items-center gap">
                  Edit Personal Info
                  <i
                    className="bx bx-edit-alt edit-icon-btn"
                    onClick={openInfoModal}
                  ></i>
                </td>
              </tr>
              <tr>
                <td className="d-flex justify-content-between align-items-center gap">
                  Change Password
                  <i
                    className="bx bx-edit-alt edit-icon-btn"
                    onClick={() => setShowPasswordModal(true)}
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>

      <InfoModal
        show={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onSave={handleSubmit(handleUpdateInfo)}
        loading={loading}
        previewImage={previewImage}
        register={register}
        errors={errors}
        onImageChange={handleImageChange}
      />

      <PasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handleChangePassword}
      />
    </>
  );
};

export default Settings_User;
