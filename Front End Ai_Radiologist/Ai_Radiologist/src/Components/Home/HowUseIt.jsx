import "../../assets/Styling/HowUseIt.css";
import Image1 from "../../assets/Images/website.png";
import Image2 from "../../assets/Images/image.png";
import Image3 from "../../assets/Images/x-ray-test.png";
import Image4 from "../../assets/Images/radiology (1).png";


const HowUseIt = () => {
  return (
    
    <div className="ps-timeline-sec">
      <div className="justify-content-center d-flex align-items-center flex-column">
        <div className=" text-center ">
          <h2 className="text-center mb-4 fw-bold">How Use it</h2>
          <p style={{ color: "rgba(0, 0, 0, 0.31)" }}>
            Get accurate reports with simplified summaries tailored to your
            needs.
          </p>
        </div>
        <div className="container ">
          <ol className="ps-timeline">
            <li>
              <div className="img-handler-top">
                <img src={Image1} alt="" />
              </div>
              <div className="ps-bot">
                <strong>Create Your Account</strong> Easily register to access
                personalized radiology services{" "}
              </div>
              <span className="ps-sp-top">01</span>
            </li>

            <li>
              <div className="img-handler-bot">
                <img src={Image2} alt="" />
              </div>
              <div className="ps-top">
                <strong>Upload Your Radiology Image</strong> Securely upload
                your X-ray or medical imaging file for analysis
              </div>
              <span className="ps-sp-bot">02</span>
            </li>

            <li>
              <div className="img-handler-top">
                <img src={Image3} alt="" />
              </div>
              <div className="ps-bot">
                <strong>AI-Powered Image Analysis</strong> Let our advanced AI
                scan and interpret your radiology image with precision.
              </div>
              <span className="ps-sp-top">03</span>
            </li>

            <li>
              <div className="img-handler-bot">
                <img src={Image4} alt="" />
              </div>
              <div className="ps-top">
                <strong>Generate and Print Your Report</strong> Receive a
                detailed report with key insights—ready to view, download, or
                print.
              </div>
              <span className="ps-sp-bot">04</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
export default HowUseIt;
