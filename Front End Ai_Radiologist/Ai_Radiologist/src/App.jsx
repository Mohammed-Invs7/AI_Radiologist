import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./Pages/Home";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";
import Upload from "./Pages/Upload";
import NavBar from "./Components/NavBar";
import Profile_User from "./Pages/Profile_User";
import Settings_User from "./Pages/Settings_User";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminRoute from "./context/AdminRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AdminDashboard from "./Pages/pages-Admin/AdminDashboard"
import UsersAdmin from "./Pages/pages-Admin/UsersAdmin";
import ReportsAdmin from "./Pages/pages-Admin/ReportsAdmin";
import Models from "./Pages/pages-Admin/ModelsAdmin";
import ModalitiesAdmin from "./Pages/pages-Admin/ModalitiesAdmin";
import AnatomiesAdmin from "./Pages/pages-Admin/AnatomiesAdmin";
import RadiologyDetailsAdmin from "./Pages/pages-Admin/RadiologyDetailsAdmin";
import ErrorPage from "./Pages/ErrorPage";
import VerifyEmail from "./Pages/VerifyEmail"

//Css//
import "./App.css";
import AdminPanel from "./Components/Admin/AdminPanel";
import FilesAdmin from "./Pages/pages-Admin/FilesAdmin";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/our-vision" element={<Home />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/Verify-Email" element={<VerifyEmail/>} />

          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/Upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route path="/NavBar" element={<NavBar />} />
          <Route
            path="/Profile_User"
            element={
              <ProtectedRoute>
                <Profile_User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Settings_User"
            element={
              <ProtectedRoute>
                <Settings_User />
              </ProtectedRoute>
            }
          />
          <Route element={<AdminRoute />}>
            <Route path="/AdminPanel/" element={<AdminPanel />}>
              <Route index element={<AdminDashboard />} />
              <Route path="Users Admin" element={<UsersAdmin />} />
              <Route path="Reports Admin" element={<ReportsAdmin />} />
              <Route path="Models Admin" element={<Models />} />
              <Route path="Files Admin" element={<FilesAdmin />} />
              <Route path="Modalities Admin" element={<ModalitiesAdmin />} />
              <Route path="Anatomies Admin" element={<AnatomiesAdmin />} />

              <Route
                path="RadiologyDetails Admin"
                element={<RadiologyDetailsAdmin />}
              />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
