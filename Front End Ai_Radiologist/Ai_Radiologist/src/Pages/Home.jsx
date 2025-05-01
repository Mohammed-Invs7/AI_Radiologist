import HowUseIt from "../Components/Home/HowUseIt";
import OurVision from "../Components/Home/OurVision";
import Panel from "../Components/Home/Panel";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Home/Footer";

const Home = () => {
  return (
    <div>
      <NavBar />
      <Panel />
      <OurVision />
      <HowUseIt />
      <Footer/>
    </div>
  );
};

export default Home;
