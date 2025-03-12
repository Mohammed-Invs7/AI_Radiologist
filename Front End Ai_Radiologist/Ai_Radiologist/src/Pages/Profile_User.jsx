import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../Components/NavBar';
import Reports_User from '../Components/Reports_User';

const Profile_User = () => {
    //const [searchTerm, setSearchTerm] = useState('');
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
                    <div className='Container-user d-flex justify-content-center mt-3'>
                        {/* User profile picture and name */}
                        <div className='box-user d-flex align-items-center gap-5'>
                            <div className='img-user'>
                                <img src={user.profile_image} alt="User Profile"
                                className="rounded-circle" style={{ width: '140px', height: '140px'}} />
                            </div>
                            <div>
                                <h4>{user.first_name} {user.last_name}</h4>
                                <p className='mb-1'>Email: {user.email}</p>
                                <p className='mb-1'>Age: {user.age}</p>
                                <p className='mb-1'>Gender: {user.gender}</p>
                            </div>
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
            <div className="container-fluid mt-4">
                <Reports_User />
            </div>
        </div>
    );
};

export default Profile_User;
