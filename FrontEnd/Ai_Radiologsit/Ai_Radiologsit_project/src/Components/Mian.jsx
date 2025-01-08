import React from 'react'
import NavBar from './NavBar'
import Index1 from './Index1'
import OueGoles from './OueGoles'
import Image1  from '../assets/radiology.png'
import Image2 from '../assets/heart-rate.png'
import Image3 from '../assets/medical-report.png'
import Image4 from '../assets/medical--re.png'
import VideoLaring from './VideoLaring'
import HowUseIt from './HowUseIt'
import OurTema from './OurTema'
import Image5  from '../assets/healthicons_xray-outline.png'
import Footer from './Footer'
import image6 from '../assets/VectorInsta.png'
import image7 from '../assets/VectorEmail.png'
import image8 from '../assets/VectorWhts.png'




export default function Mian() {
    return (
        <div>
            <NavBar />
            <Index1 />
            <VideoLaring />
            <div className='m-3 text-center ' >
                <h4 style={{ fontWeight: "700" ,fontSize:"30px" ,color: '#000'}}>Our Goals</h4>
            </div>
            <div className="justify-content-center d-flex align-items-center mt-4
                " style={{
                    backgroundColor: "rgb(44 158 132)", height: "220px"
                    , borderRadius: "10px", boxShadow: "2px 3px 2px 3px rgba(0, 0, 0, 0.466)"
                }}>
                <OueGoles text={"Gain peace of mind with relables secored opnions from our AI-drives insights"} imeg={Image1} />
                <OueGoles text={"Gain peace of mind with relables secored opnions from our AI-drives insights"} imeg={Image2} />
                <OueGoles text={"Gain peace of mind with relables secored opnions from our AI-drives insights"} imeg={Image3} />
                <OueGoles text={"Gain peace of mind with relables secored opnions from our AI-drives insights"} imeg={Image4} />

            </div>
            <HowUseIt />
            <div className='mt-5 text-center ' >
                <h4 style={{ fontWeight: "700" ,fontSize:"30px" ,color: '#000'}}>Our Team</h4>
            </div>
            <div className="justify-content-center d-flex align-items-center mt-4
                " style={{
                    backgroundColor: "rgb(44 158 132)", height: "220px"
                    , borderRadius: "10px", boxShadow: "2px 3px 2px 3px rgba(0, 0, 0, 0.466)"
                }} >
                <OurTema name="Ali" imga={Image5}/>
                <OurTema name="Ali" imga={Image5} />
                <OurTema name="Ali" imga={Image5} />
                <OurTema name="Ali" imga={Image5} />
                <OurTema name="Ali" imga={Image5} />
            </div>
            
            <div className='mt-5' style={{ width: '100%', height: '100%', textAlign: 'center', color: '#2C9E84', fontSize: 32, fontFamily: 'Almarai', fontWeight: '700', wordWrap: 'break-word' }}>Innovative Accuracy For a better Healthcare </div>
          <div style={{ width: '100%', height: '100%', textAlign: 'center', color: 'black', fontSize: 32, fontFamily: 'Almarai', fontWeight: '400', wordWrap: 'break-word' }}>conted</div>
            <div className='justify-content-center d-flex align-items-center'>
                <Footer imge={image6} />
                <Footer imge={image7} />
                <Footer imge={image8} />

            </div>
        </div>
    )
}
