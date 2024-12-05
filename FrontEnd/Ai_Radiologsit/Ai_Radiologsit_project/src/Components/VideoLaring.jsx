import React from "react";
import Ved1 from '../assets/hero.mp4';
import imgplay from '../assets/pngwing.com.png';

const VideoLaring = () => {
    return (
        <div className="justify-content-center d-flex align-items-center m-4">
            <video
                style={{
                    width: "82.5%",
                    height:"485px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)"
                }}
                autoPlay
                loop
                controls
                poster={imgplay} // صورة الغلاف
            >
                <source src={Ved1} type="video/webm" />
                <source src={Ved1} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoLaring;
