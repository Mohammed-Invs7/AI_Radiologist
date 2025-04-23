import HowUseIt from "../Components/Home/HowUseIt";
import OurVision from "../Components/Home/OurVision";
import Panel from "../Components/Home/Panel";
import NavBar from "../Components/NavBar";

const Home = () => {
    return (
        <div>
            <NavBar />
            <Panel />
            <OurVision />
            <HowUseIt/>
        </div>
    );
};

export default Home;