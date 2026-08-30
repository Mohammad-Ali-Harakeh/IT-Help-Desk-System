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

    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    const API_URL = "http://localhost:5237/api";

    const [tickets, setTickets] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD DASHBOARD DATA
    // =========================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Load tickets
                const ticketsResponse = await fetch(
                    `${API_URL}/Ticket`
                );

                if (!ticketsResponse.ok) {
                    throw new Error("Failed to load tickets");
                }

                const ticketsData =
                    await ticketsResponse.json();

                setTickets(ticketsData);


                // Load unread notifications
                if (userId) {
                    const notificationResponse =
                        await fetch(
                            `${API_URL}/Notification/user/${userId}/unread`
                        );

                    if (!notificationResponse.ok) {
                        throw new Error(
                            "Failed to load notifications"
                        );
                    }

                    const notificationData =
                        await notificationResponse.json();

                    setUnreadCount(
                        notificationData.length
                    );
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


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        navigate("/");
    };


    // =========================
    // TICKET STATISTICS
    // =========================

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        ticket => ticket.statusId === 1
    ).length;

    const inProgressTickets = tickets.filter(
        ticket => ticket.statusId === 2
    ).length;

    const resolvedTickets = tickets.filter(
        ticket => ticket.statusId === 3
    ).length;

    const closedTickets = tickets.filter(
        ticket => ticket.statusId === 4
    ).length;

    const highPriorityTickets = tickets.filter(
        ticket => ticket.priorityId === 3
    ).length;

    const assignedTickets = tickets.filter(
        ticket => ticket.assignedAgentId != null
    ).length;

    const unassignedTickets = tickets.filter(
        ticket => ticket.assignedAgentId == null
    ).length;


    // =========================
    // CHART DATA
    // =========================

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


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div
                style={{
                    padding: "40px",
                    fontFamily: "Arial"
                }}
            >
                <h2>Loading dashboard...</h2>
            </div>
        );
    }


    // =========================
    // UI
    // =========================

    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial",
                minHeight: "100vh"
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
                    <h1 style={{ margin: 0 }}>
                        Dashboard
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#666"
                        }}
                    >
                        Role: <strong>{role}</strong>
                    </p>
                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "10px"
                    }}
                >

                    {/* NOTIFICATIONS */}

                    <button
                        onClick={() =>
                            navigate("/notifications")
                        }
                        style={{
                            padding: "12px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >
                        🔔 Notifications

                        {unreadCount > 0 && (
                            <span
                                style={{
                                    marginLeft: "8px",
                                    fontWeight: "bold"
                                }}
                            >
                                ({unreadCount})
                            </span>
                        )}
                    </button>


                    {/* TICKETS */}

                    <button
                        onClick={() =>
                            navigate("/tickets")
                        }
                        style={{
                            padding: "12px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >
                        🎫 Tickets
                    </button>


                    {/* LOGOUT */}

                    <button
                        onClick={logout}
                        style={{
                            padding: "12px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: "#ffffff",
                            fontSize: "15px",
                            color: "#222"
                        }}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* KPI */}

            <h2>Ticket Overview</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >

                {[
                    ["Total Tickets", totalTickets],
                    ["Open", openTickets],
                    ["In Progress", inProgressTickets],
                    ["Resolved", resolvedTickets],
                    ["Closed", closedTickets],
                    ["High Priority", highPriorityTickets]
                ].map(([title, value]) => (
                    <div
                        key={title}
                        style={{
                            backgroundColor: "white",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.08)"
                        }}
                    >
                        <h3>{title}</h3>

                        <h1>{value}</h1>
                    </div>
                ))}

            </div>


            {/* ANALYTICS */}

            <h2>Analytics</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "30px",
                    marginTop: "20px"
                }}
            >

                {/* STATUS */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                >

                    <h3>Tickets by Status</h3>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <PieChart>

                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {statusData.map(
                                    (entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                        />
                                    )
                                )}
                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>
                    </ResponsiveContainer>

                </div>


                {/* ASSIGNMENT */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                >

                    <h3>Ticket Assignment</h3>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <BarChart
                            data={assignmentData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="name"
                            />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="value"
                                name="Tickets"
                            />

                        </BarChart>
                    </ResponsiveContainer>

                </div>

            </div>


            {/* ASSIGNMENT OVERVIEW */}

            <div
                style={{
                    marginTop: "30px",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08)"
                }}
            >

                <h3>Assignment Overview</h3>

                <p>
                    Assigned Tickets:{" "}
                    <strong>{assignedTickets}</strong>
                </p>

                <p>
                    Unassigned Tickets:{" "}
                    <strong>{unassignedTickets}</strong>
                </p>

                <p>
                    High Priority Tickets:{" "}
                    <strong>{highPriorityTickets}</strong>
                </p>

            </div>

        </div>
    );
}

export default Dashboard;