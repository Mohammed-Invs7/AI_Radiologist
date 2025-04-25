import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../Components/NavBar";
import Reports_User from "../Components/Reports_User";
import InfoUser from "../Components/infoUser";
import { Link } from "react-router-dom";

const Profile_User = () => {
  //const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <NavBar />
      {/* Profile cover */}
      <InfoUser />
      <div className="container mt-3">
        <div
          className="bg-primary text-white p-3 rounded-top d-flex justify-content-between align-items-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)",
          }}
        >
          <h6 style={{ fontSize: "20px" }} className="mt-2 fw-bold" >Your Radiology Reports</h6>
          <button
            style={{ fontSize: "large" }}
            className="btn-blue btn-add-radiology d-flex align-items-center justify-content-center"
          >
            <Link to={"/Upload"}>Add New Radiology Image</Link>
            <i
              style={{ color: "black", fontSize: "20px" }}
              className="bx bx-plus"
            ></i>
          </button>
        </div>
      </div>

      {/* Search field */}
      {/* <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-sm-8 col-12">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div> */}

      {/* Radiology Reports */}
      <div className="container-fluid">
        <Reports_User />
      </div>
    </div>
  );
};

export default Profile_User;
