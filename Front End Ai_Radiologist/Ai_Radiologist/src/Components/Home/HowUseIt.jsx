import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../../assets/Styling/HowUseIt.css";
import Image1 from "../../assets/Images/website.png";
import Image2 from "../../assets/Images/image.png";
import Image3 from "../../assets/Images/x-ray-test.png";
import Image4 from "../../assets/Images/radiology (1).png";

const HowUseIt = () => {
  return (
    <div className="ps-timeline-sec">
      <div className="justify-content-center d-flex align-items-center flex-column">
        <div className="text-center">
          <h2 className="text-center mb-4 fw-bold">How Use it</h2>
          <p style={{ color: "rgba(0, 0, 0, 0.31)" }}>
            Get accurate reports with simplified summaries tailored to your
            needs.
          </p>
        </div>

        <div className="container">
          <ol className="ps-timeline">
            {[
              {
                img: Image1,
                title: "Create Your Account",
                description:
                  "Easily register to access personalized radiology services",
                step: "01",
                direction: "top",
              },
              {
                img: Image2,
                title: "Upload Your Radiology Image",
                description:
                  "Securely upload your X-ray or medical imaging file for analysis",
                step: "02",
                direction: "bottom",
              },
              {
                img: Image3,
                title: "AI-Powered Image Analysis",
                description:
                  "Let our advanced AI scan and interpret your radiology image with precision.",
                step: "03",
                direction: "top",
              },
              {
                img: Image4,
                title: "Generate and Print Your Report",
                description:
                  "Receive a detailed report with key insights—ready to view, download, or print.",
                step: "04",
                direction: "bottom",
              },
            ].map((item, index) => {
              const { ref, inView } = useInView({
                triggerOnce: true,
                threshold: 0.1,
              });

              return (
                <motion.li
                  ref={ref}
                  key={index}
                  initial={{
                    opacity: 0,
                    y: item.direction === "top" ? 50 : -50,
                  }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div
                    className={
                      item.direction === "top"
                        ? "img-handler-top"
                        : "img-handler-bot"
                    }
                  >
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div
                    className={item.direction === "top" ? "ps-bot" : "ps-top"}
                  >
                    <strong>{item.title}</strong> {item.description}
                  </div>
                  <span
                    className={
                      item.direction === "top" ? "ps-sp-top" : "ps-sp-bot"
                    }
                  >
                    {item.step}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HowUseIt;
