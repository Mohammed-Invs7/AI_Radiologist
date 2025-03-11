import Image1 from "../../assets/Images/background.png"
import Image2 from "../../assets/Images/spark,background.png"


import UploadButton from "../UploadButton"

const Section1 = () => {
    return (
        <div className="Section1-page">
            <div style={{background:"#82E0E0"}} className="container-page d-flex justify-content-between ">
                <div style={{marginLeft:"120px"}} className="align-items-center d-flex flex-column text-center justify-content-center">
                    <h1 className="mb-2" style={{fontWeight:"bold"}} >Use AI To Instantly Analyze
                        <br />
                        X-rays
                        <br />
                        And Make Quick Medical
                        <br />
                        Decisions From Home</h1>
                    <p>Saving you time and costs without the need to wait in the hospital.</p>
                    <div >
                    <UploadButton />
                    </div>
                </div>
                <div style={{position:"relative"}}>
                <img style={{position:" absolute" , right:"83%", top:"6%"}} src={Image2} alt="" />
                <img width={"500px"} src={Image1} alt="" />
                </div> 

            </div>
        </div>  
        
    );
}
export default Section1;