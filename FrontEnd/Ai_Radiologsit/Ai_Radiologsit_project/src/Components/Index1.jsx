import React from 'react'
import { useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container , Button } from 'react-bootstrap';
import './index1.css'
import x_ray_logo from '../assets/x-ray.png'

const Index1 = () => {
    
    const navigate = useNavigate();

  const goToUpload = () => {
    navigate('/Upload'); // التنقل إلى صفحة تسجيل الدخول
  };
    return (
        <div>
        <Container style={{ textAlign:"center" ,alignItems:"center", justifyContent: "center", marginTop: "50px " }}>
            <div style={{ margin: " 0px 25%" }}>
                <div className='index1-h'>
                <h2>Use AI to instantly analyze <br/> X-rays  </h2>               
                <h2 style={{ textAlign: 'center', marginBottom: "50px" }}>and make quick medical decisions from home</h2>
                </div>
                <div>
                    <p className='index1-p'> saving you time and costs without the need to wait in the hospital</p>                </div>
            </div>
            <div className='box-x-ray'>
                <img style={{height:"100px"}} src={x_ray_logo} alt="logo" />
                <p>Drog and drop your imge here</p>
                <Button onClick={goToUpload} className='bn-x-ray'>
                    <span className='bn-x-ray-span'>Interpret Your x-ray</span>
                    </Button>{' '}

            </div>
            
            </Container>
    </div>
    )
}
export default Index1;