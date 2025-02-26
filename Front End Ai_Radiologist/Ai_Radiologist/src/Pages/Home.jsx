import RegistrationButton from "../Components/RegistrationButton";
import UploadButton from "../Components/UploadButton";
import NavBar from "../Components/NavBar";

const Home = () => {
    return (
        <div>
            <NavBar/>
            <h1>Welcome to the Radiology AI Application</h1>  
            <RegistrationButton />
            <UploadButton />
        </div>
    );
};

export default Home;