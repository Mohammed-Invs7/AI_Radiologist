import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar/NavBar';
import Radiology_Images from './Radiology_Images';

const Profile_Page = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState({ username: null, profilePic: null});

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div>
            <NavBar />
            <div className="container mt-3 p-4" style={{
                background: '#F5F5F5',
                height: '150px',
                borderRadius: '10px',
                position: 'relative'
            }}>
                <div className="d-flex align-items-center position-absolute" style={{ top: '110%', transform: 'translateY(-50%)', left: '5%' }}>
                    <div className="d-flex justify-content-center align-items-center rounded-circle border border-dark" style={{
                        width: '90px',
                        height: '90px',
                        background: '#fff'
                    }}>
                        <img src={user.profilePic} alt="User Profile" style={{ width: '88px', height: '88px', objectFit: 'contain' }} />
                    </div>
                    <h5 className='ms-3 mt-2 text-dark'>{user.username}</h5>
                </div>
            </div>

            {/* Search Input */}
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                <div className="input-group" style={{ width: '400px' }}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
            </div>

            {/* Radiology Images Section */}
            <Radiology_Images/>
        </div>
    );
};

export default Profile_Page;
