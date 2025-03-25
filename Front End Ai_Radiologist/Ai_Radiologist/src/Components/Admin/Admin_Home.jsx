import AdminNavbar from "./AdminNavbar";
import Admin_Sidebar from "./Admin_Sidebar";

const Admin_Home = () => {
    return (
        <div style={{ background:"#f8f9fa"}} className="container-fluid min-vh-100">
            <div className="row">
                <div style={{width:"20%"}} className="bg-white vh-100">
                    <Admin_Sidebar/>
                </div>
                <div className="col">
                <AdminNavbar/>
                </div>
            </div>
        </div>
    );
}
export default Admin_Home;