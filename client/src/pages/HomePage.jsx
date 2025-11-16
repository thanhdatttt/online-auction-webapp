import Logout from '../components/LogoutButton.jsx';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <a onClick={navigate("/profile")}>
                Profile
            </a>
            <Logout></Logout>
        </div>
    );
}

export default HomePage;