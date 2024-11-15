import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container , Button } from 'react-bootstrap';
import './index1.css'
import x_ray_logo from '../assets/x-ray.png'

export default function Index1() {
    return (
        <div>
        <Container style={{ textAlign:"center" ,alignItems:"center", justifyContent: "center", marginTop: "50px " }}>
            <div style={{ margin: " 0px 25%" }}>
                <div className='index1-h'>
                <h2>Empower Your Medical Choices </h2>               
                <h2 style={{ textAlign: 'center', marginBottom: "50px" }}>with Instant AI X-ray Insights</h2>
                </div>
                <div>
                    <p className='index1-p'>Save time and money with AI to make quick radiology dicisons at</p>
                    <p className='index1-p'>home without for the doctor in the hospitsl</p>
                </div>
            </div>
            <div className='box-x-ray'>
                <img style={{height:"100px"}} src={x_ray_logo} alt="logo" />
                <p>Drog and drop your imge here</p>
                <Button className='bn-x-ray'>
                    <span className='bn-x-ray-span'>Interpret Your x-ray</span>
                    </Button>{' '}

            </div>
            
            </Container>
    </div>
    )
}
