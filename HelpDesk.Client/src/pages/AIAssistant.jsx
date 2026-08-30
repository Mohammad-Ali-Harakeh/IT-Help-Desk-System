
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AIAssistant() {
    const navigate = useNavigate();

    const API = "http://localhost:5237/api";

    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // ASK AI
    // =========================

    const askAI = async () => {
        if (!message.trim()) {
            setError("Please describe your IT problem first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResponse("");

            const apiResponse = await fetch(
                `${ API } /AI/assistant`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message.trim()
                    })
                }
            );

            let data = {};

            try {
                data = await apiResponse.json();
            } catch {
                data = {};
            }

            if (!apiResponse.ok) {
                throw new Error(
                    data.message ||
                    data.title ||
                    "Failed to get AI response."
                );
            }

            setResponse(
                data.response ||
                "The AI assistant did not return a response."
            );

        } catch (err) {
            console.error("AI Assistant Error:", err);

            setError(
                err.message ||
                "Unable to connect to the AI assistant."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ENTER KEY
    // =========================

    const handleKeyDown = (e) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();
            askAI();
        }
    };

    // =========================
    // EXAMPLE
    // =========================

    const useExample = (text) => {
        setMessage(text);
        setResponse("");
        setError("");
    };

    return (
        <div style={styles.page}>

            {/* =========================
                HEADER
            ========================= */}

            <header style={styles.header}>

                <div style={styles.headerLeft}>

                    <div style={styles.aiLogo}>
                        🤖
                    </div>

                    <div>
                        <p style={styles.eyebrow}>
                            IT SUPPORT
                        </p>

                        <h1 style={styles.title}>
                            AI Assistant
                        </h1>

                        <p style={styles.subtitle}>
                            Get instant troubleshooting assistance
                            for common IT problems.
                        </p>
                    </div>

                </div>

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    style={styles.backButton}
                >
                    ← Dashboard
                </button>

            </header>

            {/* =========================
                MAIN
            ========================= */}

            <main style={styles.main}>

                {/* AI CARD */}

                <section style={styles.mainCard}>

                    <div style={styles.welcomeIcon}>
                        ✨
                    </div>

                    <h2 style={styles.heading}>
                        How can I help you?
                    </h2>

                    <p style={styles.description}>
                        Describe your technical problem below.
                        Our IT assistant will suggest troubleshooting
                        steps to help you solve it.
                    </p>

                    {/* INPUT */}

                    <div style={styles.inputContainer}>

                        <textarea
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setError("");
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Example: My computer is very slow and applications keep freezing..."
                            style={styles.textarea}
                            rows={6}
                            disabled={loading}
                        />

                        <div style={styles.inputFooter}>

                            <span style={styles.inputHint}>
                                Press Enter to send • Shift + Enter for a new line
                            </span>

                            <button
                                onClick={askAI}
                                disabled={loading}
                                style={
                                    loading
                                        ? styles.askButtonDisabled
                                        : styles.askButton
                                }
                            >
                                {loading ? (
                                    <>
                                        <span style={styles.loadingIcon}>
                                            ⟳
                                        </span>
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        🤖 Ask AI
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div style={styles.errorBox}>
                            <span style={styles.errorIcon}>
                                ⚠️
                            </span>

                            <div>
                                <strong>
                                    AI Assistant Error
                                </strong>

                                <p style={styles.errorText}>
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* RESPONSE */}

                    {response && (
                        <div style={styles.responseBox}>

                            <div style={styles.responseHeader}>

                                <div style={styles.responseIcon}>
                                    🤖
                                </div>

                                <div>
                                    <strong style={styles.responseTitle}>
                                        AI Assistant
                                    </strong>

                                    <div style={styles.onlineStatus}>
                                        <span style={styles.onlineDot}></span>
                                        Ready to help
                                    </div>
                                </div>

                            </div>

                            <div style={styles.responseDivider}></div>

                            <p style={styles.responseText}>
                                {response}
                            </p>

                        </div>
                    )}

                </section>

                {/* =========================
                    QUICK HELP
                ========================= */}

                <section style={styles.quickCard}>

                    <div style={styles.quickHeader}>

                        <div>
                            <h3 style={styles.quickTitle}>
                                Quick Help
                            </h3>

                            <p style={styles.quickSubtitle}>
                                Choose a common problem to get started.
                            </p>
                        </div>

                        <span style={styles.sparkle}>
                            💡
                        </span>

                    </div>

                    <div style={styles.examples}>

                        <button
                            style={styles.exampleButton}
                            onClick={() =>
                                useExample(
                                    "My computer is very slow and applications are freezing."
                                )
                            }
                        >
                            <span style={styles.exampleIcon}>
                                💻
                            </span>

                            <span>
                                <strong>
                                    Slow Computer
                                </strong>

                                <small>
                                    Performance problems
                                </small>
                            </span>
                        </button>

                        <button
                            style={styles.exampleButton}
                            onClick={() =>
                                useExample(
                                    "My Wi-Fi is not working and I cannot access the internet."
                                )
                            }
                        >
                            <span style={styles.exampleIcon}>
                                📶
                            </span>

                            <span>
                                <strong>
                                    Network Problem
                                </strong>

                                <small>
                                    Wi-Fi or Internet
                                </small>
                            </span>
                        </button>

                        <button
                            style={styles.exampleButton}
                            onClick={() =>
                                useExample(
                                    "I cannot login to my account."
                                )
                            }
                        >
                            <span style={styles.exampleIcon}>
                                🔐
                            </span>

                            <span>
                                <strong>
                                    Login Problem
                                </strong>

                                <small>
                                    Account access
                                </small>
                            </span>
                        </button>

                        <button
                            style={styles.exampleButton}
                            onClick={() =>
                                useExample(
                                    "My printer is not working."
                                )
                            }
                        >
                            <span style={styles.exampleIcon}>
                                🖨️
                            </span>

                            <span>
                                <strong>
                                    Printer Problem
                                </strong>

                                <small>
                                    Printing issues
                                </small>
                            </span>
                        </button>

                    </div>

                </section>

                {/* =========================
                    INFO
                ========================= */}

                <div style={styles.infoRow}>

                    <div style={styles.infoItem}>
                        <span>⚡</span>
                        <div>
                            <strong>Fast Assistance</strong>
                            <small>Instant troubleshooting suggestions</small>
                        </div>
                    </div>

                    <div style={styles.infoItem}>
                        <span>🛠️</span>
                        <div>
                            <strong>IT Troubleshooting</strong>
                            <small>Solutions for common technical issues</small>
                        </div>
                    </div>

                    <div style={styles.infoItem}>
                        <span>🔒</span>
                        <div>
                            <strong>Support Assistant</strong>
                            <small>Designed for the IT Help Desk</small>
                        </div>
                    </div>

                </div>

            </main>

        </div>
    );
}

// =========================
// STYLES
// =========================

const styles = {

    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #eff6ff 0%, #f8fafc 45%, #eef2ff 100%)",
        fontFamily:
            "Arial, Helvetica, sans-serif",
        color: "#0f172a",
        padding: "35px",
        boxSizing: "border-box"
    },

    header: {
        maxWidth: "1050px",
        margin: "0 auto 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px"
    },

    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },

    aiLogo: {
        width: "58px",
        height: "58px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",
        color: "white",
        fontSize: "28px",
        boxShadow:
            "0 10px 25px rgba(37, 99, 235, 0.22)"
    },

    eyebrow: {
        margin: 0,
        fontSize: "11px",
        fontWeight: "bold",
        color: "#64748b",
        letterSpacing: "1.5px"
    },

    title: {
        margin: "4px 0 3px",
        fontSize: "30px",
        fontWeight: "700",
        color: "#0f172a"
    },

    subtitle: {
        margin: 0,
        color: "#64748b",
        fontSize: "14px"
    },

    backButton: {
        padding: "11px 18px",
        border: "1px solid #cbd5e1",
        borderRadius: "9px",
        backgroundColor: "#ffffff",
        color: "#334155",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow:
            "0 2px 6px rgba(15, 23, 42, 0.05)"
    },

    main: {
        maxWidth: "1050px",
        margin: "0 auto"
    },

    mainCard: {
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        padding: "35px",
        boxShadow:
            "0 12px 35px rgba(15, 23, 42, 0.08)",
        border:
            "1px solid rgba(226, 232, 240, 0.9)"
    },

    welcomeIcon: {
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        backgroundColor: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "25px",
        marginBottom: "16px"
    },

    heading: {
        margin: 0,
        fontSize: "25px",
        color: "#0f172a"
    },

    description: {
        margin:
            "9px 0 25px",
        color: "#64748b",
        fontSize: "14px",
        lineHeight: "1.7",
        maxWidth: "700px"
    },

    inputContainer: {
        border:
            "1px solid #cbd5e1",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#f8fafc"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        border: "none",
        outline: "none",
        resize: "vertical",
        padding: "17px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontSize: "15px",
        lineHeight: "1.6",
        fontFamily:
            "Arial, Helvetica, sans-serif"
    },

    inputFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        padding: "12px",
        backgroundColor: "#f8fafc",
        borderTop:
            "1px solid #e2e8f0"
    },

    inputHint: {
        color: "#94a3b8",
        fontSize: "11px"
    },

    askButton: {
        padding: "11px 20px",
        border: "none",
        borderRadius: "8px",
        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow:
            "0 6px 15px rgba(37, 99, 235, 0.22)"
    },

    askButtonDisabled: {
        padding: "11px 20px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#94a3b8",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "not-allowed"
    },

    loadingIcon: {
        display: "inline-block",
        marginRight: "7px",
        fontSize: "16px"
    },

    errorBox: {
        marginTop: "20px",
        padding: "15px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        backgroundColor: "#fef2f2",
        border:
            "1px solid #fecaca",
        borderRadius: "10px",
        color: "#991b1b"
    },

    errorIcon: {
        fontSize: "18px"
    },

    errorText: {
        margin: "4px 0 0",
        fontSize: "13px"
    },

    responseBox: {
        marginTop: "25px",
        padding: "22px",
        borderRadius: "13px",
        background:
            "linear-gradient(135deg, #eff6ff, #f5f3ff)",
        border:
            "1px solid #bfdbfe"
    },

    responseHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    responseIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "11px",
        backgroundColor: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    responseTitle: {
        color: "#1e3a8a",
        fontSize: "15px"
    },

    onlineStatus: {
        marginTop: "3px",
        color: "#64748b",
        fontSize: "11px"
    },

    onlineDot: {
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: "#22c55e",
        marginRight: "5px"
    },

    responseDivider: {
        height: "1px",
        backgroundColor: "#bfdbfe",
        margin:
            "16px 0"
    },

    responseText: {
        margin: 0,
        color: "#334155",
        fontSize: "14px",
        lineHeight: "1.8",
        whiteSpace: "pre-line"
    },

    quickCard: {
        marginTop: "22px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "25px 30px",
        boxShadow:
            "0 8px 25px rgba(15, 23, 42, 0.06)",
        border:
            "1px solid #e2e8f0"
    },

    quickHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px"
    },

    quickTitle: {
        margin: 0,
        fontSize: "18px",
        color: "#0f172a"
    },

    quickSubtitle: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },

    sparkle: {
        fontSize: "24px"
    },

    examples: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "12px"
    },

    exampleButton: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textAlign: "left",
        padding: "14px",
        border:
            "1px solid #e2e8f0",
        borderRadius: "10px",
        backgroundColor: "#f8fafc",
        cursor: "pointer",
        color: "#334155"
    },

    exampleIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "9px",
        backgroundColor: "#dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "19px",
        flexShrink: 0
    },

    infoRow: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
        marginTop: "20px"
    },

    infoItem: {
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "15px",
        backgroundColor:
            "rgba(255, 255, 255, 0.75)",
        borderRadius: "10px",
        border:
            "1px solid #e2e8f0"
    }
};

export default AIAssistant;


