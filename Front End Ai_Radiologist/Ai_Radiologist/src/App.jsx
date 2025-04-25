import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
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
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AdminDashboard from "./Pages/pages-Admin/AdminDashboard";
import UsersAdmin from "./Pages/pages-Admin/UsersAdmin";
import ReportsAdmin from "./Pages/pages-Admin/ReportsAdmin";

//Css//
import "./App.css";
import AdminPanel from "./Components/Admin/AdminPanel";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
              <Route path="UsersAdmin" element={<UsersAdmin />} />
              <Route path="ReportsAdmin" element={<ReportsAdmin />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
