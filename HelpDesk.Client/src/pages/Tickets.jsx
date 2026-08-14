import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tickets() {

    const navigate = useNavigate();

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

    const API = "https://localhost:7069/api"; 


    useEffect(() => {
        const loadData = async () => {
            try {

                const categoryResponse = await fetch(`${API}/Category`);
                const categoryData = await categoryResponse.json();

                const priorityResponse = await fetch(`${API}/Priority`);
                const priorityData = await priorityResponse.json();

                const statusResponse = await fetch(`${API}/Status`);
                const statusData = await statusResponse.json();

                const ticketResponse = await fetch(`${API}/Ticket`);
                const ticketData = await ticketResponse.json();


                setCategories(categoryData);
                setPriorities(priorityData);
                setStatuses(statusData);
                setTickets(ticketData);


            } catch (error) {
                console.error("ERROR:", error);
            }
        };


        loadData();

    }, []);



    const createTicket = async (e) => {

        e.preventDefault();


        const newTicket = {

            title,
            description,
            employeeId: 1,
            assignedAgentId: 1,
            categoryId: Number(categoryId),
            priorityId: Number(priorityId),
            statusId: Number(statusId)

        };


        try {

            const response = await fetch(`${API}/Ticket`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(newTicket)

            });


            const createdTicket = await response.json();


            setTickets([
                ...tickets,
                createdTicket
            ]);


            setTitle("");
            setDescription("");


        } catch (error) {

            console.error(error);

        }

    };




    const deleteTicket = async (id) => {

        try {

            await fetch(`${API}/Ticket/${id}`, {

                method: "DELETE"

            });


            setTickets(
                tickets.filter(ticket => ticket.id !== id)
            );


        } catch (error) {

            console.error(error);

        }

    };




    const updateTicket = async (ticket) => {


        const updatedTicket = {

            title: `${ticket.title} - Updated`,
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


            const updatedData = await response.json();



            setTickets(
                tickets.map(t =>
                    t.id === ticket.id
                        ? updatedData
                        : t
                )
            );


        } catch (error) {

            console.error(error);

        }

    };
    const assignTicket = async (ticketId) => {

        try {

            const response = await fetch(`${API}/Ticket/assign/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    assignedAgentId: Number(agentId)
                })
            });

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

        } catch (error) {

            console.error("Error assigning ticket:", error);

        }
    };
    const updateTicketStatus = async (ticketId, newStatusId) => {

        try {

            const response = await fetch(`${API}/Ticket/status/${ticketId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    statusId: Number(newStatusId)
                })

            });

            if (!response.ok) {
                throw new Error("Failed to update ticket status");
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

        } catch (error) {

            console.error("Error updating ticket status:", error);

        }

    };
    const addComment = async (ticketId) => {

        if (!commentText.trim()) {
            alert("Please enter a comment");
            return;
        }

        try {

            const newComment = {
                comment: commentText,
                ticketId: ticketId,
                userId: 1
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

            alert("Comment added successfully");

        } catch (error) {

            console.error("Error adding comment:", error);

        }
    };
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

        } catch (error) {

            console.error("Error loading comments:", error);

        }
    };
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
                [ticketId]: data.history
            }));

        } catch (error) {

            console.error("Error loading history:", error);

        }
    };
    return (

        <div>

            <h1>Tickets</h1>



            <h2>Create Ticket</h2>


            <form onSubmit={createTicket}>


                <input

                    value={title}

                    onChange={(e) => setTitle(e.target.value)}

                    placeholder="Title"

                    required

                />


                <br /><br />


                <textarea

                    value={description}

                    onChange={(e) => setDescription(e.target.value)}

                    placeholder="Description"

                    required

                />


                <br /><br />



                <select

                    value={categoryId}

                    onChange={(e) => setCategoryId(e.target.value)}

                >

                    {
                        categories.map(category => (

                            <option

                                key={category.id}

                                value={category.id}

                            >

                                {category.categoryName}

                            </option>

                        ))
                    }


                </select>


                <br /><br />



                <select

                    value={priorityId}

                    onChange={(e) => setPriorityId(e.target.value)}

                >

                    {
                        priorities.map(priority => (

                            <option

                                key={priority.id}

                                value={priority.id}

                            >

                                {priority.priorityName}

                            </option>

                        ))
                    }


                </select>



                <br /><br />



                <select

                    value={statusId}

                    onChange={(e) => setStatusId(e.target.value)}

                >

                    {
                        statuses.map(status => (

                            <option

                                key={status.id}

                                value={status.id}

                            >

                                {status.statusName}

                            </option>

                        ))
                    }

                </select>



                <br /><br />



                <button type="submit">

                    Create Ticket

                </button>


            </form>




            <hr />




            <h2>All Tickets</h2>



            {

                tickets.map(ticket => (


                    <div key={ticket.id}>


                        <h3>

                            #{ticket.id} - {ticket.title}

                        </h3>



                        <p>

                            {ticket.description}

                        </p>



                        <p>

                            Status ID: {ticket.statusId}

                        </p>
                        <hr />

                        <h4>Assign Agent</h4>

                        <input
                            type="number"
                            value={agentId}
                            onChange={(e) => setAgentId(e.target.value)}
                            placeholder="Agent ID"
                        />

                        <button onClick={() => assignTicket(ticket.id)}>
                            Assign
                        </button>


                        <h4>Change Status</h4>

                        <select
                            value={ticket.statusId}
                            onChange={(e) =>
                                updateTicketStatus(ticket.id, e.target.value)
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


                        <h4>Add Comment</h4>

                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                        />

                        <br />

                        <button onClick={() => addComment(ticket.id)}>
                            Add Comment
                        </button>


                        <h4>Comments</h4>

                        <button onClick={() => loadComments(ticket.id)}>
                            Load Comments
                        </button>

                        {comments[ticket.id]?.map((comment) => (
                            <div key={comment.id}>

                                <p>
                                    {comment.comment}
                                </p>

                                <small>
                                    {comment.createdAt}
                                </small>

                                <hr />

                            </div>
                        ))}


                        <h4>Ticket History</h4>

                        <button onClick={() => loadHistory(ticket.id)}>
                            Load History
                        </button>

                        {history[ticket.id]?.map((item, index) => (
                            <div key={index}>

                                <p>
                                    <strong>{item.action}</strong>
                                </p>

                                <p>
                                    User: {item.user}
                                </p>

                                <small>
                                    {item.createdAt}
                                </small>

                                <hr />

                            </div>
                        ))}
                        <select
                            value={ticket.statusId}
                            onChange={(e) =>
                                updateTicketStatus(ticket.id, e.target.value)
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
                       

                        <button

                            onClick={() => updateTicket(ticket)}

                        >

                            Update

                        </button>



                        <button

                            onClick={() => deleteTicket(ticket.id)}

                        >

                            Delete

                        </button>
                        <br /><br />

                        <input
                            type="number"
                            value={agentId}
                            onChange={(e) => setAgentId(e.target.value)}
                            placeholder="Agent ID"
                        />

                        <button onClick={() => assignTicket(ticket.id)}>
                            Assign
                        </button>


                        {/* Assignment 5 */}

                        <button

                            onClick={() => navigate(`/tickets/${ticket.id}`)}

                        >

                            View Details

                        </button>



                        <hr />

                    </div>


                ))

            }



        </div>

    );

}


export default Tickets;  