import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image1 from "../../assets/Images/spark, sparkle, 28.png";

const visions = [
  {
    iconClass: "bx bx-file",
    color: "text-white",
    text: "Easy Access to Preliminary Evaluation",
    iconBackgroundColor: "linear-gradient(180deg, #EE7C3C 0%, #E05F3E 100%)",
  },
  {
    iconClass: "bx bx-time",
    color: "text-white",
    text: "Cost and Time Reduction",
    iconBackgroundColor: "linear-gradient(180deg, #F7B243 0%, #F38C21 100%)",
  },
  {
    iconClass: "bx bx-user-plus",
    color: "text-white",
    text: "Temporary Relief for Doctors and Patients",
    iconBackgroundColor: "linear-gradient(180deg, #1AA7CB 0%, #0878A8 100%)",
  },
  {
    iconClass: "bx bx-bulb",
    color: "text-white",
    text: "Support for Student Learning",
    iconBackgroundColor: "linear-gradient(180deg, #2D9E90 0%, #217A6F 100%)",
  },
  {
    iconClass: "bx bx-folder",
    color: "text-white",
    text: "Easy Access and Information Storage",
    iconBackgroundColor: "#D40BFD",
  },
];

const OurVision = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Our Vision</h2>

      <div className="d-flex aling-items-center justify-content-center position-relative">
        <img
          className="position-absolute"
          style={{ bottom: "-20%", right: "34%", width: "12%" }}
          src={Image1}
          alt=""
        />
      </div>

      <div
        className="row justify-content-center p-4 rounded-4 shadow gap-4 fw-bold"
        style={{
          background:
            "linear-gradient(90deg, rgba(2, 85, 89, 0.9) 0%, rgb(128, 223, 223) 66%)",
        }}
      >
        {visions.map((item, index) => {
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });

          return (
            <motion.div
              ref={ref}
              key={index}
              className="col-md-2 col-6 mb-3"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                <div style={{ height: "185px" }} className="card-body w-100">
                  <div
                    className="align-items-center d-flex justify-content-center mb-3"
                    style={{
                      width: "35%",
                      height: "30%",
                      borderRadius: "5px",
                      boxShadow: "0px 4px 6px rgba(45, 156, 142, 0.20)",
                      background: item.iconBackgroundColor,
                    }}
                  >
                    <i
                      className={`${item.iconClass} ${item.color}`}
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <p className="d card-text mt-2">{item.text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OurVision;
