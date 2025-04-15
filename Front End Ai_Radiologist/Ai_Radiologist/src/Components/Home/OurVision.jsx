
const visions = [
  {
    iconClass: "bx bx-file",
    color: "text-danger",
    text: "Easy Access to Preliminary Evaluation",
  },
  {
    iconClass: "bx bx-time",
    color: "text-warning",
    text: "Cost and Time Reduction",
  },
  {
    iconClass: "bx bx-user-plus",
    color: "text-info",
    text: "Temporary Relief for Doctors and Patients",
  },
  {
    iconClass: "bx bx-bulb",
    color: "text-success",
    text: "Support for Student Learning",
  },
  {
    iconClass: "bx bx-folder",
    color: "text-purple",
    text: "Easy Access and Information Storage",
  },
];

const OurVision = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Our Vision</h2>
      <div
        className="row justify-content-center p-4 rounded-4 shadow gap-4 fw-bold"
              style={{
                background: "linear-gradient(90deg, rgba(2, 85, 89, 0.9) 0%, rgb(128, 223, 223) 66%)",

        }}
      >
        {visions.map((item, index) => (
          <div className="col-md-2 col-6 mb-3" key={index}>
            <div className="card text-center h-100 border-0 shadow-sm">
              <div className="card-body">
                <i
                  className={`${item.iconClass} ${item.color}`}
                  style={{ fontSize: "2rem" }}
                ></i>
                <p className="card-text mt-2">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurVision;
