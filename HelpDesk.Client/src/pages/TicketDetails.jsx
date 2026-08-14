import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TicketDetails() {

    const { id } = useParams();

    const API = "https://localhost:7069/api";

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                // Load Ticket
                const ticketResponse = await fetch(
                    `${API}/Ticket/${id}`
                );

                if (!ticketResponse.ok) {
                    throw new Error("Failed to load ticket");
                }

                const ticketData = await ticketResponse.json();

                setTicket(ticketData);


                // Load Comments
                const commentsResponse = await fetch(
                    `${API}/Comment/ticket/${id}`
                );

                if (!commentsResponse.ok) {
                    throw new Error("Failed to load comments");
                }

                const commentsData = await commentsResponse.json();

                setComments(commentsData);


                // Load History
                const historyResponse = await fetch(
                    `${API}/Ticket/${id}/history`
                );

                if (!historyResponse.ok) {
                    throw new Error("Failed to load history");
                }

                const historyData = await historyResponse.json();

                setHistory(historyData.history ?? []);

            } catch (error) {

                console.error("Error:", error);

                setError(error.message);

            }
        };

        loadData();

    }, [id]);


    if (error) {

        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );

    }


    if (!ticket) {

        return <h2>Loading...</h2>;

    }


    return (

        <div>

            <h1>Ticket #{ticket.id}</h1>

            <h2>{ticket.title}</h2>

            <p>{ticket.description}</p>

            <p>
                Status ID: {ticket.statusId}
            </p>

            <hr />

            <h2>Comments</h2>

            {comments.length === 0 ? (

                <p>No comments yet.</p>

            ) : (

                comments.map((comment) => (

                    <div key={comment.id}>

                        <p>
                            {comment.comment}
                        </p>

                        <small>
                            {comment.createdAt}
                        </small>

                        <hr />

                    </div>

                ))

            )}


            <h2>History</h2>

            {history.length === 0 ? (

                <p>No history found.</p>

            ) : (

                history.map((item, index) => (

                    <div key={index}>

                        <p>
                            {item.action}
                        </p>

                        <small>
                            {item.createdAt}
                        </small>

                        <hr />

                    </div>

                ))

            )}

        </div>

    );
}

export default TicketDetails;
