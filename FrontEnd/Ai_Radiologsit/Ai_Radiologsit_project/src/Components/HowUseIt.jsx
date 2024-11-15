import React from 'react'
import { Card } from 'react-bootstrap'
import Image2 from '../assets/Vector 1.png'
import Image3 from '../assets/Vector 2.png'
import Image4 from '../assets/Vector 3.png'
import Image5 from '../assets/healthicons_xray-outline.png'

export default function Index3( ) {
    return (
    <div>
        <div className='m-5 text-center ' >
                <h4 style={{ fontWeight: "700" ,fontSize:"64px" ,color: '#2C9E84'}}>How Use it</h4>
                <p style={{color: 'rgba(0, 0, 0, 0.31)'}}>Get expertly crafted reports with layman-friendly summaries<br></br>
                        and personalized follow-up explanations.</p>
        </div>
        <div className="justify-content-center d-flex align-items-center">
            <Card className="justify-content-center d-flex align-items-center flex-column
            " style={{ width: '165px', height:'185px', padding:"0px" ,boxShadow: "0px 20px 207px 10px rgb(116, 191 ,174)" }}>
            <Card.Img style={{width:'86px', height:'auto', boxShadow:"4px 6px 10px rgba(0 , 0 , 0 ,0.7) ", borderRadius:"47px"}} src={Image5} />
            <Card.Body className='text-center' style={{width:"100%"}}>
                <Card.Title style={{fontSize:'15px', fontWeight:'bold'}}>Registering on the Website</Card.Title>
                <Card.Text style={{fontSize:"14px"}}>
                    Quickly upload your image
                    through our secure platform
                </Card.Text>
                    </Card.Body>
                <img style={{ width:"54%", top: "77px",position: "absolute",left: "170px"}} src={Image2} alt="" />

                </Card>   
                
            </div>  
        <Card className="justify-content-center d-flex align-items-center flex-column
            " style={{ width: '165px', height:'185px', padding:"0px", position:"relative" , left:"63%", marginTop:"6px" ,boxShadow: "0px 20px 207px 10px rgb(116, 191 ,174)"}}>
<Card.Img style={{width:'86px', height:'auto', boxShadow:"4px 6px 10px rgba(0 , 0 , 0 ,0.7) ", borderRadius:"47px"}} src={Image5} />            <Card.Body className='text-center' style={{width:"100%"}}>
                <Card.Title style={{fontSize:'15px', fontWeight:'bold'}}>Uploading an Image</Card.Title>
                <Card.Text style={{fontSize:"14px"}}>
                    Quickly upload your image
                    through our secure platform
                </Card.Text>
                    </Card.Body>
                <img style={{ width:"54%", top: "116%",position: "absolute",right: "75px"}} src={Image3} alt="" />

            </Card>  
            <Card className="justify-content-center d-flex align-items-center flex-column
            " style={{ width: '165px', height:'185px', padding:"0px", position:"absolute", left:"43%" ,boxShadow: "0px 20px 207px 10px rgb(116, 191 ,174)"}}>
<Card.Img style={{width:'86px', height:'auto', boxShadow:"4px 6px 10px rgba(0 , 0 , 0 ,0.7) ", borderRadius:"47px"}} src={Image5} />            <Card.Body className='text-center' style={{width:"100%"}}>
                <Card.Title style={{fontSize:'15px', fontWeight:'bold'}}>Saving the Image</Card.Title>
                <Card.Text style={{fontSize:"14px"}}> 
                    Quickly upload your image
                    through our secure platform
                </Card.Text >
                    </Card.Body>
                <img style={{top: "30px",position: "absolute",right: "105%", width:"54%"}} src={Image4} alt="" />

            </Card> 
            <Card className="justify-content-center d-flex align-items-center flex-column
            " style={{ width: '165px', height:'185px', padding:"0px" ,position: "relative",bottom: "186px" ,left: "187px" ,boxShadow: "0px 20px 207px 10px rgb(116, 191 ,174)" }}>
            <Card.Img style={{width:'86px', height:'auto', boxShadow:"4px 6px 10px rgba(0 , 0 , 0 ,0.7) ", borderRadius:"47px"}} src={Image5} />
            <Card.Body className='text-center' style={{width:"100%"}}>
                <Card.Title style={{fontSize:'15px', fontWeight:'bold'}}>Printing the Image</Card.Title>
                <Card.Text style={{fontSize:"14px"}}>
                    Quickly upload your image
                    through our secure platform
                </Card.Text>
                    </Card.Body>

            </Card>   
    </div>
    )
}
