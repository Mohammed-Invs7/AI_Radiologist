import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import Image1 from '../assets/noto--x-ray 1.png'

const radiologyData = [
    { id: 1, title: 'Chest X-ray', date: '2024-11-15 17:26:05 GMT-3', image: Image1 },
    { id: 2, title: 'Chest MRI', date: '2024-11-15 17:26:05 GMT-3', image: Image1 },
    { id: 3, title: 'Chest CT-Scan', date: '2024-11-15 17:26:05 GMT-3', image: Image1 }
];

    const RadiologyImages = () => {
        return (
        <div>
            <Container className="mt-1"
                style={{
                    width: '80%'
                }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{
            background: 'linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)',
            color: 'white',
            height: '45px',
            borderRadius: '10px 10px 0px 0px'
            }}>
            <h6 className="m-0">Your Radiology Image</h6>
            <Button
                    style={{
                    height: '28px',
                    background: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                    }}
                    variant="light"
                    className="d-flex align-items-center">
                    Add A New Radiology Image
            </Button>
        </div>

        {/* Radiology List */}
        <Row className="">
            {radiologyData.map((item) => (
            <Col key={item.id} md={12} className="">
                <Card style={{borderRadius:'0px'}} className="p-3 d-flex flex-row align-items-center">
                <img src={item.image} alt={item.title} width={80} height={80} className="me-2" />
                <div className="flex-grow-1">
                            <h6 style={{ fontSize: '14px', fontWeight:'bold'}} className="m-0">{item.title}</h6>
                    <small style={{ fontSize: '10px', fontWeight:'bold'}}className="text-muted">{item.date}</small>
                </div>
                <Button  className="me-2" style={{ background:'#017276', padding: '2px 15px', fontSize: '12px',fontWeight:'bold',border:'none'}}>View</Button>
                        <Button style={{ background: '#E32121', padding: '2px 15px', fontSize: '12px', fontWeight: 'bold', border:'none' }}>Delete</Button>

                </Card>
            </Col>
            ))}
        </Row>

        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3 text-muted">
            <p style={{fontSize:'10px'}}>Showing 1 to {radiologyData.length} of {radiologyData.length} Image</p>
            <div>
            <Button style={{fontSize:'10px'}} variant="link" className="text-muted">Prev</Button>
            <Button style={{fontSize:'10px'}} variant="link" className="text-muted">Next</Button>
            </div>
                </div>
            </Container>
        </div>

        
  );
};

export default RadiologyImages;
