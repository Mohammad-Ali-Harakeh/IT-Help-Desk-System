import { useEffect, useState } from "react";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://it-help-desk-api-7iqa.onrender.com/api/Notification/user/1")
            .then((response) => response.json())
            .then((data) => {
                console.log("NOTIFICATIONS:", data);
                setNotifications(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("ERROR:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Loading notifications...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>🔔 Notifications</h1>

            {notifications.length === 0 ? (
                <h2>No notifications</h2>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{
                            padding: "20px",
                            marginBottom: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            backgroundColor: notification.isRead
                                ? "white"
                                : "#eef6ff"
                        }}
                    >
                        <h3>{notification.message}</h3>

                        <p>
                            {new Date(
                                notification.createdAt
                            ).toLocaleString()}
                        </p>

                        {!notification.isRead && (
                            <strong>NEW</strong>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Notifications; 
