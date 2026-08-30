
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Tickets from "./Tickets.jsx";
import TicketDetails from "./TicketDetails.jsx";
import Notifications from "./Notifications.jsx";
import AIAssistant from "./AIAssistant.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* LOGIN */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* TICKETS */}
                <Route
                    path="/tickets"
                    element={<Tickets />}
                />

                {/* TICKET DETAILS */}
                <Route
                    path="/tickets/:id"
                    element={<TicketDetails />}
                />

                {/* NOTIFICATIONS */}
                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                {/* AI ASSISTANT */}
                <Route
                    path="/ai"
                    element={<AIAssistant />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;

