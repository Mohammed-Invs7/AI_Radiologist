import '../../assets/Styling/HowUseIt.css'

const HowUseIt = () => {
  return (
    <div className="steps-wrapper text-center py-5">
      <h2 className="fw-bold text-primary">How Use it</h2>
      <p className="text-muted">
        Get accurate reports with simplified summaries tailored to your needs.
      </p>

      <div className="circle-center"></div>

      <div className="step-box step-1">
        <div className="icon">
          <i className="bx bx-user-plus"></i>
        </div>
        <div>Registering on the Website</div>
      </div>

      <div className="step-box step-2">
        <div className="icon">
          <i className="bx bx-upload"></i>
        </div>
        <div>Upload Your Image</div>
      </div>

      <div className="step-box step-3">
        <div className="icon">
          <i className="bx bx-search-alt-2"></i>
        </div>
        <div>Scan your X-ray.</div>
      </div>

      <div className="step-box step-4">
        <div className="icon">
          <i className="bx bx-printer"></i>
        </div>
        <div>Printing the Report</div>
      </div>

      <div className="arrow arrow-1">↘</div>
      <div className="arrow arrow-2">↘</div>
      <div className="arrow arrow-3">↙</div>
      <div className="arrow arrow-4">↖</div>
    </div>
  );
};

export default HowUseIt;
