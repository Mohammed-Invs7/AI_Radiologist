import React from 'react'

const Footer = ({imge}) =>  {
  return (
      <div>
          
          <div className='justify-content-center d-flex align-items-center m-3' >
              <div className='justify-content-center d-flex align-items-center'  style={{background:"#2C9E84", width:"58px", height:"53px", borderRadius:"40px" }}>
                  <img style={{width:"30px", height:"auto"}} src={imge} alt="" />
              </div>
          </div>
    </div>
  )
}
export default Footer;