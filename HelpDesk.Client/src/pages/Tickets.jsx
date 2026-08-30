import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tickets() {
    const navigate = useNavigate();

    // IMPORTANT: Your API is running on port 5237
    const API = "http://localhost:5237/api";

    const userId = Number(localStorage.getItem("userId")) || 1;

    const [tickets, setTickets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [categoryId, setCategoryId] = useState(1);
    const [priorityId, setPriorityId] = useState(1);
    const [statusId, setStatusId] = useState(1);

    const [agentId, setAgentId] = useState(1);

    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState({});
    const [history, setHistory] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD ALL DATA
    // ==========================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    categoryResponse,
                    priorityResponse,
                    statusResponse,
                    ticketResponse
                ] = await Promise.all([
                    fetch(`${API}/Category`),
                    fetch(`${API}/Priority`),
                    fetch(`${API}/Status`),
                    fetch(`${API}/Ticket`)
                ]);

                if (!categoryResponse.ok) {
                    throw new Error("Failed to load categories");
                }

                if (!priorityResponse.ok) {
                    throw new Error("Failed to load priorities");
                }

                if (!statusResponse.ok) {
                    throw new Error("Failed to load statuses");
                }

                if (!ticketResponse.ok) {
                    throw new Error("Failed to load tickets");
                }

                const categoryData = await categoryResponse.json();
                const priorityData = await priorityResponse.json();
                const statusData = await statusResponse.json();
                const ticketData = await ticketResponse.json();

                setCategories(categoryData);
                setPriorities(priorityData);
                setStatuses(statusData);
                setTickets(ticketData);

                console.log("Categories:", categoryData);
                console.log("Priorities:", priorityData);
                console.log("Statuses:", statusData);
                console.log("Tickets:", ticketData);

            } catch (err) {
                console.error("LOAD ERROR:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // ==========================================
    // CREATE TICKET
    // ==========================================

    const createTicket = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert("Please fill in title and description.");
            return;
        }

        const newTicket = {
            title: title,
            description: description,
            employeeId: userId,
            assignedAgentId: null,
            categoryId: Number(categoryId),
            priorityId: Number(priorityId),
            statusId: Number(statusId)
        };

        console.log("Creating ticket:", newTicket);

        try {
            const response = await fetch(`${API}/Ticket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTicket)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Create ticket error:", errorText);
                throw new Error("Failed to create ticket");
            }

            const createdTicket = await response.json();

            setTickets((currentTickets) => [
                ...currentTickets,
                createdTicket
            ]);

            setTitle("");
            setDescription("");
            setCategoryId(1);
            setPriorityId(1);
            setStatusId(1);

            alert("Ticket created successfully!");

        } catch (err) {
            console.error("CREATE ERROR:", err);
            alert("Failed to create ticket.");
        }
    };

    // ==========================================
    // DELETE
    // ==========================================

    const deleteTicket = async (id) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) {
            return;
        }

        try {
            const response = await fetch(`${API}/Ticket/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }

            setTickets((currentTickets) =>
                currentTickets.filter((ticket) => ticket.id !== id)
            );

            alert("Ticket deleted successfully!");

        } catch (err) {
            console.error("DELETE ERROR:", err);
            alert("Failed to delete ticket.");
        }
    };

    // ==========================================
    // UPDATE TICKET
    // ==========================================

    const updateTicket = async (ticket) => {
        const updatedTicket = {
            title: ticket.title,
            description: ticket.description,
            employeeId: ticket.employeeId,
            assignedAgentId: ticket.assignedAgentId,
            categoryId: ticket.categoryId,
            priorityId: ticket.priorityId,
            statusId: ticket.statusId
        };

        try {
            const response = await fetch(
                `${API}/Ticket/${ticket.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedTicket)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update ticket");
            }

            const updatedData = await response.json();

            setTickets((currentTickets) =>
                currentTickets.map((t) =>
                    t.id === ticket.id ? updatedData : t
                )
            );

            alert("Ticket updated successfully!");

        } catch (err) {
            console.error("UPDATE ERROR:", err);
            alert("Failed to update ticket.");
        }
    };

    // ==========================================
    // ASSIGN TICKET
    // ==========================================

    const assignTicket = async (ticketId) => {
        try {
            const response = await fetch(
                `${API}/Ticket/assign/${ticketId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        assignedAgentId: Number(agentId)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to assign ticket");
            }

            const data = await response.json();

            setTickets((currentTickets) =>
                currentTickets.map((ticket) =>
                    ticket.id === ticketId
                        ? {
                            ...ticket,
                            assignedAgentId: Number(agentId)
                        }
                        : ticket
                )
            );

            alert(data.message);

        } catch (err) {
            console.error("ASSIGN ERROR:", err);
            alert("Failed to assign ticket.");
        }
    };

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    const updateTicketStatus = async (ticketId, newStatusId) => {
        try {
            const response = await fetch(
                `${API}/Ticket/status/${ticketId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        statusId: Number(newStatusId)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            const data = await response.json();

            setTickets((currentTickets) =>
                currentTickets.map((ticket) =>
                    ticket.id === ticketId
                        ? {
                            ...ticket,
                            statusId: Number(newStatusId)
                        }
                        : ticket
                )
            );

            alert(data.message);

        } catch (err) {
            console.error("STATUS ERROR:", err);
            alert("Failed to update status.");
        }
    };

    // ==========================================
    // ADD COMMENT
    // ==========================================

    const addComment = async (ticketId) => {
        if (!commentText.trim()) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const newComment = {
                comment: commentText,
                ticketId: ticketId,
                userId: userId
            };

            const response = await fetch(`${API}/Comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newComment)
            });

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            const data = await response.json();

            setComments((currentComments) => ({
                ...currentComments,
                [ticketId]: [
                    ...(currentComments[ticketId] || []),
                    data.comment
                ]
            }));

            setCommentText("");

            alert("Comment added successfully!");

        } catch (err) {
            console.error("COMMENT ERROR:", err);
            alert("Failed to add comment.");
        }
    };

    // ==========================================
    // LOAD COMMENTS
    // ==========================================

    const loadComments = async (ticketId) => {
        try {
            const response = await fetch(
                `${API}/Comment/ticket/${ticketId}`
            );

            if (!response.ok) {
                throw new Error("Failed to load comments");
            }

            const data = await response.json();

            setComments((currentComments) => ({
                ...currentComments,
                [ticketId]: data
            }));

        } catch (err) {
            console.error("LOAD COMMENTS ERROR:", err);
            alert("Failed to load comments.");
        }
    };

    // ==========================================
    // LOAD HISTORY
    // ==========================================

    const loadHistory = async (ticketId) => {
        try {
            const response = await fetch(
                `${API}/Ticket/${ticketId}/history`
            );

            if (!response.ok) {
                throw new Error("Failed to load history");
            }

            const data = await response.json();

            setHistory((currentHistory) => ({
                ...currentHistory,
                [ticketId]: data.history || []
            }));

        } catch (err) {
            console.error("LOAD HISTORY ERROR:", err);
            alert("Failed to load history.");
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div style={styles.container}>
                <h1>Tickets</h1>
                <p>Loading tickets...</p>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div style={styles.container}>
                <h1>Tickets</h1>

                <div style={styles.errorBox}>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>

                    <p>
                        Make sure your API is running on:
                    </p>

                    <strong>
                        http://localhost:5237
                    </strong>
                </div>
            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div style={styles.container}>

            {/* HEADER */}

            <div style={styles.header}>
                <div>
                    <h1>Tickets</h1>
                    <p>Manage support tickets</p>
                </div>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>
            </div>

            {/* CREATE TICKET */}

            <div style={styles.card}>

                <h2>Create Ticket</h2>

                <form onSubmit={createTicket}>

                    <label>Title</label>

                    <input
                        style={styles.input}
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter ticket title"
                        required
                    />

                    <label>Description</label>

                    <textarea
                        style={styles.textarea}
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter ticket description"
                        required
                    />

                    <div style={styles.formGrid}>

                        <div>
                            <label>Category</label>

                            <select
                                style={styles.select}
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(e.target.value)
                                }
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Priority</label>

                            <select
                                style={styles.select}
                                value={priorityId}
                                onChange={(e) =>
                                    setPriorityId(e.target.value)
                                }
                            >
                                {priorities.map((priority) => (
                                    <option
                                        key={priority.id}
                                        value={priority.id}
                                    >
                                        {priority.priorityName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Status</label>

                            <select
                                style={styles.select}
                                value={statusId}
                                onChange={(e) =>
                                    setStatusId(e.target.value)
                                }
                            >
                                {statuses.map((status) => (
                                    <option
                                        key={status.id}
                                        value={status.id}
                                    >
                                        {status.statusName}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <button
                        type="submit"
                        style={styles.createButton}
                    >
                        + Create Ticket
                    </button>

                </form>
            </div>

            {/* ALL TICKETS */}

            <h2 style={{ marginTop: "35px" }}>
                All Tickets ({tickets.length})
            </h2>

            {tickets.length === 0 ? (
                <div style={styles.card}>
                    <p>No tickets found.</p>
                </div>
            ) : (
                tickets.map((ticket) => (

                    <div
                        key={ticket.id}
                        style={styles.ticketCard}
                    >

                        <div style={styles.ticketHeader}>

                            <div>
                                <h2>
                                    #{ticket.id} - {ticket.title}
                                </h2>

                                <p>
                                    {ticket.description}
                                </p>
                            </div>

                            <span style={styles.status}>
                                Status ID: {ticket.statusId}
                            </span>

                        </div>

                        <hr />

                        {/* ASSIGN */}

                        <h3>Assign Agent</h3>

                        <div style={styles.row}>

                            <input
                                type="number"
                                style={styles.smallInput}
                                value={agentId}
                                onChange={(e) =>
                                    setAgentId(e.target.value)
                                }
                                placeholder="Agent ID"
                            />

                            <button
                                style={styles.button}
                                onClick={() =>
                                    assignTicket(ticket.id)
                                }
                            >
                                Assign
                            </button>

                        </div>

                        {/* STATUS */}

                        <h3>Change Status</h3>

                        <select
                            style={styles.select}
                            value={ticket.statusId}
                            onChange={(e) =>
                                updateTicketStatus(
                                    ticket.id,
                                    e.target.value
                                )
                            }
                        >
                            {statuses.map((status) => (
                                <option
                                    key={status.id}
                                    value={status.id}
                                >
                                    {status.statusName}
                                </option>
                            ))}
                        </select>

                        {/* COMMENTS */}

                        <h3>Comments</h3>

                        <textarea
                            style={styles.textarea}
                            value={commentText}
                            onChange={(e) =>
                                setCommentText(e.target.value)
                            }
                            placeholder="Write a comment..."
                        />

                        <button
                            style={styles.button}
                            onClick={() =>
                                addComment(ticket.id)
                            }
                        >
                            Add Comment
                        </button>

                        <button
                            style={styles.secondaryButton}
                            onClick={() =>
                                loadComments(ticket.id)
                            }
                        >
                            Load Comments
                        </button>

                        {comments[ticket.id]?.map((comment) => (
                            <div
                                key={comment.id}
                                style={styles.comment}
                            >
                                <p>
                                    {comment.comment}
                                </p>

                                <small>
                                    {comment.createdAt}
                                </small>
                            </div>
                        ))}

                        {/* HISTORY */}

                        <h3>Ticket History</h3>

                        <button
                            style={styles.secondaryButton}
                            onClick={() =>
                                loadHistory(ticket.id)
                            }
                        >
                            Load History
                        </button>

                        {history[ticket.id]?.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    style={styles.comment}
                                >
                                    <strong>
                                        {item.action}
                                    </strong>

                                    <p>
                                        User: {item.user}
                                    </p>

                                    <small>
                                        {item.createdAt}
                                    </small>
                                </div>
                            )
                        )}

                        {/* BUTTONS */}

                        <div style={styles.buttonRow}>

                            <button
                                style={styles.button}
                                onClick={() =>
                                    navigate(
                                        `/tickets/${ticket.id}`
                                    )
                                }
                            >
                                View Details
                            </button>

                            <button
                                style={styles.button}
                                onClick={() =>
                                    updateTicket(ticket)
                                }
                            >
                                Update
                            </button>

                            <button
                                style={styles.deleteButton}
                                onClick={() =>
                                    deleteTicket(ticket.id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                ))
            )}

        </div>
    );
}

// ==========================================
// STYLES
// ==========================================

const styles = {
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },

    card: {
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    },

    ticketCard: {
        background: "white",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    },

    ticketHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginTop: "15px"
    },

    input: {
        width: "100%",
        padding: "12px",
        marginTop: "6px",
        marginBottom: "15px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "6px"
    },

    textarea: {
        width: "100%",
        minHeight: "90px",
        padding: "12px",
        marginTop: "6px",
        marginBottom: "15px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "6px",
        resize: "vertical"
    },

    select: {
        width: "100%",
        padding: "12px",
        marginTop: "6px",
        marginBottom: "15px",
        boxSizing: "border-box",
        border: "1px solid #aaa",
        borderRadius: "6px",
        background: "white",
        fontSize: "15px"
    },

    smallInput: {
        width: "120px",
        padding: "10px",
        border: "1px solid #aaa",
        borderRadius: "6px"
    },

    row: {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    },

    buttonRow: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        flexWrap: "wrap"
    },

    button: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#eeeeee"
    },

    createButton: {
        padding: "12px 20px",
        marginTop: "10px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        background: "#eeeeee",
        fontSize: "15px"
    },

    secondaryButton: {
        padding: "8px 14px",
        marginRight: "10px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#eeeeee"
    },

    deleteButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#eeeeee"
    },

    backButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        background: "#eeeeee"
    },

    status: {
        padding: "8px 12px",
        borderRadius: "6px",
        background: "#eeeeee",
        height: "fit-content"
    },

    comment: {
        padding: "12px",
        marginTop: "10px",
        borderRadius: "7px",
        background: "#f5f5f5"
    },

    errorBox: {
        padding: "20px",
        borderRadius: "10px",
        background: "#f5f5f5"
    }
};

export default Tickets; 