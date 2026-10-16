import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCourses, updateProgress } from "../services/enrollmentService";

function StudentDashboard() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMyCourses();
                setEnrollments(data);
            } catch (err) {
                setError(err.response?.data?.message || "Could not load your courses.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleProgress = async (enrollmentId, progress) => {
        setError("");
        setMessage("");

        try {
            const updated = await updateProgress(enrollmentId, Number(progress));
            setEnrollments((current) =>
                current.map((item) => (item._id === updated._id ? updated : item))
            );
            setMessage("Progress saved.");
        } catch (err) {
            setError(err.response?.data?.message || "Could not save progress.");
        }
    };

    return (
        <div className="page">
            <h1>Student dashboard</h1>
            <p>These are the courses you are enrolled in.</p>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading your courses...</p>}

            {!loading && enrollments.length === 0 && (
                <p>
                    You have not enrolled in a course yet. <Link to="/courses">Browse courses</Link>
                </p>
            )}

            <div className="course-grid">
                {enrollments.map((enrollment) => (
                    <article className="course-card" key={enrollment._id}>
                        <p className="category">{enrollment.course?.category}</p>
                        <h2>
                            <Link to={`/courses/${enrollment.course?._id}`}>
                                {enrollment.course?.title || "Course removed"}
                            </Link>
                        </h2>
                        <p>Instructor: {enrollment.course?.instructor?.name || "Instructor"}</p>
                        <label>
                            Progress: {enrollment.progress}%
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={enrollment.progress}
                                onChange={(event) =>
                                    setEnrollments((current) =>
                                        current.map((item) =>
                                            item._id === enrollment._id
                                                ? { ...item, progress: Number(event.target.value) }
                                                : item
                                        )
                                    )
                                }
                                onMouseUp={(event) =>
                                    handleProgress(enrollment._id, event.target.value)
                                }
                                onTouchEnd={(event) =>
                                    handleProgress(enrollment._id, event.target.value)
                                }
                            />
                        </label>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default StudentDashboard;
