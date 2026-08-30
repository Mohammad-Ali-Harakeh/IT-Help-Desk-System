
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Reports() {
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://it-help-desk-api-7iqa.onrender.com/api/Report/statistics"
                );

                console.log("Report status:", response.status);
                console.log("Report URL:", response.url);

                if (!response.ok) {
                    throw new Error(
                        `Failed to load report: ${ response.status } `
                    );
                }

                const data = await response.json();

                console.log("Report data:", data);

                setReport(data);
            } catch (err) {
                console.error("Report error:", err);

                setError(
                    err.message || "Failed to load report"
                );
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, []);

    const exportExcel = () => {
        window.open(
            "https://it-help-desk-api-7iqa.onrender.com/api/Report/excel",
            "_blank"
        );
    };

    const exportPdf = () => {
        window.open(
            "https://it-help-desk-api-7iqa.onrender.com/api/Report/pdf",
            "_blank"
        );
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.messageCard}>
                    <h2>Loading report...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.errorCard}>
                    <h2>Something went wrong</h2>

                    <p>{error}</p>

                    <button
                        style={styles.dashboardButton}
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Reports
                    </h1>

                    <p style={styles.subtitle}>
                        Ticket statistics and analytics
                    </p>
                </div>

                <div style={styles.buttons}>

                    <button
                        style={styles.excelButton}
                        onClick={exportExcel}
                    >
                        📊 Export Excel
                    </button>

                    <button
                        style={styles.pdfButton}
                        onClick={exportPdf}
                    >
                        📄 Export PDF
                    </button>

                    <button
                        style={styles.dashboardButton}
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

            </div>

            {/* KPI CARDS */}
            <div style={styles.cards}>

                <div style={styles.card}>
                    <p style={styles.cardTitle}>
                        Total Tickets
                    </p>

                    <h2 style={styles.blueNumber}>
                        {report.totalTickets}
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardTitle}>
                        Open Tickets
                    </p>

                    <h2 style={styles.greenNumber}>
                        {report.openTickets}
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardTitle}>
                        Closed Tickets
                    </p>

                    <h2 style={styles.redNumber}>
                        {report.closedTickets}
                    </h2>
                </div>

            </div>

            {/* CATEGORY */}
            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    Tickets by Category
                </h2>

                {report.ticketsByCategory?.length > 0 ? (

                    report.ticketsByCategory.map(
                        (item) => (
                            <div
                                key={item.categoryId}
                                style={styles.row}
                            >
                                <span>
                                    Category #{item.categoryId}
                                </span>

                                <strong>
                                    {item.count}
                                </strong>
                            </div>
                        )
                    )

                ) : (
                    <p>No category data available.</p>
                )}

            </div>

            {/* PRIORITY */}
            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    Tickets by Priority
                </h2>

                {report.ticketsByPriority?.length > 0 ? (

                    report.ticketsByPriority.map(
                        (item) => (
                            <div
                                key={item.priorityId}
                                style={styles.row}
                            >
                                <span>
                                    Priority #{item.priorityId}
                                </span>

                                <strong>
                                    {item.count}
                                </strong>
                            </div>
                        )
                    )

                ) : (
                    <p>No priority data available.</p>
                )}

            </div>

            {/* STATUS */}
            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    Tickets by Status
                </h2>

                {report.ticketsByStatus?.length > 0 ? (

                    report.ticketsByStatus.map(
                        (item) => (
                            <div
                                key={item.statusId}
                                style={styles.row}
                            >
                                <span>
                                    Status #{item.statusId}
                                </span>

                                <strong>
                                    {item.count}
                                </strong>
                            </div>
                        )
                    )

                ) : (
                    <p>No status data available.</p>
                )}

            </div>

        </div>
    );
}

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#eef2f7",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "20px"
    },

    title: {
        margin: 0,
        fontSize: "32px",
        color: "#111827"
    },

    subtitle: {
        marginTop: "8px",
        color: "#6b7280"
    },

    buttons: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },

    excelButton: {
        padding: "12px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#16a34a",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold"
    },

    pdfButton: {
        padding: "12px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#dc2626",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold"
    },

    dashboardButton: {
        padding: "12px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold"
    },

    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
    },

    card: {
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb"
    },

    cardTitle: {
        margin: 0,
        color: "#6b7280",
        fontSize: "16px"
    },

    blueNumber: {
        fontSize: "36px",
        margin: "10px 0 0",
        color: "#2563eb"
    },

    greenNumber: {
        fontSize: "36px",
        margin: "10px 0 0",
        color: "#16a34a"
    },

    redNumber: {
        fontSize: "36px",
        margin: "10px 0 0",
        color: "#dc2626"
    },

    section: {
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "14px",
        marginBottom: "20px",
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb"
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "20px",
        color: "#111827"
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        marginTop: "10px",
        backgroundColor: "#f3f6fa",
        borderRadius: "8px"
    },

    messageCard: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "14px",
        textAlign: "center",
        maxWidth: "500px",
        margin: "50px auto"
    },

    errorCard: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "14px",
        textAlign: "center",
        maxWidth: "500px",
        margin: "50px auto",
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)"
    }
};

export default Reports;

