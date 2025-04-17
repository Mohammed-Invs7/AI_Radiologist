import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../Components/NavBar';
import Reports_User from '../Components/Reports_User';
import InfoUser from '../Components/infoUser';


const Profile_User = () => {
    //const [searchTerm, setSearchTerm] = useState('');
    
    return (
        <div>
            <NavBar />
            {/* Profile cover */}
            <InfoUser/>

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
            <div className="container-fluid mt-4">
                <Reports_User />
            </div>
        </div>
    );
};

export default Profile_User;
