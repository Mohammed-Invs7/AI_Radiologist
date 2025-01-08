import React from 'react'

const OurGoles=( {imeg , text})=> {
    return (
    
    <div style={{backgroundColor:"#00a84f;"}}>
        <div className="justify-content-center d-flex align-items-center flex-column
" style={{ width: '200px', backgroundColor:"#00a84f;" }}>
                <div style={{ textAlign: 'center', width:"30%", borderRadius:"25%"}}>
                <img style={{height:'45px', width:"auto",} } src={imeg} />
            </div>
            <div>
                
                <p className='mt-3' style={{fontSize:'10px' , textAlign:'center', width:"50%", margin:"0px 25%",fontWeight:"bold", color:"white" }}>
                    {text}
                </p>
            </div>
        </div>
        
    </div>
    )
}
export default OurGoles;