import React from 'react'
import { Card , Container } from 'react-bootstrap'

const OurTema=( {imga, name})=>{

    return (
    <Container >
    <div className='mt-1 text-center' >
    
        <Card className='p-0 align-items-center ' style={{ width: '150px' }}>
            <div >
                <Card.Img style={{ width: "80%", filter: "drop-shadow(5px 5px 5px #222)" }} src={imga} />
            </div>
    <Card.Body>
        <Card.Title>{name}</Card.Title>

    </Card.Body>
    </Card>

        </div>
    </Container>
)
}
export default OurTema;