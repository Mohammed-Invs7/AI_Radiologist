import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RadiologyImages = () => {
    const [radiologyData, setRadiologyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.example.com/radiology-images'); // استبدل هذا بالرابط الصحيح للـ API
                setRadiologyData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-3" >
            <div className="bg-primary text-white p-3 rounded-top d-flex justify-content-between"
            style={{background: 'linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)'}}>
                <h6>Your Radiology Images</h6>
                <button className="btn btn-light btn-sm">Add New Radiology Image</button>
            </div>

            {loading ? (
                <p className="text-center mt-4">Loading...</p>
            ) : error ? (
                <p className="text-center mt-4 text-danger">Error: {error}</p>
            ) : radiologyData.length > 0 ? (
                radiologyData.map((item) => (
                    <div key={item.id} className="card p-2 my-2 d-flex flex-row align-items-center">
                        <img src={item.image} alt={item.title} width={80} height={80} className="me-3" />
                        <div className="flex-grow-1">
                            <h6 className="m-0">{item.title}</h6>
                            <small className="text-muted">{item.date}</small>
                        </div>
                        <button className="btn btn-success btn-sm me-1">View</button>
                        <button className="btn btn-danger btn-sm">Delete</button>
                    </div>
                ))
            ) : (
                <p className="text-center mt-3">No radiology images available.</p>
            )}

            <div className="d-flex justify-content-between text-muted small">
                <p>Showing {radiologyData.length} of {radiologyData.length} Images</p>
                <div>
                    <button className="btn btn-link btn-sm px-3">Prev</button>
                    <button className="btn btn-link btn-sm px-3">Next</button>
                </div>
            </div>
        </div>
    );
};

export default RadiologyImages;

// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Ig1 from '../../assets/noto--x-ray 1.png'

// const RadiologyImages = () => {
//     const [radiologyData, setRadiologyData] = useState([
//         { id: 1, title: 'Chest X-ray', date: '2024-11-15', image: Ig1 },
//         { id: 2, title: 'Chest MRI', date: '2024-11-16', image: Ig1 },
//         { id: 3, title: 'Chest CT-Scan', date: '2024-11-17', image: Ig1 }
//     ]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     return (
//         <div className="container mt-3">
//             <div className="bg-primary text-white p-3 rounded-top d-flex justify-content-between"
//             style={{background: 'linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)'}}>

//                 <h6>Your Radiology Images</h6>
//                 <button style={{ background:"#fff"}} className="btn btn-light btn-sm">Add New Radiology Image 
                
//                 </button>
//             </div>

//             {loading ? (
//                 <p className="text-center mt-4">Loading...</p>
//             ) : error ? (
//                 <p className="text-center mt-4 text-danger">Error: {error}</p>
//             ) : radiologyData.length > 0 ? (
//                 radiologyData.map((item) => (
//                     <div key={item.id} className="card p-2 my-2 d-flex flex-row align-items-center">
//                         <img src={item.image} alt={item.title} width={80} height={80} className="me-3" />
//                         <div className="flex-grow-1">
//                             <h6 className="m-0">{item.title}</h6>
//                             <small className="text-muted">{item.date}</small>
//                         </div>
//                         <button className="btn btn-success btn-sm me-1 px-3">View</button>
//                         <button className="btn btn-danger btn-sm px-3">Delete</button>
//                     </div>
//                 ))
//             ) : (
//                 <p className="text-center mt-3">No radiology images available.</p>
//             )}

//             <div className="d-flex justify-content-between text-muted small">
//                 <p>Showing {radiologyData.length} of {radiologyData.length} Images</p>
//                 <div>
//                     <button className="btn btn-link btn-sm">Prev</button>
//                     <button className="btn btn-link btn-sm">Next</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RadiologyImages;
