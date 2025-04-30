import Image1 from "../../assets/Images/background.png"
import Image2 from "../../assets/Images/spark,background.png"
import "../../assets/Styling/panel.css"


import UploadButton from "../UploadButton"

const Panel = () => {
    return (
      <div className="panel">
        <div className="container-page d-flex justify-content-between ">
          <div className="title align-items-center d-flex flex-column text-center justify-content-center">
            <h1 className="mb-2">
              Use AI To Instantly Analyze
              <br />
              Radiology Image
              <br />
              And Make Quick Medical
              <br />
              Decisions From Home
            </h1>
            <p>
              Saving you time and costs without the need to wait in the
              hospital.
            </p>
            <div>
              <UploadButton />
            </div>
          </div>
          <div className="container-img">
            <img id="Image2" src={Image2} alt="" />
            <img id="Image1" src={Image1} alt="" />
          </div>
        </div>
      </div>
    );
}
export default Panel;