import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./pages/Dashboard.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Notifications from "./pages/Notifications.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";

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