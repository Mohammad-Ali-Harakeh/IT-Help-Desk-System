
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./pages/Dashboard.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Notifications from "./pages/Notifications.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/tickets"
                    element={<Tickets />}
                />

                <Route
                    path="/tickets/:id"
                    element={<TicketDetails />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
