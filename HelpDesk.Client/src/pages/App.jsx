import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import ProtectedRoute from "./ProtectedRoute";
import Notifications from "./pages/Notifications";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute>
                            <Tickets />
                        </ProtectedRoute>
                    }
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