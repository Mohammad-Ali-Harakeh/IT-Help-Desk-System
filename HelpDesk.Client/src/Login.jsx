
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://it-help-desk-api-7iqa.onrender.com/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        // Timeout after 30 seconds
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 30000);

        try {
            console.log("Starting login...");
            console.log("API:", `${ API_URL }/Auth/login`);

            const response = await fetch(
                `${ API_URL }/Auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            console.log("Response status:", response.status);

            const text = await response.text();

            console.log("Response body:", text);

            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!response.ok) {
                setError(
                    data.message ||
                    data.title ||
                    `Login failed(${ response.status })`
                );
                return;
            }

            console.log("Login successful:", data);

            if (!data.token) {
                setError("Login succeeded but no token was returned.");
                return;
            }

            // Save login data
            localStorage.setItem("token", data.token);

            if (data.role) {
                localStorage.setItem("role", data.role);
            }

            if (data.user?.id) {
                localStorage.setItem(
                    "userId",
                    data.user.id.toString()
                );
            }

            // Go to dashboard
            navigate("/dashboard");

        } catch (err) {
            clearTimeout(timeout);

            console.error("Login error:", err);

            if (err.name === "AbortError") {
                setError(
                    "The server took too long to respond. Please try again."
                );
            } else {
                setError(
                    `Unable to connect to the API.${ err.message } `
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.backgroundCircleOne}></div>
            <div style={styles.backgroundCircleTwo}></div>

            <div style={styles.loginCard}>

                <div style={styles.logo}>
                    <span style={styles.logoIcon}>IT</span>
                </div>

                <h1 style={styles.title}>
                    IT Help Desk
                </h1>

                <p style={styles.subtitle}>
                    Sign in to manage your support tickets
                </p>

                {error && (
                    <div style={styles.errorBox}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Email Address
                        </label>

                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>
                                ✉
                            </span>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                style={styles.input}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Password
                        </label>

                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>
                                🔒
                            </span>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                style={styles.input}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={
                            loading
                                ? styles.loginButtonDisabled
                                : styles.loginButton
                        }
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinner}>
                                    ⟳
                                </span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <span style={styles.arrow}>
                                    →
                                </span>
                            </>
                        )}
                    </button>

                </form>

                <div style={styles.footer}>
                    <div style={styles.footerLine}></div>

                    <p style={styles.footerText}>
                        IT Help Desk Management System
                    </p>

                    <p style={styles.version}>
                        Secure access to your support portal
                    </p>
                </div>

            </div>
        </div>
    );
}

const styles = {

    page: {
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background:
            "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
        fontFamily:
            "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
        padding: "30px"
    },

    backgroundCircleOne: {
        position: "absolute",
        width: "420px",
        height: "420px",
        borderRadius: "50%",
        background:
            "rgba(37, 99, 235, 0.08)",
        top: "-180px",
        right: "-120px"
    },

    backgroundCircleTwo: {
        position: "absolute",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background:
            "rgba(79, 70, 229, 0.07)",
        bottom: "-160px",
        left: "-120px"
    },

    loginCard: {
        width: "100%",
        maxWidth: "430px",
        backgroundColor: "#ffffff",
        padding: "42px",
        borderRadius: "20px",
        boxShadow:
            "0 20px 50px rgba(15, 23, 42, 0.12)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box"
    },

    logo: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "18px"
    },

    logoIcon: {
        width: "64px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "1px",
        boxShadow:
            "0 10px 25px rgba(37, 99, 235, 0.25)"
    },

    title: {
        textAlign: "center",
        margin: "0",
        color: "#0f172a",
        fontSize: "30px",
        fontWeight: "700"
    },

    subtitle: {
        textAlign: "center",
        margin: "10px 0 30px",
        color: "#64748b",
        fontSize: "14px",
        lineHeight: "1.6"
    },

    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "12px 14px",
        marginBottom: "20px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "9px",
        color: "#b91c1c",
        fontSize: "13px",
        lineHeight: "1.5"
    },

    field: {
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        color: "#334155",
        fontSize: "13px",
        fontWeight: "600"
    },

    inputWrapper: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        backgroundColor: "#f8fafc"
    },

    inputIcon: {
        paddingLeft: "14px",
        fontSize: "16px",
        color: "#64748b"
    },

    input: {
        width: "100%",
        padding: "13px 14px 13px 10px",
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        color: "#0f172a",
        fontSize: "14px",
        boxSizing: "border-box"
    },

    loginButton: {
        width: "100%",
        padding: "14px",
        marginTop: "5px",
        border: "none",
        borderRadius: "10px",
        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow:
            "0 8px 20px rgba(37, 99, 235, 0.25)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px"
    },

    loginButtonDisabled: {
        width: "100%",
        padding: "14px",
        marginTop: "5px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "#94a3b8",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "not-allowed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px"
    },

    arrow: {
        fontSize: "18px"
    },

    spinner: {
        fontSize: "18px"
    },

    footer: {
        marginTop: "30px",
        textAlign: "center"
    },

    footerLine: {
        height: "1px",
        backgroundColor: "#e2e8f0",
        marginBottom: "18px"
    },

    footerText: {
        margin: "0",
        color: "#475569",
        fontSize: "12px",
        fontWeight: "600"
    },

    version: {
        margin: "6px 0 0",
        color: "#94a3b8",
        fontSize: "11px"
    }
};

export default Login;

