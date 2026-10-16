import { useEffect, useState } from "react";
import { deleteCourse, getCourses } from "../services/courseService";
import {
    deleteUser,
    getAnalytics,
    getUsers,
    updateUserRole
} from "../services/adminService";

function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const load = async () => {
        const [stats, people, catalog] = await Promise.all([
            getAnalytics(),
            getUsers(),
            getCourses()
        ]);
        setAnalytics(stats);
        setUsers(people);
        setCourses(catalog);
    };

    useEffect(() => {
        load().catch((err) => {
            setError(err.response?.data?.message || "Could not load the admin dashboard.");
        });
    }, []);

    const handleRole = async (id, role) => {
        setError("");
        setMessage("");

        try {
            const updated = await updateUserRole(id, role);
            setUsers((current) =>
                current.map((person) =>
                    person._id === id ? { ...person, role: updated.role } : person
                )
            );
            setMessage("User role updated.");
            setAnalytics(await getAnalytics());
        } catch (err) {
            setError(err.response?.data?.message || "Could not update that role.");
        }
    };

    const handleDeleteUser = async (id) => {
        setError("");
        setMessage("");

        try {
            await deleteUser(id);
            setUsers((current) => current.filter((person) => person._id !== id));
            setMessage("User deleted.");
            setAnalytics(await getAnalytics());
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete that user.");
        }
    };

    const handleDeleteCourse = async (id) => {
        setError("");
        setMessage("");

        try {
            await deleteCourse(id);
            setCourses((current) => current.filter((course) => course._id !== id));
            setMessage("Course deleted.");
            setAnalytics(await getAnalytics());
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete that course.");
        }
    };

    return (
        <div className="page">
            <h1>Admin dashboard</h1>
            <p>Manage users and courses, and review LearnHub activity.</p>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            {analytics && (
                <div className="stats">
                    <article className="stat">
                        <h2>{analytics.users}</h2>
                        <p>Users</p>
                    </article>
                    <article className="stat">
                        <h2>{analytics.courses}</h2>
                        <p>Courses</p>
                    </article>
                    <article className="stat">
                        <h2>{analytics.enrollments}</h2>
                        <p>Enrollments</p>
                    </article>
                    <article className="stat">
                        <h2>{analytics.byRole.student}</h2>
                        <p>Students</p>
                    </article>
                    <article className="stat">
                        <h2>{analytics.byRole.instructor}</h2>
                        <p>Instructors</p>
                    </article>
                    <article className="stat">
                        <h2>{analytics.byRole.admin}</h2>
                        <p>Admins</p>
                    </article>
                </div>
            )}

            <h2>Users</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((person) => (
                        <tr key={person._id}>
                            <td>{person.name}</td>
                            <td>{person.email}</td>
                            <td>
                                <select
                                    value={person.role}
                                    onChange={(event) => handleRole(person._id, event.target.value)}
                                >
                                    <option value="student">student</option>
                                    <option value="instructor">instructor</option>
                                    <option value="admin">admin</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="danger"
                                    onClick={() => handleDeleteUser(person._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Courses</h2>
            {courses.length === 0 && <p>No courses yet.</p>}
            {courses.map((course) => (
                <article className="course-card" key={course._id}>
                    <h3>{course.title}</h3>
                    <p>
                        {course.category} · {course.instructor?.name || "Instructor"} · Rs. {course.price}
                    </p>
                    <button type="button" className="danger" onClick={() => handleDeleteCourse(course._id)}>
                        Delete course
                    </button>
                </article>
            ))}
        </div>
    );
}

export default AdminDashboard;
