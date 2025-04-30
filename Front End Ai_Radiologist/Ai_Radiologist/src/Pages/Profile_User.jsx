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
          className="p-3 rounded-top d-flex flex-wrap justify-content-between align-items-center gap-2"
          style={{
            background:
              "linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)",
          }}
        >
          <h6
            className="fw-bold text-white m-0"
            style={{ fontSize: "1.25rem" }}
          >
            Your Radiology Reports
          </h6>

          <Link
            to="/Upload"
            className="btn btn-light d-flex align-items-center gap-2 px-3 py-2"
          >
            <span className="fw-semibold">Add New Radiology Image</span>
            <i
              className="bx bx-plus"
              style={{ fontSize: "1.25rem", color: "black" }}
            ></i>
          </Link>
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
