import Admin_Sidebar from "../../Components/Admin/Admin_Sidebar";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminPanel = () => {
    return (
        <div className="container-fluid p-0">
            <AdminNavbar />

            <div className="row w-100 bg-white m-0">
                <div className="col-12 col-md-2 bg-white">
                    <Admin_Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
