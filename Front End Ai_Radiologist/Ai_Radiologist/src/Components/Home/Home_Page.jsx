import RegistrationButton from "../Buttons/RegistrationButton";
import UploadButton from "../Buttons/UploadButton";
import NavBar from "../NavBar/NavBar";

const Home_Page = () => {
    return (
        <div>
            <NavBar/>
            <h1>Welcome to the Radiology AI Application</h1>  
            <RegistrationButton />
            <UploadButton />
        </div>
    );
};

export default Home_Page;