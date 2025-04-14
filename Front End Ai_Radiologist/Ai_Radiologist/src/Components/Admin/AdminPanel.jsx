import Admin_Sidebar from "../../Components/Admin/Admin_Sidebar";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import { Outlet } from "react-router-dom";
const AdminPanel= () => {
        return (
        <div className="container-fluid p-0">
            <div className="">
                <AdminNavbar/>
            </div>
            <div className="row w-100 bg-white m-0 ">
                <div className=" col-md-3 bg-white">
                    <Admin_Sidebar/>
                </div>
                    
                    <div className="col-md-9">
                    <Outlet />
                        
                </div>    
                
            </div>
        </div>     
    );
};
export default AdminPanel;