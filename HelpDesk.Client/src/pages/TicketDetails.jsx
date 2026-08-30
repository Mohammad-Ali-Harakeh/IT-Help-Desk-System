
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [attachments, setAttachments] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");

    // =========================
    // AI
    // =========================

    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    const userId = localStorage.getItem("userId");

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        const loadData = async () => {
            try {
                setError("");

                // =========================
                // LOAD TICKET
                // =========================

                const ticketResponse = await fetch(
                    `https://it-help-desk-api-7iqa.onrender.com/api/Ticket/${id}`
                );

if (!ticketResponse.ok) {
    throw new Error("Failed to load ticket");
}

const ticketData = await ticketResponse.json();
setTicket(ticketData);

// =========================
// LOAD COMMENTS
// =========================

const commentsResponse = await fetch(
    `https://it-help-desk-api-7iqa.onrender.com/api/Comment/ticket/${id}`
);

if (commentsResponse.ok) {
    const commentsData =
        await commentsResponse.json();

    setComments(commentsData);
}

// =========================
// LOAD HISTORY
// =========================

const historyResponse = await fetch(
    `https://it-help-desk-api-7iqa.onrender.com/api/Ticket/${id}/history`
);

if (historyResponse.ok) {
    const historyData =
        await historyResponse.json();

    setHistory(historyData.history || []);
}

// =========================
// LOAD ATTACHMENTS
// =========================

const attachmentsResponse = await fetch(
    `https://it-help-desk-api-7iqa.onrender.com/api/TicketAttachment/ticket/${id}`
);

if (attachmentsResponse.ok) {
    const attachmentsData =
        await attachmentsResponse.json();

    setAttachments(attachmentsData);
} else {
    setAttachments([]);
}

            } catch (err) {
    console.error("Error:", err);
    setError(err.message);
}
        };

loadData();
    }, [id]);

// =========================
// AI ANALYSIS
// =========================

const analyzeWithAI = async () => {
    if (!ticket) {
        return;
    }

    try {
        setAiLoading(true);
        setAiError("");
        setAiAnalysis(null);

        const response = await fetch(
            "https://it-help-desk-api-7iqa.onrender.com/api/AI/analyze-ticket",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: ticket.title || "",
                    description: ticket.description || ""
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "AI analysis failed."
            );
        }

        setAiAnalysis(data);

    } catch (err) {
        console.error("AI analysis error:", err);

        setAiError(
            err.message || "Failed to analyze ticket."
        );
    } finally {
        setAiLoading(false);
    }
};

// =========================
// UPLOAD FILE
// =========================

const handleUpload = async () => {
    if (!selectedFile) {
        setUploadMessage("Please select a file first.");
        return;
    }

    if (!userId) {
        setUploadMessage("User ID not found.");
        return;
    }

    try {
        setUploading(true);
        setUploadMessage("");

        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("uploadedByUserId", userId);

        const response = await fetch(
            `https://it-help-desk-api-7iqa.onrender.com/api/TicketAttachment/upload/${id}`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Upload failed"
            );
        }

        setUploadMessage(
            "File uploaded successfully!"
        );

        setSelectedFile(null);

        // Reload attachments
        const attachmentsResponse = await fetch(
            `https://it-help-desk-api-7iqa.onrender.com/api/TicketAttachment/ticket/${id}`
        );

        if (attachmentsResponse.ok) {
            const attachmentsData =
                await attachmentsResponse.json();

            setAttachments(attachmentsData);
        }

    } catch (err) {
        console.error("Upload error:", err);

        setUploadMessage(
            err.message || "Upload failed"
        );
    } finally {
        setUploading(false);
    }
};

// =========================
// LOADING
// =========================

if (!ticket && !error) {
    return (
        <div style={styles.page}>
            <div style={styles.loadingCard}>
                <h2>Loading ticket...</h2>
            </div>
        </div>
    );
}

// =========================
// ERROR
// =========================

if (error) {
    return (
        <div style={styles.page}>
            <div style={styles.errorCard}>
                <div style={styles.errorIcon}>⚠️</div>

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button
                    onClick={() => navigate("/tickets")}
                    style={styles.primaryButton}
                >
                    ← Back to Tickets
                </button>
            </div>
        </div>
    );
}

// =========================
// PAGE
// =========================

return (
    <div style={styles.page}>

        {/* HEADER */}

        <div style={styles.header}>
            <div>
                <p style={styles.smallTitle}>
                    TICKET DETAILS
                </p>

                <h1 style={styles.pageTitle}>
                    Ticket #{ticket.id}
                </h1>
            </div>

            <button
                onClick={() => navigate("/tickets")}
                style={styles.backButton}
            >
                ← Back to Tickets
            </button>
        </div>

        {/* TICKET INFORMATION */}

        <div style={styles.card}>

            <div style={styles.cardHeader}>

                <div>
                    <p style={styles.sectionLabel}>
                        SUPPORT REQUEST
                    </p>

                    <h2 style={styles.ticketTitle}>
                        {ticket.title}
                    </h2>
                </div>

                <span style={styles.statusBadge}>
                    Status {ticket.statusId}
                </span>

            </div>

            <p style={styles.description}>
                {ticket.description}
            </p>

            <div style={styles.infoGrid}>

                <div style={styles.infoBox}>
                    <span style={styles.infoLabel}>
                        Status
                    </span>

                    <strong>
                        Status ID: {ticket.statusId}
                    </strong>
                </div>

                <div style={styles.infoBox}>
                    <span style={styles.infoLabel}>
                        Priority
                    </span>

                    <strong>
                        Priority ID: {ticket.priorityId}
                    </strong>
                </div>

                <div style={styles.infoBox}>
                    <span style={styles.infoLabel}>
                        Category
                    </span>

                    <strong>
                        Category ID: {ticket.categoryId}
                    </strong>
                </div>

                <div style={styles.infoBox}>
                    <span style={styles.infoLabel}>
                        Assigned Agent
                    </span>

                    <strong>
                        {ticket.assignedAgentId
                            ? `Agent #${ticket.assignedAgentId}`
                            : "Not assigned"}
                    </strong>
                </div>

            </div>

        </div>

        {/* AI ANALYSIS */}

        <div style={styles.card}>

            <div style={styles.sectionHeader}>
                <h2>🤖 AI Ticket Analysis</h2>
            </div>

            <p style={styles.aiDescription}>
                Use the AI assistant to analyze this ticket
                and suggest a category, priority, summary,
                and troubleshooting solution.
            </p>

            <button
                onClick={analyzeWithAI}
                disabled={aiLoading}
                style={
                    aiLoading
                        ? styles.disabledButton
                        : styles.aiButton
                }
            >
                {aiLoading
                    ? "🤖 Analyzing..."
                    : "🤖 Analyze with AI"}
            </button>

            {aiError && (
                <div style={styles.aiError}>
                    <strong>Error:</strong> {aiError}
                </div>
            )}

            {aiAnalysis && (
                <div style={styles.aiResult}>

                    <h3 style={styles.aiResultTitle}>
                        AI Analysis Result
                    </h3>

                    <div style={styles.aiGrid}>

                        <div style={styles.aiBox}>
                            <span style={styles.aiLabel}>
                                Category
                            </span>

                            <strong style={styles.aiValue}>
                                {aiAnalysis.category}
                            </strong>
                        </div>

                        <div style={styles.aiBox}>
                            <span style={styles.aiLabel}>
                                Priority
                            </span>

                            <strong style={styles.aiValue}>
                                {aiAnalysis.priority}
                            </strong>
                        </div>

                    </div>

                    <div style={styles.aiTextBox}>

                        <span style={styles.aiLabel}>
                            Summary
                        </span>

                        <p>
                            {aiAnalysis.summary}
                        </p>

                    </div>

                    <div style={styles.aiTextBox}>

                        <span style={styles.aiLabel}>
                            Troubleshooting Suggestion
                        </span>

                        <p>
                            {aiAnalysis.suggestion}
                        </p>

                    </div>

                </div>
            )}

        </div>

        {/* COMMENTS */}

        <div style={styles.card}>

            <div style={styles.sectionHeader}>
                <h2>💬 Comments</h2>

                <span style={styles.countBadge}>
                    {comments.length}
                </span>
            </div>

            {comments.length === 0 ? (
                <div style={styles.emptyBox}>
                    No comments yet.
                </div>
            ) : (
                comments.map((comment) => (
                    <div
                        key={comment.id}
                        style={styles.commentBox}
                    >
                        <div style={styles.commentDot} />

                        <div>
                            <p style={styles.commentText}>
                                {comment.comment}
                            </p>

                            <small style={styles.date}>
                                {new Date(
                                    comment.createdAt
                                ).toLocaleString()}
                            </small>
                        </div>
                    </div>
                ))
            )}

        </div>

        {/* ATTACHMENTS */}

        <div style={styles.card}>

            <div style={styles.sectionHeader}>
                <h2>📎 Attachments</h2>

                <span style={styles.countBadge}>
                    {attachments.length}
                </span>
            </div>

            {/* Upload area */}

            <div style={styles.uploadBox}>

                <input
                    type="file"
                    onChange={(e) => {
                        setSelectedFile(
                            e.target.files[0] || null
                        );

                        setUploadMessage("");
                    }}
                    style={styles.fileInput}
                />

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    style={
                        uploading
                            ? styles.disabledButton
                            : styles.primaryButton
                    }
                >
                    {uploading
                        ? "Uploading..."
                        : "📤 Upload File"}
                </button>

                {selectedFile && (
                    <p style={styles.selectedFile}>
                        Selected:{" "}
                        <strong>
                            {selectedFile.name}
                        </strong>
                    </p>
                )}

                {uploadMessage && (
                    <p style={styles.uploadMessage}>
                        {uploadMessage}
                    </p>
                )}

            </div>

            {/* Files */}

            {attachments.length === 0 ? (
                <div style={styles.emptyBox}>
                    No attachments yet.
                </div>
            ) : (
                attachments.map((attachment) => (
                    <div
                        key={attachment.id}
                        style={styles.attachmentBox}
                    >

                        <div style={styles.fileInfo}>

                            <div style={styles.fileIcon}>
                                📄
                            </div>

                            <div>
                                <strong>
                                    {attachment.fileName}
                                </strong>

                                <br />

                                <small style={styles.date}>
                                    Uploaded by:{" "}
                                    {attachment.uploadedBy}
                                    {" • "}
                                    {new Date(
                                        attachment.uploadedAt
                                    ).toLocaleString()}
                                </small>
                            </div>

                        </div>

                        <a
                            href={`https://it-help-desk-api-7iqa.onrender.com${attachment.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.openButton}
                        >
                            Open
                        </a>

                    </div>
                ))
            )}

        </div>

        {/* HISTORY */}

        <div style={styles.card}>

            <div style={styles.sectionHeader}>
                <h2>📋 Activity History</h2>

                <span style={styles.countBadge}>
                    {history.length}
                </span>
            </div>

            {history.length === 0 ? (
                <div style={styles.emptyBox}>
                    No history found.
                </div>
            ) : (
                history.map((item, index) => (
                    <div
                        key={index}
                        style={styles.historyItem}
                    >

                        <div style={styles.timelineDot} />

                        <div>
                            <p style={styles.action}>
                                {item.action}
                            </p>

                            <small style={styles.date}>
                                {item.user || "User"}
                                {" • "}
                                {new Date(
                                    item.createdAt
                                ).toLocaleString()}
                            </small>
                        </div>

                    </div>
                ))
            )}

        </div>

    </div>
);
}

// =========================
// STYLES
// =========================

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "35px",
        fontFamily: "Arial, sans-serif",
        color: "#1e293b"
    },

    header: {
        maxWidth: "1100px",
        margin: "0 auto 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px"
    },

    smallTitle: {
        margin: 0,
        color: "#64748b",
        fontSize: "12px",
        fontWeight: "bold",
        letterSpacing: "1px"
    },

    pageTitle: {
        margin: "5px 0 0",
        fontSize: "32px",
        color: "#0f172a"
    },

    card: {
        maxWidth: "1100px",
        margin: "0 auto 25px",
        backgroundColor: "#ffffff",
        padding: "28px",
        borderRadius: "14px",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)"
    },

    loadingCard: {
        maxWidth: "1100px",
        margin: "80px auto",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "14px",
        textAlign: "center"
    },

    errorCard: {
        maxWidth: "500px",
        margin: "100px auto",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)"
    },

    errorIcon: {
        fontSize: "40px"
    },

    backButton: {
        padding: "11px 18px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "white",
        color: "#334155",
        fontWeight: "bold"
    },

    primaryButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "white",
        fontWeight: "bold"
    },

    disabledButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "not-allowed",
        backgroundColor: "#94a3b8",
        color: "white",
        fontWeight: "bold"
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },

    sectionLabel: {
        margin: 0,
        fontSize: "12px",
        color: "#64748b",
        fontWeight: "bold",
        letterSpacing: "1px"
    },

    ticketTitle: {
        margin: "6px 0 0",
        fontSize: "25px",
        color: "#0f172a"
    },

    statusBadge: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },

    description: {
        color: "#475569",
        lineHeight: "1.7",
        marginTop: "20px"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginTop: "25px"
    },

    infoBox: {
        padding: "16px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },

    infoLabel: {
        color: "#64748b",
        fontSize: "13px"
    },

    // =========================
    // AI STYLES
    // =========================

    aiButton: {
        padding: "13px 20px",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        backgroundColor: "#7c3aed",
        color: "white",
        fontWeight: "bold",
        fontSize: "15px"
    },

    aiDescription: {
        color: "#64748b",
        lineHeight: "1.6",
        marginBottom: "18px"
    },

    aiError: {
        marginTop: "18px",
        padding: "15px",
        borderRadius: "9px",
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fecaca"
    },

    aiResult: {
        marginTop: "25px",
        padding: "22px",
        backgroundColor: "#faf5ff",
        border: "1px solid #e9d5ff",
        borderRadius: "12px"
    },

    aiResultTitle: {
        marginTop: 0,
        marginBottom: "18px",
        color: "#581c87"
    },

    aiGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "15px"
    },

    aiBox: {
        padding: "16px",
        backgroundColor: "white",
        borderRadius: "9px",
        border: "1px solid #e9d5ff",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    aiLabel: {
        fontSize: "13px",
        color: "#7e22ce",
        fontWeight: "bold"
    },

    aiValue: {
        fontSize: "18px",
        color: "#3b0764"
    },

    aiTextBox: {
        padding: "16px",
        marginTop: "12px",
        backgroundColor: "white",
        borderRadius: "9px",
        border: "1px solid #e9d5ff",
        lineHeight: "1.6"
    },

    // =========================
    // COMMENTS
    // =========================

    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
    },

    countBadge: {
        backgroundColor: "#e2e8f0",
        color: "#475569",
        padding: "4px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        fontWeight: "bold"
    },

    emptyBox: {
        padding: "20px",
        backgroundColor: "#f8fafc",
        borderRadius: "10px",
        color: "#64748b",
        textAlign: "center"
    },

    commentBox: {
        display: "flex",
        gap: "12px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#f8fafc",
        borderRadius: "10px",
        border: "1px solid #e2e8f0"
    },

    commentDot: {
        width: "9px",
        height: "9px",
        marginTop: "6px",
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        flexShrink: 0
    },

    commentText: {
        margin: "0 0 8px",
        color: "#334155"
    },

    date: {
        color: "#64748b"
    },

    // =========================
    // ATTACHMENTS
    // =========================

    uploadBox: {
        padding: "22px",
        marginBottom: "20px",
        backgroundColor: "#eff6ff",
        border: "1px dashed #93c5fd",
        borderRadius: "10px"
    },

    fileInput: {
        marginRight: "10px"
    },

    selectedFile: {
        marginBottom: 0,
        color: "#334155"
    },

    uploadMessage: {
        marginBottom: 0,
        color: "#2563eb",
        fontWeight: "bold"
    },

    attachmentBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        padding: "16px",
        marginBottom: "10px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "10px"
    },

    fileInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    fileIcon: {
        width: "42px",
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dbeafe",
        borderRadius: "8px",
        fontSize: "20px"
    },

    openButton: {
        padding: "9px 15px",
        backgroundColor: "#2563eb",
        color: "white",
        textDecoration: "none",
        borderRadius: "7px",
        fontWeight: "bold"
    },

    // =========================
    // HISTORY
    // =========================

    historyItem: {
        display: "flex",
        gap: "14px",
        padding: "16px 0",
        borderBottom: "1px solid #e2e8f0"
    },

    timelineDot: {
        width: "10px",
        height: "10px",
        marginTop: "6px",
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        flexShrink: 0
    },

    action: {
        margin: 0,
        fontWeight: "bold",
        color: "#334155"
    }
};

export default TicketDetails;






