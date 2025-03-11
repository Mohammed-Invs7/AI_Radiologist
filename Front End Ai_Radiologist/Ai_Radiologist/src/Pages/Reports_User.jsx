import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

// Define API URL
const API_URL = "http://127.0.0.1:8000/api/v1/user/reports/";

const Reports_User = () => {
    const [radiologyData, setRadiologyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setRadiologyData(response.data); // Update data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-3">
            <div className="bg-primary text-white p-3 rounded-top d-flex justify-content-between"
                style={{ background: 'linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)' }}>
                <h6>Your Radiology Reports</h6>
                <button className="">
                <Link to={"/Upload"} style={{textDecoration:"none", color:'black'}} >Add New Radiology Report</Link> 
                </button>
            </div>

            {/* Loading and Error States */}
            {loading ? (
                <p className="text-center mt-4">Loading...</p>
            ) : error ? (
                <p className="text-center mt-4 text-danger">Error: {error}</p>
            ) : radiologyData.length > 0 ? (
                radiologyData.map((item) => (
                    <div key={item.id} className="card p-2 my-2 d-flex flex-row align-items-center shadow-sm">
                        <img src={item.image_path} alt={item.title} width={80} height={80} className="rounded me-3" />
                        <div className="flex-grow-1">
                            <h6 className="m-0 text-primary">{item.title}</h6>
                            <small className="text-muted"> {new Date(item.report_date).toLocaleDateString()}</small>
                            <br />
                            <small><strong>Modality:</strong> {item.radiology_modality}</small><br />
                            <small><strong>Region:</strong> {item.body_anatomical_region}</small>
                        </div>
                        <div>
                            <button className="btn-success btn-sm me-2"> View</button>
                            <button className="btn-danger btn-sm"> Delete</button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center mt-3 text-muted">No radiology reports available.</p>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-between text-muted small mt-3">
                <p>Showing {radiologyData.length} of {radiologyData.length} Reports</p>
                <div>
                    <button className=" btn-outline-primary btn-sm me-2">⬅ Prev</button>
                    <button className=" btn-outline-primary btn-sm ms-2">Next ➡</button>
                </div>
            </div>
        </div>
    );
};

export default Reports_User;
