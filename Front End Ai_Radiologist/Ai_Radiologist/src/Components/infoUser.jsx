import{motion} from 'framer-motion'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState , useEffect } from 'react';

 
const InfoUser = () => {

    const [user, setUser] = useState({ name: null, profilePic: null });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='box-user d-flex align-items-center justify-content-center gap-5 mt-3'
        >
            <motion.div
                className='img-user'
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={user.profile_image}
                    alt="User Profile"
                    className="rounded-circle"
                    style={{ width: '140px', height: '140px' }}
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h4>{user.first_name} {user.last_name}</h4>
                <p className='mb-1'>Email: {user.email}</p>
                <p className='mb-1'>Age: {user.age}</p>
                <p className='mb-1'>Gender: {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : user.gender}</p>
            </motion.div>
        </motion.div>
    )
};
export default InfoUser; 
