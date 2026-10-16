import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Forbidden() {
    return (
        <div className="page">
            <h1>Access denied</h1>
            <p>Your account does not have permission to open this page.</p>
        </div>
    );
}

function ProtectedRoute({ roles, children }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ message: "Please log in to continue." }}
            />
        );
    }

    if (roles && !roles.includes(user.role)) {
        return <Forbidden />;
    }

    return children;
}

export default ProtectedRoute;
