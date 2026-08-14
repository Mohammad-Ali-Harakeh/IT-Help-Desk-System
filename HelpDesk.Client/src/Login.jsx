import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

       console.log("Button clicked");

const response = await fetch("https://localhost:7069/api/Auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
});

        console.log(response.status);

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            navigate("/dashboard");;
        }
        else {
            alert("Login failed");
        }
    };
    


    return (
        <div>
            <h2> TEST Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <br />

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;

