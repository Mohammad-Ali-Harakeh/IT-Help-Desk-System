import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Button clicked");

        try {
            const response = await fetch(
                "http://localhost:5237/api/Auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            console.log("Status:", response.status);

            const data = await response.json();

            console.log("Login response:", data);

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                if (data.user && data.user.id) {
                    localStorage.setItem(
                        "userId",
                        data.user.id
                    );
                }

                navigate("/dashboard");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong during login");
        }
    };

    return (
        <div>
            <h2>TEST Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
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