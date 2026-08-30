
import { useState } from "react";

function AI() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [analysis, setAnalysis] = useState(null);
    const [assistantMessage, setAssistantMessage] = useState("");
    const [assistantResponse, setAssistantResponse] = useState("");

    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [loadingAssistant, setLoadingAssistant] = useState(false);

    const API_URL = "https://it-help-desk-api-7iqa.onrender.com/api";

    // =========================
    // ANALYZE TICKET
    // =========================

    const analyzeTicket = async () => {
        if (!title.trim() && !description.trim()) {
            alert("Please enter a title or description.");
            return;
        }

        try {
            setLoadingAnalysis(true);
            setAnalysis(null);

            const response = await fetch(
                `${ API_URL } /AI/analyze - ticket`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to analyze ticket");
            }

            const data = await response.json();

            setAnalysis(data.analysis);

        } catch (error) {
            console.error("AI Analysis Error:", error);
            alert("Failed to analyze ticket.");
        } finally {
            setLoadingAnalysis(false);
        }
    };


    // =========================
    // AI ASSISTANT
    // =========================

    const askAssistant = async () => {
        if (!assistantMessage.trim()) {
            alert("Please enter your question.");
            return;
        }

        try {
            setLoadingAssistant(true);
            setAssistantResponse("");

            const response = await fetch(
                `${ API_URL } /AI/assistant`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: assistantMessage
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to contact AI assistant");
            }

            const data = await response.json();

            setAssistantResponse(data.response);

        } catch (error) {
            console.error(
                "AI Assistant Error:",
                error
            );

            alert("Failed to contact AI assistant.");

        } finally {
            setLoadingAssistant(false);
        }
    };


    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial",
                minHeight: "100vh",
                backgroundColor: "#f5f6fa"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}
            >
                <div>
                    <h1>🤖 AI Help Desk</h1>

                    <p style={{ color: "#666" }}>
                        AI-powered ticket analysis and
                        troubleshooting assistant
                    </p>
                </div>

                <button
                    onClick={() =>
                        window.location.href = "/dashboard"
                    }
                    style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    ← Dashboard
                </button>
            </div>


            {/* =========================
                TICKET ANALYZER
            ========================= */}

            <div
                style={{
                    backgroundColor: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08)",
                    marginBottom: "30px"
                }}
            >

                <h2>🎫 AI Ticket Analyzer</h2>

                <p style={{ color: "#666" }}>
                    Analyze a ticket and get an AI
                    category, priority and solution.
                </p>

                <label>
                    <strong>Title</strong>
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Example: Computer is very slow"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box"
                    }}
                />

                <label>
                    <strong>Description</strong>
                </label>

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Describe the problem..."
                    rows="5"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        resize: "vertical"
                    }}
                />

                <button
                    onClick={analyzeTicket}
                    disabled={loadingAnalysis}
                    style={{
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#222",
                        color: "white"
                    }}
                >
                    {loadingAnalysis
                        ? "Analyzing..."
                        : "Analyze Ticket"}
                </button>


                {/* ANALYSIS RESULT */}

                {analysis && (
                    <div
                        style={{
                            marginTop: "25px",
                            padding: "20px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "10px"
                        }}
                    >
                        <h3>AI Analysis</h3>

                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                fontFamily: "Arial",
                                lineHeight: "1.6"
                            }}
                        >
                            {analysis}
                        </pre>
                    </div>
                )}

            </div>


            {/* =========================
                AI ASSISTANT
            ========================= */}

            <div
                style={{
                    backgroundColor: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08)"
                }}
            >

                <h2>💬 AI Help Desk Assistant</h2>

                <p style={{ color: "#666" }}>
                    Ask the AI for IT troubleshooting help.
                </p>

                <textarea
                    value={assistantMessage}
                    onChange={(e) =>
                        setAssistantMessage(e.target.value)
                    }
                    placeholder="Example: How can I fix a slow computer?"
                    rows="4"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        resize: "vertical"
                    }}
                />

                <button
                    onClick={askAssistant}
                    disabled={loadingAssistant}
                    style={{
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#222",
                        color: "white"
                    }}
                >
                    {loadingAssistant
                        ? "Thinking..."
                        : "Ask AI"}
                </button>


                {assistantResponse && (
                    <div
                        style={{
                            marginTop: "25px",
                            padding: "20px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "10px"
                        }}
                    >
                        <h3>AI Response</h3>

                        <p
                            style={{
                                whiteSpace: "pre-wrap",
                                lineHeight: "1.6"
                            }}
                        >
                            {assistantResponse}
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default AI;

