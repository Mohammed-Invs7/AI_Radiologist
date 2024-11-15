import React from "react";
import { DefaultPlayer as Video } from "react-html5video";
import 'react-html5video/dist/styles.css';
import Ved1 from '../assets/hero.mp4';

const videoLaring = () => {
    return ( 
        <div className="justify-content-center d-flex align-items-center m-4">
        <video style={{ width: "88%", borderRadius:"10px", boxShadow:"1px 1px 10px rgba(0, 0, 0, 0.438)" }} autoPlay loop controls={true}    
            
            >
                <source src={Ved1} type="video/webm"/>
            </video>
        </div>
    );
};

export default videoLaring;

