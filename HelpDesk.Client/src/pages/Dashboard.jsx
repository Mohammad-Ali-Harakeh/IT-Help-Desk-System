

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

function Dashboard() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role") || "User";
    const userId = localStorage.getItem("userId");

    const API_URL = "https://it-help-desk-api-7iqa.onrender.com/api";

    const [tickets, setTickets] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const ticketsResponse = await fetch(
                    `${ API_URL }/Ticket`
                );

if (!ticketsResponse.ok) {
    throw new Error("Failed to load tickets");
}

const ticketsData = await ticketsResponse.json();

setTickets(
    Array.isArray(ticketsData)
        ? ticketsData
        : []
);

if (userId) {
    const notificationResponse =
        await fetch(
            `${API_URL}/Notification/user/${userId}/unread`
        );

    if (notificationResponse.ok) {
        const notificationData =
            await notificationResponse.json();

        setUnreadCount(
            Array.isArray(notificationData)
                ? notificationData.length
                : 0
        );
    }
}
            } catch (error) {
    console.error(
        "Dashboard error:",
        error
    );
} finally {
    setLoading(false);
}
        };

loadDashboard();
    }, [userId]);

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    navigate("/");
};

// =========================
// STATISTICS
// =========================

const totalTickets = tickets.length;

const openTickets = tickets.filter(
    ticket => Number(ticket.statusId) === 1
).length;

const inProgressTickets = tickets.filter(
    ticket => Number(ticket.statusId) === 2
).length;

const resolvedTickets = tickets.filter(
    ticket => Number(ticket.statusId) === 3
).length;

const closedTickets = tickets.filter(
    ticket => Number(ticket.statusId) === 4
).length;

const highPriorityTickets = tickets.filter(
    ticket => Number(ticket.priorityId) === 3
).length;

const assignedTickets = tickets.filter(
    ticket => ticket.assignedAgentId != null
).length;

const unassignedTickets =
    totalTickets - assignedTickets;

const statusData = [
    {
        name: "Open",
        value: openTickets
    },
    {
        name: "In Progress",
        value: inProgressTickets
    },
    {
        name: "Resolved",
        value: resolvedTickets
    },
    {
        name: "Closed",
        value: closedTickets
    }
];

const assignmentData = [
    {
        name: "Assigned",
        value: assignedTickets
    },
    {
        name: "Unassigned",
        value: unassignedTickets
    }
];

const COLORS = [
    "#2563eb",
    "#f59e0b",
    "#10b981",
    "#64748b"
];

if (loading) {
    return (
        <div style={styles.loadingPage}>
            <div style={styles.loadingCard}>
                <div style={styles.loadingIcon}>
                    🎫
                </div>

                <h2>Loading Dashboard...</h2>

                <p>
                    Preparing your help desk analytics
                </p>
            </div>
        </div>
    );
}

return (
    <div style={styles.app}>

        {/* =========================
                SIDEBAR
            ========================= */}

        <aside style={styles.sidebar}>

            <div>

                <div style={styles.logoContainer}>
                    <div style={styles.logo}>
                        IT
                    </div>

                    <div>
                        <h2 style={styles.logoTitle}>
                            HelpDesk
                        </h2>

                        <p style={styles.logoSubtitle}>
                            Management System
                        </p>
                    </div>
                </div>

                <div style={styles.menuSection}>

                    <p style={styles.menuTitle}>
                        MAIN MENU
                    </p>

                    <button
                        style={{
                            ...styles.menuItem,
                            ...styles.activeMenuItem
                        }}
                    >
                        <span>📊</span>
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/tickets")
                        }
                        style={styles.menuItem}
                    >
                        <span>🎫</span>
                        Tickets
                    </button>

                    <button
                        onClick={() =>
                            navigate("/notifications")
                        }
                        style={styles.menuItem}
                    >
                        <span>🔔</span>
                        Notifications

                        {unreadCount > 0 && (
                            <span style={styles.notificationBadge}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() =>
                            navigate("/reports")
                        }
                        style={styles.menuItem}
                    >
                        <span>📈</span>
                        Reports
                    </button>

                    <button
                        onClick={() =>
                            navigate("/ai")
                        }
                        style={styles.menuItem}
                    >
                        <span>🤖</span>
                        AI Assistant
                    </button>

                </div>

                <div style={styles.menuSection}>

                    <p style={styles.menuTitle}>
                        SYSTEM
                    </p>

                    <button
                        onClick={() =>
                            navigate("/tickets")
                        }
                        style={styles.menuItem}
                    >
                        <span>⚙️</span>
                        Support Center
                    </button>

                </div>

            </div>

            {/* USER AREA */}

            <div style={styles.sidebarBottom}>

                <div style={styles.userCard}>

                    <div style={styles.avatar}>
                        {role
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                        <strong style={styles.userName}>
                            {role}
                        </strong>

                        <span style={styles.userRole}>
                            System User
                        </span>
                    </div>

                </div>

                <button
                    onClick={logout}
                    style={styles.logoutButton}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>


        {/* =========================
                MAIN CONTENT
            ========================= */}

        <main style={styles.main}>

            {/* TOP HEADER */}

            <header style={styles.topHeader}>

                <div>
                    <p style={styles.breadcrumb}>
                        Home / Dashboard
                    </p>

                    <h1 style={styles.title}>
                        Dashboard
                    </h1>

                    <p style={styles.subtitle}>
                        Welcome back! Here's what's
                        happening with your help desk.
                    </p>
                </div>

                <div style={styles.headerActions}>

                    <button
                        onClick={() =>
                            navigate("/notifications")
                        }
                        style={styles.iconButton}
                    >
                        🔔

                        {unreadCount > 0 && (
                            <span style={styles.headerBadge}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() =>
                            navigate("/ai")
                        }
                        style={styles.aiButton}
                    >
                        🤖
                        <span>Ask AI</span>
                    </button>

                </div>

            </header>


            {/* =========================
                    KPI CARDS
                ========================= */}

            <section style={styles.kpiGrid}>

                <div style={styles.kpiCard}>

                    <div
                        style={{
                            ...styles.kpiIcon,
                            backgroundColor: "#dbeafe"
                        }}
                    >
                        🎫
                    </div>

                    <div>
                        <p style={styles.kpiLabel}>
                            Total Tickets
                        </p>

                        <h2 style={styles.kpiValue}>
                            {totalTickets}
                        </h2>

                        <span style={styles.kpiInfo}>
                            All support requests
                        </span>
                    </div>

                </div>


                <div style={styles.kpiCard}>

                    <div
                        style={{
                            ...styles.kpiIcon,
                            backgroundColor: "#dcfce7"
                        }}
                    >
                        🟢
                    </div>

                    <div>
                        <p style={styles.kpiLabel}>
                            Open Tickets
                        </p>

                        <h2 style={styles.kpiValue}>
                            {openTickets}
                        </h2>

                        <span style={styles.kpiInfo}>
                            Awaiting action
                        </span>
                    </div>

                </div>


                <div style={styles.kpiCard}>

                    <div
                        style={{
                            ...styles.kpiIcon,
                            backgroundColor: "#fef3c7"
                        }}
                    >
                        ⏳
                    </div>

                    <div>
                        <p style={styles.kpiLabel}>
                            In Progress
                        </p>

                        <h2 style={styles.kpiValue}>
                            {inProgressTickets}
                        </h2>

                        <span style={styles.kpiInfo}>
                            Currently being handled
                        </span>
                    </div>

                </div>


                <div style={styles.kpiCard}>

                    <div
                        style={{
                            ...styles.kpiIcon,
                            backgroundColor: "#fee2e2"
                        }}
                    >
                        🚨
                    </div>

                    <div>
                        <p style={styles.kpiLabel}>
                            High Priority
                        </p>

                        <h2 style={styles.kpiValue}>
                            {highPriorityTickets}
                        </h2>

                        <span style={styles.kpiInfo}>
                            Requires attention
                        </span>
                    </div>

                </div>

            </section>


            {/* =========================
                    CHARTS
                ========================= */}

            <section style={styles.chartGrid}>

                {/* STATUS CHART */}

                <div style={styles.chartCard}>

                    <div style={styles.chartHeader}>

                        <div>
                            <h3 style={styles.chartTitle}>
                                Ticket Status
                            </h3>

                            <p style={styles.chartSubtitle}>
                                Current ticket distribution
                            </p>
                        </div>

                        <span style={styles.chartIcon}>
                            📊
                        </span>

                    </div>

                    <div style={styles.chartContainer}>

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>

                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={105}
                                    innerRadius={55}
                                    paddingAngle={3}
                                    label
                                >
                                    {statusData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={
                                                    `cell-${index}`
                                                }
                                                fill={
                                                    COLORS[
                                                    index
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                </div>


                {/* ASSIGNMENT CHART */}

                <div style={styles.chartCard}>

                    <div style={styles.chartHeader}>

                        <div>
                            <h3 style={styles.chartTitle}>
                                Ticket Assignment
                            </h3>

                            <p style={styles.chartSubtitle}>
                                Assigned vs unassigned tickets
                            </p>
                        </div>

                        <span style={styles.chartIcon}>
                            👥
                        </span>

                    </div>

                    <div style={styles.chartContainer}>

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={assignmentData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    name="Tickets"
                                    fill="#2563eb"
                                    radius={[
                                        6,
                                        6,
                                        0,
                                        0
                                    ]}
                                    barSize={55}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

            </section>


            {/* =========================
                    OVERVIEW
                ========================= */}

            <section style={styles.overviewGrid}>

                <div style={styles.overviewCard}>

                    <div style={styles.overviewHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>
                                Ticket Overview
                            </h3>

                            <p style={styles.chartSubtitle}>
                                Current workload summary
                            </p>
                        </div>
                    </div>

                    <div style={styles.progressList}>

                        <div style={styles.progressRow}>

                            <div style={styles.progressInfo}>
                                <span>
                                    Open
                                </span>

                                <strong>
                                    {openTickets}
                                </strong>
                            </div>

                            <div style={styles.progressBackground}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width:
                                            totalTickets > 0
                                                ? `${(
                                                    openTickets /
                                                    totalTickets
                                                ) *
                                                100
                                                }%`
                                                : "0%",
                                        backgroundColor:
                                            "#2563eb"
                                    }}
                                />
                            </div>

                        </div>


                        <div style={styles.progressRow}>

                            <div style={styles.progressInfo}>
                                <span>
                                    In Progress
                                </span>

                                <strong>
                                    {inProgressTickets}
                                </strong>
                            </div>

                            <div style={styles.progressBackground}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width:
                                            totalTickets > 0
                                                ? `${(
                                                    inProgressTickets /
                                                    totalTickets
                                                ) *
                                                100
                                                }%`
                                                : "0%",
                                        backgroundColor:
                                            "#f59e0b"
                                    }}
                                />
                            </div>

                        </div>


                        <div style={styles.progressRow}>

                            <div style={styles.progressInfo}>
                                <span>
                                    Resolved
                                </span>

                                <strong>
                                    {resolvedTickets}
                                </strong>
                            </div>

                            <div style={styles.progressBackground}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width:
                                            totalTickets > 0
                                                ? `${(
                                                    resolvedTickets /
                                                    totalTickets
                                                ) *
                                                100
                                                }%`
                                                : "0%",
                                        backgroundColor:
                                            "#10b981"
                                    }}
                                />
                            </div>

                        </div>


                        <div style={styles.progressRow}>

                            <div style={styles.progressInfo}>
                                <span>
                                    Closed
                                </span>

                                <strong>
                                    {closedTickets}
                                </strong>
                            </div>

                            <div style={styles.progressBackground}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width:
                                            totalTickets > 0
                                                ? `${(
                                                    closedTickets /
                                                    totalTickets
                                                ) *
                                                100
                                                }%`
                                                : "0%",
                                        backgroundColor:
                                            "#64748b"
                                    }}
                                />
                            </div>

                        </div>

                    </div>

                </div>


                {/* QUICK ACTIONS */}

                <div style={styles.quickCard}>

                    <h3 style={styles.chartTitle}>
                        Quick Actions
                    </h3>

                    <p style={styles.chartSubtitle}>
                        Manage your help desk
                    </p>

                    <button
                        onClick={() =>
                            navigate("/tickets")
                        }
                        style={styles.actionButton}
                    >
                        <span style={styles.actionIcon}>
                            🎫
                        </span>

                        <span>
                            <strong>
                                View Tickets
                            </strong>

                            <small>
                                Manage support requests
                            </small>
                        </span>

                        <span>
                            →
                        </span>
                    </button>


                    <button
                        onClick={() =>
                            navigate("/reports")
                        }
                        style={styles.actionButton}
                    >
                        <span style={styles.actionIcon}>
                            📊
                        </span>

                        <span>
                            <strong>
                                View Reports
                            </strong>

                            <small>
                                Analyze help desk data
                            </small>
                        </span>

                        <span>
                            →
                        </span>
                    </button>


                    <button
                        onClick={() =>
                            navigate("/ai")
                        }
                        style={styles.actionButton}
                    >
                        <span style={styles.actionIcon}>
                            🤖
                        </span>

                        <span>
                            <strong>
                                AI Assistant
                            </strong>

                            <small>
                                Get intelligent support
                            </small>
                        </span>

                        <span>
                            →
                        </span>
                    </button>

                </div>

            </section>

        </main>

    </div>
);
}


// =========================
// STYLES
// =========================

const styles = {

    app: {
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f8fafc",
        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
        color: "#0f172a"
    },

    sidebar: {
        width: "255px",
        minHeight: "100vh",
        background:
            "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
        color: "white",
        padding: "25px 18px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0
    },

    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "5px 8px 30px"
    },

    logo: {
        width: "43px",
        height: "43px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg, #2563eb, #38bdf8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "900",
        fontSize: "16px"
    },

    logoTitle: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "800"
    },

    logoSubtitle: {
        margin: "3px 0 0",
        fontSize: "10px",
        color: "#94a3b8"
    },

    menuSection: {
        marginBottom: "28px"
    },

    menuTitle: {
        margin: "0 10px 10px",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        color: "#64748b"
    },

    menuItem: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "13px 14px",
        marginBottom: "5px",
        border: "none",
        borderRadius: "9px",
        backgroundColor: "transparent",
        color: "#cbd5e1",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "left",
        transition: "0.2s"
    },

    activeMenuItem: {
        backgroundColor: "#2563eb",
        color: "white",
        boxShadow:
            "0 6px 18px rgba(37, 99, 235, 0.3)"
    },

    notificationBadge: {
        marginLeft: "auto",
        backgroundColor: "#ef4444",
        color: "white",
        borderRadius: "20px",
        padding: "2px 7px",
        fontSize: "10px",
        fontWeight: "bold"
    },

    sidebarBottom: {
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "18px"
    },

    userCard: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px"
    },

    avatar: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },

    userName: {
        display: "block",
        fontSize: "13px"
    },

    userRole: {
        display: "block",
        marginTop: "2px",
        color: "#94a3b8",
        fontSize: "11px"
    },

    logoutButton: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 12px",
        marginTop: "8px",
        border: "none",
        borderRadius: "8px",
        backgroundColor:
            "rgba(255,255,255,0.06)",
        color: "#cbd5e1",
        cursor: "pointer",
        fontSize: "13px"
    },

    main: {
        marginLeft: "255px",
        width: "calc(100% - 255px)",
        padding: "32px 40px",
        boxSizing: "border-box"
    },

    topHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "32px",
        gap: "20px"
    },

    breadcrumb: {
        margin: "0 0 8px",
        color: "#94a3b8",
        fontSize: "12px"
    },

    title: {
        margin: 0,
        fontSize: "32px",
        fontWeight: "800",
        letterSpacing: "-0.5px"
    },

    subtitle: {
        margin: "8px 0 0",
        color: "#64748b",
        fontSize: "14px"
    },

    headerActions: {
        display: "flex",
        gap: "10px"
    },

    iconButton: {
        position: "relative",
        width: "44px",
        height: "44px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        backgroundColor: "white",
        cursor: "pointer",
        fontSize: "17px"
    },

    headerBadge: {
        position: "absolute",
        top: "-5px",
        right: "-5px",
        backgroundColor: "#ef4444",
        color: "white",
        borderRadius: "50%",
        minWidth: "18px",
        height: "18px",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },

    aiButton: {
        height: "44px",
        padding: "0 18px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        border: "none",
        borderRadius: "10px",
        background:
            "linear-gradient(135deg, #7c3aed, #2563eb)",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
    },

    kpiGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
        marginBottom: "25px"
    },

    kpiCard: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },

    kpiIcon: {
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px",
        flexShrink: 0
    },

    kpiLabel: {
        margin: 0,
        color: "#64748b",
        fontSize: "12px",
        fontWeight: "600"
    },

    kpiValue: {
        margin: "5px 0",
        fontSize: "28px",
        fontWeight: "800"
    },

    kpiInfo: {
        color: "#94a3b8",
        fontSize: "10px"
    },

    chartGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
        marginBottom: "20px"
    },

    chartCard: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "24px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },

    chartHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },

    chartTitle: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "750"
    },

    chartSubtitle: {
        margin: "5px 0 0",
        color: "#94a3b8",
        fontSize: "12px"
    },

    chartIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "9px",
        backgroundColor: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    chartContainer: {
        width: "100%",
        height: "300px",
        marginTop: "15px"
    },

    overviewGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px"
    },

    overviewCard: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "24px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },

    overviewHeader: {
        marginBottom: "20px"
    },

    progressList: {
        display: "flex",
        flexDirection: "column",
        gap: "19px"
    },

    progressRow: {
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },

    progressInfo: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        color: "#475569"
    },

    progressBackground: {
        width: "100%",
        height: "7px",
        backgroundColor: "#e2e8f0",
        borderRadius: "10px",
        overflow: "hidden"
    },

    progressBar: {
        height: "100%",
        borderRadius: "10px",
        transition: "0.3s"
    },

    quickCard: {
        background:
            "linear-gradient(135deg, #0f172a, #1e3a8a)",
        borderRadius: "14px",
        padding: "24px",
        color: "white",
        boxShadow:
            "0 8px 25px rgba(15,23,42,0.15)"
    },

    actionButton: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginTop: "13px",
        padding: "13px",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        backgroundColor:
            "rgba(255,255,255,0.07)",
        color: "white",
        cursor: "pointer",
        textAlign: "left"
    },

    actionIcon: {
        width: "35px",
        height: "35px",
        borderRadius: "8px",
        backgroundColor:
            "rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    loadingPage: {
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial"
    },

    loadingCard: {
        textAlign: "center",
        backgroundColor: "white",
        padding: "45px",
        borderRadius: "16px",
        boxShadow:
            "0 8px 30px rgba(15,23,42,0.08)"
    },

    loadingIcon: {
        fontSize: "45px",
        marginBottom: "15px"
    }
};

export default Dashboard;

