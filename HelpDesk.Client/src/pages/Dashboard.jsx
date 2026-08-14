import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div>
            <h1>TEST 123</h1>

            <h3>Role: {role}</h3>

            <button onClick={() => navigate("/tickets")}>
                Tickets
            </button>

            <button onClick={logout}>
                Logout
            </button>
        </div>

    );
}

export default Dashboard; 