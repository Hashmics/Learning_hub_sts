import { Link } from "react-router-dom";
import { dashboardPath, useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>
            <Link to="/" className="brand">
                <h2>LearnHub</h2>
            </Link>

            <div>
                <Link to="/">Home</Link>
                <Link to="/courses">Courses</Link>
                {user ? (
                    <>
                        <Link to={dashboardPath(user.role)}>Dashboard</Link>
                        <span>
                            {user.name} ({user.role})
                        </span>
                        <button type="button" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
