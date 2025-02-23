import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar/NavBar';
import Reports from './Reports';

const Profile_Page = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState({ username: null, profilePic: null });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div>
            <NavBar />
            {/* Profile cover */}
            <div style={{height:"155px"}} className="container mt-3 p-5 bg-light rounded shadow-sm">
                <div className="row">
                    <div className="col-md-12 position-relative">
                        {/* User profile picture and name */}
                        <div className="d-flex align-items-center position-absolute" style={{transform: 'translateY(70%)'}}>
                            <div className="d-flex justify-content-center align-items-center rounded-circle border border-dark bg-white shadow"
                                style={{ width: '100px', height: '100px' }}>
                                <img src={user.profilePic} alt="User Profile"
                                    className="rounded-circle" style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                            </div>
                            <h5 className='ms-3 mt-2 text-dark'>{user.username}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search field */}
            <div className="container mt-5">
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
            </div>

            {/* Radiology Reports */}
            <div className="container-fluid mt-4">
                <Reports />
            </div>
        </div>
    );
};

export default Profile_Page;
