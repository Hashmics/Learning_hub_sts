import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteCourse, getCourseById, updateCourse } from "../services/courseService";
import { enrollInCourse, getMyCourses } from "../services/enrollmentService";

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editing, setEditing] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        price: ""
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id);
                setCourse(data);
                setForm({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    price: data.price
                });
            } catch (err) {
                setError("Course details could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (user?.role !== "student") {
            return;
        }

        getMyCourses()
            .then((rows) => {
                setEnrolled(rows.some((row) => String(row.course?._id) === String(id)));
            })
            .catch(() => {});
    }, [user, id]);

    const instructorId = course?.instructor?._id || course?.instructor;
    const isOwner = user && instructorId && String(user.id) === String(instructorId);

    const handleEnroll = async () => {
        setError("");
        setMessage("");

        try {
            const data = await enrollInCourse(id);
            setEnrolled(true);
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Could not enroll.");
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const updated = await updateCourse(id, {
                ...form,
                price: Number(form.price)
            });
            setCourse({
                ...updated,
                lessons: updated.lessons || course.lessons || []
            });
            setEditing(false);
            setMessage("Course updated.");
        } catch (err) {
            setError(err.response?.data?.message || "Could not update the course.");
        }
    };

    const handleDelete = async () => {
        setError("");

        try {
            await deleteCourse(id);
            navigate("/courses");
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete the course.");
        }
    };

    if (loading) {
        return <p className="page">Loading course details...</p>;
    }

    if (error && !course) {
        return <p className="page error">{error}</p>;
    }

    if (!course) {
        return <p className="page">Course not found.</p>;
    }

    return (
        <div className="page">
            <p className="category">{course.category}</p>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <p>
                <strong>Instructor:</strong> {course.instructor?.name}
            </p>
            <p className="price">Rs. {course.price}</p>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            {user?.role === "student" && !enrolled && (
                <button type="button" onClick={handleEnroll}>
                    Enroll
                </button>
            )}

            {enrolled && <p className="badge">You are enrolled in this course.</p>}

            {!user && (
                <p>
                    <Link to="/login">Log in</Link> as a student to enroll.
                </p>
            )}

            {isOwner && !editing && (
                <div className="actions">
                    <button type="button" onClick={() => setEditing(true)}>
                        Edit course
                    </button>
                    <button type="button" className="danger" onClick={handleDelete}>
                        Delete course
                    </button>
                </div>
            )}

            {editing && (
                <form className="course-form" onSubmit={handleUpdate}>
                    <h2>Edit course</h2>
                    <label>
                        Title
                        <input
                            value={form.title}
                            onChange={(event) =>
                                setForm({ ...form, title: event.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            value={form.description}
                            onChange={(event) =>
                                setForm({ ...form, description: event.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        Category
                        <input
                            value={form.category}
                            onChange={(event) =>
                                setForm({ ...form, category: event.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        Price (Rs.)
                        <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(event) =>
                                setForm({ ...form, price: event.target.value })
                            }
                            required
                        />
                    </label>
                    <div className="actions">
                        <button type="submit">Save changes</button>
                        <button type="button" onClick={() => setEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <h2>Lessons</h2>
            {(course.lessons || []).length === 0 ? (
                <p>No lessons have been uploaded yet.</p>
            ) : (
                <ul>
                    {course.lessons.map((lesson) => (
                        <li key={lesson._id}>
                            <strong>{lesson.title}</strong> — {lesson.content}
                        </li>
                    ))}
                </ul>
            )}

            <p>
                <Link to="/courses">Back to Courses</Link>
            </p>
        </div>
    );
}

export default CourseDetail;
