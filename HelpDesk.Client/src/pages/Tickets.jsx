
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tickets() {
    const navigate = useNavigate();

    const API = "http://localhost:5237/api";

    const userId =
        Number(localStorage.getItem("userId")) || 1;

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

    const [aiResults, setAiResults] = useState({});
    const [aiLoading, setAiLoading] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD DATA
    // =========================================================

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
                    fetch(`${ API }/Category`),
fetch(`${API}/Priority`),
    fetch(`${API}/Status`),
    fetch(`${API}/Ticket`)
                ]);

if (!categoryResponse.ok) {
    throw new Error(
        "Failed to load categories"
    );
}

if (!priorityResponse.ok) {
    throw new Error(
        "Failed to load priorities"
    );
}

if (!statusResponse.ok) {
    throw new Error(
        "Failed to load statuses"
    );
}

if (!ticketResponse.ok) {
    throw new Error(
        "Failed to load tickets"
    );
}

const categoryData =
    await categoryResponse.json();

const priorityData =
    await priorityResponse.json();

const statusData =
    await statusResponse.json();

const ticketData =
    await ticketResponse.json();

setCategories(categoryData);
setPriorities(priorityData);
setStatuses(statusData);
setTickets(ticketData);

            } catch (err) {
    console.error("LOAD ERROR:", err);
    setError(err.message);
} finally {
    setLoading(false);
}
        };

loadData();
    }, []);


// =========================================================
// CREATE TICKET
// =========================================================

const createTicket = async (e) => {
    e.preventDefault();

    if (
        !title.trim() ||
        !description.trim()
    ) {
        alert(
            "Please fill in title and description."
        );
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

    try {
        const response = await fetch(
            `${API}/Ticket`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTicket)
            }
        );

        if (!response.ok) {
            const errorText =
                await response.text();

            console.error(errorText);

            throw new Error(
                "Failed to create ticket"
            );
        }

        const createdTicket =
            await response.json();

        setTickets((currentTickets) => [
            ...currentTickets,
            createdTicket
        ]);

        setTitle("");
        setDescription("");
        setCategoryId(1);
        setPriorityId(1);
        setStatusId(1);

        alert(
            "Ticket created successfully!"
        );

    } catch (err) {
        console.error(
            "CREATE ERROR:",
            err
        );

        alert(
            "Failed to create ticket."
        );
    }
};


// =========================================================
// DELETE
// =========================================================

const deleteTicket = async (id) => {
    if (
        !window.confirm(
            "Are you sure you want to delete this ticket?"
        )
    ) {
        return;
    }

    try {
        const response = await fetch(
            `${API}/Ticket/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to delete ticket"
            );
        }

        setTickets(
            (currentTickets) =>
                currentTickets.filter(
                    (ticket) =>
                        ticket.id !== id
                )
        );

        alert(
            "Ticket deleted successfully!"
        );

    } catch (err) {
        console.error(
            "DELETE ERROR:",
            err
        );

        alert(
            "Failed to delete ticket."
        );
    }
};


// =========================================================
// UPDATE TICKET
// =========================================================

const updateTicket = async (ticket) => {
    const updatedTicket = {
        title: ticket.title,
        description: ticket.description,
        employeeId: ticket.employeeId,
        assignedAgentId:
            ticket.assignedAgentId,
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
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(
                    updatedTicket
                )
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to update ticket"
            );
        }

        const updatedData =
            await response.json();

        setTickets(
            (currentTickets) =>
                currentTickets.map((t) =>
                    t.id === ticket.id
                        ? updatedData
                        : t
                )
        );

        alert(
            "Ticket updated successfully!"
        );

    } catch (err) {
        console.error(
            "UPDATE ERROR:",
            err
        );

        alert(
            "Failed to update ticket."
        );
    }
};


// =========================================================
// ASSIGN TICKET
// =========================================================

const assignTicket = async (ticketId) => {
    try {
        const response = await fetch(
            `${API}/Ticket/assign/${ticketId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    assignedAgentId:
                        Number(agentId)
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to assign ticket"
            );
        }

        const data =
            await response.json();

        setTickets(
            (currentTickets) =>
                currentTickets.map(
                    (ticket) =>
                        ticket.id === ticketId
                            ? {
                                ...ticket,
                                assignedAgentId:
                                    Number(
                                        agentId
                                    )
                            }
                            : ticket
                )
        );

        alert(data.message);

    } catch (err) {
        console.error(
            "ASSIGN ERROR:",
            err
        );

        alert(
            "Failed to assign ticket."
        );
    }
};


// =========================================================
// UPDATE STATUS
// =========================================================

const updateTicketStatus = async (
    ticketId,
    newStatusId
) => {
    try {
        const response = await fetch(
            `${API}/Ticket/status/${ticketId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    statusId:
                        Number(newStatusId)
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to update status"
            );
        }

        const data =
            await response.json();

        setTickets(
            (currentTickets) =>
                currentTickets.map(
                    (ticket) =>
                        ticket.id === ticketId
                            ? {
                                ...ticket,
                                statusId:
                                    Number(
                                        newStatusId
                                    )
                            }
                            : ticket
                )
        );

        alert(data.message);

    } catch (err) {
        console.error(
            "STATUS ERROR:",
            err
        );

        alert(
            "Failed to update status."
        );
    }
};


// =========================================================
// ADD COMMENT
// =========================================================

const addComment = async (ticketId) => {
    if (!commentText.trim()) {
        alert(
            "Please enter a comment."
        );
        return;
    }

    try {
        const newComment = {
            comment: commentText,
            ticketId: ticketId,
            userId: userId
        };

        const response = await fetch(
            `${API}/Comment`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(
                    newComment
                )
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to add comment"
            );
        }

        const data =
            await response.json();

        setComments(
            (currentComments) => ({
                ...currentComments,
                [ticketId]: [
                    ...(currentComments[
                        ticketId
                    ] || []),
                    data.comment
                ]
            })
        );

        setCommentText("");

        alert(
            "Comment added successfully!"
        );

    } catch (err) {
        console.error(
            "COMMENT ERROR:",
            err
        );

        alert(
            "Failed to add comment."
        );
    }
};


// =========================================================
// LOAD COMMENTS
// =========================================================

const loadComments = async (ticketId) => {
    try {
        const response = await fetch(
            `${API}/Comment/ticket/${ticketId}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load comments"
            );
        }

        const data =
            await response.json();

        setComments(
            (currentComments) => ({
                ...currentComments,
                [ticketId]: data
            })
        );

    } catch (err) {
        console.error(
            "LOAD COMMENTS ERROR:",
            err
        );

        alert(
            "Failed to load comments."
        );
    }
};


// =========================================================
// LOAD HISTORY
// =========================================================

const loadHistory = async (ticketId) => {
    try {
        const response = await fetch(
            `${API}/Ticket/${ticketId}/history`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load history"
            );
        }

        const data =
            await response.json();

        setHistory(
            (currentHistory) => ({
                ...currentHistory,
                [ticketId]:
                    data.history || []
            })
        );

    } catch (err) {
        console.error(
            "LOAD HISTORY ERROR:",
            err
        );

        alert(
            "Failed to load history."
        );
    }
};


// =========================================================
// AI ANALYSIS
// =========================================================

const analyzeWithAI = async (ticket) => {
    try {
        setAiLoading(
            (previous) => ({
                ...previous,
                [ticket.id]: true
            })
        );

        const response = await fetch(
            `${API}/AI/analyze-ticket`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    title:
                        ticket.title || "",
                    description:
                        ticket.description ||
                        ""
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "AI analysis failed"
            );
        }

        setAiResults(
            (previous) => ({
                ...previous,
                [ticket.id]: data
            })
        );

    } catch (err) {
        console.error(
            "AI ERROR:",
            err
        );

        alert(
            err.message ||
            "AI analysis failed."
        );
    } finally {
        setAiLoading(
            (previous) => ({
                ...previous,
                [ticket.id]: false
            })
        );
    }
};


// =========================================================
// LOADING
// =========================================================

if (loading) {
    return (
        <div style={styles.page}>
            <div style={styles.loadingCard}>
                <div style={styles.loadingIcon}>
                    🎫
                </div>

                <h2>
                    Loading Tickets...
                </h2>

                <p>
                    Please wait while we load
                    your support tickets.
                </p>
            </div>
        </div>
    );
}


// =========================================================
// ERROR
// =========================================================

if (error) {
    return (
        <div style={styles.page}>
            <div style={styles.errorCard}>

                <div style={styles.errorIcon}>
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>{error}</p>

                <button
                    style={
                        styles.primaryButton
                    }
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>
        </div>
    );
}


// =========================================================
// PAGE
// =========================================================

return (
    <div style={styles.page}>

        {/* =================================================
                HEADER
            ================================================= */}

        <div style={styles.header}>

            <div>
                <p style={styles.eyebrow}>
                    IT HELP DESK
                </p>

                <h1 style={styles.pageTitle}>
                    Support Tickets
                </h1>

                <p style={styles.subtitle}>
                    Create, manage and monitor
                    support requests.
                </p>
            </div>

            <button
                style={styles.backButton}
                onClick={() =>
                    navigate(
                        "/dashboard"
                    )
                }
            >
                ← Dashboard
            </button>

        </div>


        {/* =================================================
                CREATE TICKET
            ================================================= */}

        <div style={styles.createCard}>

            <div style={styles.cardTitleRow}>

                <div>
                    <span
                        style={styles.cardIcon}
                    >
                        ＋
                    </span>
                </div>

                <div>
                    <h2
                        style={
                            styles.cardTitle
                        }
                    >
                        Create New Ticket
                    </h2>

                    <p
                        style={
                            styles.cardSubtitle
                        }
                    >
                        Submit a new IT support
                        request.
                    </p>
                </div>

            </div>

            <form
                onSubmit={createTicket}
            >

                <div style={styles.formSection}>

                    <label
                        style={
                            styles.label
                        }
                    >
                        Ticket Title
                    </label>

                    <input
                        style={
                            styles.input
                        }
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        placeholder="Enter a clear ticket title"
                        required
                    />

                </div>


                <div style={styles.formSection}>

                    <label
                        style={
                            styles.label
                        }
                    >
                        Description
                    </label>

                    <textarea
                        style={
                            styles.textarea
                        }
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        placeholder="Describe the problem in detail..."
                        required
                    />

                </div>


                <div style={styles.formGrid}>

                    <div>
                        <label
                            style={
                                styles.label
                            }
                        >
                            Category
                        </label>

                        <select
                            style={
                                styles.select
                            }
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(
                                    e.target.value
                                )
                            }
                        >
                            {categories.map(
                                (category) => (
                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {
                                            category.categoryName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>


                    <div>
                        <label
                            style={
                                styles.label
                            }
                        >
                            Priority
                        </label>

                        <select
                            style={
                                styles.select
                            }
                            value={priorityId}
                            onChange={(e) =>
                                setPriorityId(
                                    e.target.value
                                )
                            }
                        >
                            {priorities.map(
                                (priority) => (
                                    <option
                                        key={
                                            priority.id
                                        }
                                        value={
                                            priority.id
                                        }
                                    >
                                        {
                                            priority.priorityName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>


                    <div>
                        <label
                            style={
                                styles.label
                            }
                        >
                            Status
                        </label>

                        <select
                            style={
                                styles.select
                            }
                            value={statusId}
                            onChange={(e) =>
                                setStatusId(
                                    e.target.value
                                )
                            }
                        >
                            {statuses.map(
                                (status) => (
                                    <option
                                        key={
                                            status.id
                                        }
                                        value={
                                            status.id
                                        }
                                    >
                                        {
                                            status.statusName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                </div>


                <button
                    type="submit"
                    style={
                        styles.createButton
                    }
                >
                    + Create Ticket
                </button>

            </form>
        </div>


        {/* =================================================
                TICKETS HEADER
            ================================================= */}

        <div style={styles.listHeader}>

            <div>
                <h2
                    style={
                        styles.listTitle
                    }
                >
                    All Tickets
                </h2>

                <p
                    style={
                        styles.listSubtitle
                    }
                >
                    {tickets.length} ticket
                    {tickets.length !== 1
                        ? "s"
                        : ""}{" "}
                    in the system
                </p>
            </div>

            <div
                style={
                    styles.totalBadge
                }
            >
                {tickets.length}
            </div>

        </div>


        {/* =================================================
                NO TICKETS
            ================================================= */}

        {tickets.length === 0 ? (
            <div style={styles.emptyCard}>

                <div style={styles.emptyIcon}>
                    🎫
                </div>

                <h3>
                    No tickets found
                </h3>

                <p>
                    Create your first support
                    ticket above.
                </p>

            </div>
        ) : (

            tickets.map((ticket) => {

                const ai =
                    aiResults[ticket.id];

                return (

                    <div
                        key={ticket.id}
                        style={
                            styles.ticketCard
                        }
                    >

                        {/* TICKET HEADER */}

                        <div
                            style={
                                styles.ticketHeader
                            }
                        >

                            <div
                                style={
                                    styles.ticketHeading
                                }
                            >

                                <span
                                    style={
                                        styles.ticketNumber
                                    }
                                >
                                    #{ticket.id}
                                </span>

                                <h2
                                    style={
                                        styles.ticketTitle
                                    }
                                >
                                    {ticket.title}
                                </h2>

                                <p
                                    style={
                                        styles.ticketDescription
                                    }
                                >
                                    {
                                        ticket.description
                                    }
                                </p>

                            </div>


                            <div
                                style={
                                    styles.statusBadge
                                }
                            >
                                Status #
                                {ticket.statusId}
                            </div>

                        </div>


                        {/* TICKET META */}

                        <div
                            style={
                                styles.metaGrid
                            }
                        >

                            <div
                                style={
                                    styles.metaItem
                                }
                            >
                                <span>
                                    Category
                                </span>

                                <strong>
                                    #
                                    {
                                        ticket.categoryId
                                    }
                                </strong>
                            </div>

                            <div
                                style={
                                    styles.metaItem
                                }
                            >
                                <span>
                                    Priority
                                </span>

                                <strong>
                                    #
                                    {
                                        ticket.priorityId
                                    }
                                </strong>
                            </div>

                            <div
                                style={
                                    styles.metaItem
                                }
                            >
                                <span>
                                    Assigned Agent
                                </span>

                                <strong>
                                    {
                                        ticket.assignedAgentId
                                            ? `Agent #${ticket.assignedAgentId}`
                                            : "Unassigned"
                                    }
                                </strong>
                            </div>

                        </div>


                        {/* AI */}

                        <div
                            style={
                                styles.aiBox
                            }
                        >

                            <div
                                style={
                                    styles.aiHeader
                                }
                            >

                                <div>
                                    <div
                                        style={
                                            styles.aiTitleRow
                                        }
                                    >
                                        <span
                                            style={
                                                styles.aiIcon
                                            }
                                        >
                                            🤖
                                        </span>

                                        <h3
                                            style={
                                                styles.aiTitle
                                            }
                                        >
                                            AI Analysis
                                        </h3>
                                    </div>

                                    <p
                                        style={
                                            styles.aiSubtitle
                                        }
                                    >
                                        AI-powered
                                        category,
                                        priority and
                                        troubleshooting
                                        analysis.
                                    </p>
                                </div>


                                <button
                                    style={
                                        aiLoading[
                                            ticket.id
                                        ]
                                            ? styles.aiDisabledButton
                                            : styles.aiButton
                                    }
                                    onClick={() =>
                                        analyzeWithAI(
                                            ticket
                                        )
                                    }
                                    disabled={
                                        aiLoading[
                                        ticket.id
                                        ]
                                    }
                                >
                                    {
                                        aiLoading[
                                            ticket.id
                                        ]
                                            ? "Analyzing..."
                                            : "🤖 Analyze with AI"
                                    }
                                </button>

                            </div>


                            {ai && (
                                <div
                                    style={
                                        styles.aiResult
                                    }
                                >

                                    <div
                                        style={
                                            styles.aiGrid
                                        }
                                    >

                                        <div
                                            style={
                                                styles.aiItem
                                            }
                                        >
                                            <span>
                                                Category
                                            </span>

                                            <strong>
                                                {
                                                    ai.category
                                                }
                                            </strong>
                                        </div>


                                        <div
                                            style={
                                                styles.aiItem
                                            }
                                        >
                                            <span>
                                                Priority
                                            </span>

                                            <strong>
                                                {
                                                    ai.priority
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    <div
                                        style={
                                            styles.aiText
                                        }
                                    >
                                        <strong>
                                            📝 Summary
                                        </strong>

                                        <p>
                                            {
                                                ai.summary
                                            }
                                        </p>
                                    </div>


                                    <div
                                        style={
                                            styles.aiText
                                        }
                                    >
                                        <strong>
                                            🛠️ Troubleshooting
                                        </strong>

                                        <p>
                                            {
                                                ai.suggestion
                                            }
                                        </p>
                                    </div>

                                </div>
                            )}

                        </div>


                        {/* DIVIDER */}

                        <div
                            style={
                                styles.divider
                            }
                        />


                        {/* ASSIGN */}

                        <div
                            style={
                                styles.actionSection
                            }
                        >

                            <h3
                                style={
                                    styles.actionTitle
                                }
                            >
                                👤 Assign Agent
                            </h3>

                            <div
                                style={
                                    styles.actionRow
                                }
                            >

                                <input
                                    type="number"
                                    style={
                                        styles.smallInput
                                    }
                                    value={
                                        agentId
                                    }
                                    onChange={(e) =>
                                        setAgentId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Agent ID"
                                />

                                <button
                                    style={
                                        styles.secondaryAction
                                    }
                                    onClick={() =>
                                        assignTicket(
                                            ticket.id
                                        )
                                    }
                                >
                                    Assign
                                </button>

                            </div>

                        </div>


                        {/* STATUS */}

                        <div
                            style={
                                styles.actionSection
                            }
                        >

                            <h3
                                style={
                                    styles.actionTitle
                                }
                            >
                                🔄 Change Status
                            </h3>

                            <select
                                style={
                                    styles.select
                                }
                                value={
                                    ticket.statusId
                                }
                                onChange={(e) =>
                                    updateTicketStatus(
                                        ticket.id,
                                        e.target.value
                                    )
                                }
                            >
                                {statuses.map(
                                    (status) => (
                                        <option
                                            key={
                                                status.id
                                            }
                                            value={
                                                status.id
                                            }
                                        >
                                            {
                                                status.statusName
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                        </div>


                        {/* COMMENTS */}

                        <div
                            style={
                                styles.actionSection
                            }
                        >

                            <h3
                                style={
                                    styles.actionTitle
                                }
                            >
                                💬 Comments
                            </h3>

                            <textarea
                                style={
                                    styles.commentTextarea
                                }
                                value={
                                    commentText
                                }
                                onChange={(e) =>
                                    setCommentText(
                                        e.target.value
                                    )
                                }
                                placeholder="Write a comment..."
                            />

                            <div
                                style={
                                    styles.actionRow
                                }
                            >

                                <button
                                    style={
                                        styles.secondaryAction
                                    }
                                    onClick={() =>
                                        addComment(
                                            ticket.id
                                        )
                                    }
                                >
                                    Add Comment
                                </button>

                                <button
                                    style={
                                        styles.outlineButton
                                    }
                                    onClick={() =>
                                        loadComments(
                                            ticket.id
                                        )
                                    }
                                >
                                    Load Comments
                                </button>

                            </div>


                            {comments[
                                ticket.id
                            ]?.map(
                                (comment) => (
                                    <div
                                        key={
                                            comment.id
                                        }
                                        style={
                                            styles.comment
                                        }
                                    >
                                        <p>
                                            {
                                                comment.comment
                                            }
                                        </p>

                                        <small>
                                            {
                                                comment.createdAt
                                            }
                                        </small>
                                    </div>
                                )
                            )}

                        </div>


                        {/* HISTORY */}

                        <div
                            style={
                                styles.actionSection
                            }
                        >

                            <h3
                                style={
                                    styles.actionTitle
                                }
                            >
                                📋 Ticket History
                            </h3>

                            <button
                                style={
                                    styles.outlineButton
                                }
                                onClick={() =>
                                    loadHistory(
                                        ticket.id
                                    )
                                }
                            >
                                Load History
                            </button>


                            {history[
                                ticket.id
                            ]?.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        style={
                                            styles.historyItem
                                        }
                                    >

                                        <strong>
                                            {
                                                item.action
                                            }
                                        </strong>

                                        <p>
                                            User:{" "}
                                            {
                                                item.user
                                            }
                                        </p>

                                        <small>
                                            {
                                                item.createdAt
                                            }
                                        </small>

                                    </div>
                                )
                            )}

                        </div>


                        {/* BUTTONS */}

                        <div
                            style={
                                styles.buttonRow
                            }
                        >

                            <button
                                style={
                                    styles.viewButton
                                }
                                onClick={() =>
                                    navigate(
                                        `/tickets/${ticket.id}`
                                    )
                                }
                            >
                                View Details
                            </button>

                            <button
                                style={
                                    styles.updateButton
                                }
                                onClick={() =>
                                    updateTicket(
                                        ticket
                                    )
                                }
                            >
                                Update
                            </button>

                            <button
                                style={
                                    styles.deleteButton
                                }
                                onClick={() =>
                                    deleteTicket(
                                        ticket.id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                );
            })
        )}

    </div>
);
}


// =============================================================
// STYLES
// =============================================================

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "35px",
        fontFamily:
            "Arial, Helvetica, sans-serif",
        color: "#0f172a"
    },

    header: {
        maxWidth: "1100px",
        margin:
            "0 auto 30px",
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center",
        gap: "20px"
    },

    eyebrow: {
        margin: 0,
        fontSize: "12px",
        fontWeight: "bold",
        letterSpacing: "1.5px",
        color: "#64748b"
    },

    pageTitle: {
        margin:
            "5px 0 0",
        fontSize: "34px",
        fontWeight: "700",
        color: "#0f172a"
    },

    subtitle: {
        margin:
            "8px 0 0",
        color: "#64748b",
        fontSize: "15px"
    },

    backButton: {
        padding:
            "11px 18px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "9px",
        cursor: "pointer",
        backgroundColor: "#ffffff",
        color: "#334155",
        fontWeight: "bold",
        fontSize: "14px"
    },

    createCard: {
        maxWidth: "1100px",
        margin:
            "0 auto 35px",
        backgroundColor:
            "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)"
    },

    cardTitleRow: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "25px"
    },

    cardIcon: {
        width: "42px",
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        backgroundColor: "#dbeafe",
        color: "#2563eb",
        fontSize: "25px",
        fontWeight: "bold"
    },

    cardTitle: {
        margin: 0,
        fontSize: "22px"
    },

    cardSubtitle: {
        margin:
            "5px 0 0",
        color: "#64748b",
        fontSize: "14px"
    },

    formSection: {
        marginBottom: "18px"
    },

    label: {
        display: "block",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#334155",
        marginBottom: "7px"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "9px",
        fontSize: "15px",
        outline: "none"
    },

    textarea: {
        width: "100%",
        minHeight: "110px",
        boxSizing: "border-box",
        padding: "13px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "9px",
        fontSize: "15px",
        resize: "vertical",
        fontFamily:
            "Arial, sans-serif",
        outline: "none"
    },

    commentTextarea: {
        width: "100%",
        minHeight: "80px",
        boxSizing: "border-box",
        padding: "13px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "9px",
        fontSize: "14px",
        resize: "vertical",
        fontFamily:
            "Arial, sans-serif"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
    },

    select: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "9px",
        backgroundColor:
            "#ffffff",
        fontSize: "14px",
        color: "#334155"
    },

    createButton: {
        padding:
            "12px 20px",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        backgroundColor:
            "#2563eb",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "14px"
    },

    listHeader: {
        maxWidth: "1100px",
        margin:
            "0 auto 18px",
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center"
    },

    listTitle: {
        margin: 0,
        fontSize: "24px"
    },

    listSubtitle: {
        margin:
            "5px 0 0",
        color: "#64748b",
        fontSize: "14px"
    },

    totalBadge: {
        minWidth: "40px",
        height: "40px",
        padding:
            "0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
            "#dbeafe",
        color: "#1d4ed8",
        borderRadius: "20px",
        fontWeight: "bold"
    },

    ticketCard: {
        maxWidth: "1100px",
        margin:
            "0 auto 22px",
        backgroundColor:
            "#ffffff",
        padding: "28px",
        borderRadius: "16px",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)"
    },

    ticketHeader: {
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },

    ticketHeading: {
        flex: 1
    },

    ticketNumber: {
        display: "inline-block",
        marginBottom: "6px",
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: "13px"
    },

    ticketTitle: {
        margin:
            "0 0 8px",
        fontSize: "22px",
        color: "#0f172a"
    },

    ticketDescription: {
        margin: 0,
        color: "#64748b",
        lineHeight: "1.6"
    },

    statusBadge: {
        padding:
            "8px 13px",
        backgroundColor:
            "#dbeafe",
        color: "#1d4ed8",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        whiteSpace:
            "nowrap"
    },

    metaGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginTop: "22px"
    },

    metaItem: {
        padding: "14px",
        backgroundColor:
            "#f8fafc",
        border:
            "1px solid #e2e8f0",
        borderRadius: "9px",
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },

    aiBox: {
        marginTop: "24px",
        padding: "20px",
        backgroundColor:
            "#faf5ff",
        border:
            "1px solid #e9d5ff",
        borderRadius: "12px"
    },

    aiHeader: {
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center",
        gap: "20px"
    },

    aiTitleRow: {
        display: "flex",
        alignItems: "center",
        gap: "9px"
    },

    aiIcon: {
        fontSize: "21px"
    },

    aiTitle: {
        margin: 0,
        fontSize: "18px",
        color: "#581c87"
    },

    aiSubtitle: {
        margin:
            "6px 0 0",
        color: "#7e22ce",
        fontSize: "13px"
    },

    aiButton: {
        padding:
            "11px 17px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#7c3aed",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "13px"
    },

    aiDisabledButton: {
        padding:
            "11px 17px",
        border: "none",
        borderRadius: "8px",
        backgroundColor:
            "#c4b5fd",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "13px"
    },

    aiResult: {
        marginTop: "18px",
        padding: "18px",
        backgroundColor:
            "#ffffff",
        border:
            "1px solid #e9d5ff",
        borderRadius: "10px"
    },

    aiGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginBottom: "16px"
    },

    aiItem: {
        padding: "13px",
        backgroundColor:
            "#faf5ff",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },

    aiText: {
        marginTop: "14px",
        color: "#334155",
        lineHeight: "1.6"
    },

    divider: {
        height: "1px",
        backgroundColor:
            "#e2e8f0",
        margin:
            "25px 0"
    },

    actionSection: {
        marginBottom: "24px"
    },

    actionTitle: {
        margin:
            "0 0 12px",
        fontSize: "16px",
        color: "#334155"
    },

    actionRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap"
    },

    smallInput: {
        width: "130px",
        boxSizing: "border-box",
        padding: "10px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "8px"
    },

    secondaryAction: {
        padding:
            "10px 16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#2563eb",
        color: "#ffffff",
        fontWeight: "bold"
    },

    outlineButton: {
        padding:
            "10px 16px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#ffffff",
        color: "#334155",
        fontWeight: "bold"
    },

    comment: {
        marginTop: "10px",
        padding: "13px",
        backgroundColor:
            "#f8fafc",
        border:
            "1px solid #e2e8f0",
        borderRadius: "8px"
    },

    historyItem: {
        marginTop: "10px",
        padding: "13px",
        backgroundColor:
            "#f8fafc",
        border:
            "1px solid #e2e8f0",
        borderRadius: "8px"
    },

    buttonRow: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        paddingTop: "5px"
    },

    viewButton: {
        padding:
            "10px 17px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#2563eb",
        color: "#ffffff",
        fontWeight: "bold"
    },

    updateButton: {
        padding:
            "10px 17px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#0f766e",
        color: "#ffffff",
        fontWeight: "bold"
    },

    deleteButton: {
        padding:
            "10px 17px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#dc2626",
        color: "#ffffff",
        fontWeight: "bold"
    },

    loadingCard: {
        maxWidth: "500px",
        margin: "100px auto",
        padding: "40px",
        backgroundColor:
            "#ffffff",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)"
    },

    loadingIcon: {
        fontSize: "40px"
    },

    emptyCard: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "50px",
        backgroundColor:
            "#ffffff",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)"
    },

    emptyIcon: {
        fontSize: "45px"
    },

    errorCard: {
        maxWidth: "500px",
        margin: "100px auto",
        padding: "40px",
        backgroundColor:
            "#ffffff",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)"
    },

    errorIcon: {
        fontSize: "40px",
        marginBottom: "10px"
    },

    primaryButton: {
        padding:
            "11px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor:
            "#2563eb",
        color: "#ffffff",
        fontWeight: "bold"
    }
};

export default Tickets;

