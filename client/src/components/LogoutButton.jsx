import { useAuthStore } from "../stores/useAuth.store.js";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const {logout} = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/signin");
        } catch (err) {
            throw err;
        }
    }

    return (
        <button onClick={handleLogout} className="text-black text-2xl bg-primary rounded-2xl">
            Logout
        </button>
    );
}

export default Logout;