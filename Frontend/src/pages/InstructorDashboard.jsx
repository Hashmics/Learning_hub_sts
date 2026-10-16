import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseForm from "../components/CourseForm";
import LessonForm from "../components/LessonForm";
import { useAuth } from "../context/AuthContext";
import { deleteCourse, getCourseById, getCourses } from "../services/courseService";

function InstructorDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadLessons = async (courseId) => {
        const detail = await getCourseById(courseId);
        setLessons((current) => ({
            ...current,
            [courseId]: detail.lessons || []
        }));
    };

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCourses();
                const mine = data.filter((course) => {
                    const instructorId = course.instructor?._id || course.instructor;
                    return String(instructorId) === String(user.id);
                });
                setCourses(mine);
                await Promise.all(mine.map((course) => loadLessons(course._id)));
            } catch (err) {
                setError(err.response?.data?.message || "Could not load your courses.");
            }
        };

        if (user?.id) {
            load();
        }
    }, [user]);

    const handleDelete = async (courseId) => {
        setError("");
        setMessage("");

        try {
            await deleteCourse(courseId);
            setCourses((current) => current.filter((course) => course._id !== courseId));
            setMessage("Course deleted.");
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete the course.");
        }
    };

    return (
        <div className="page">
            <h1>Instructor dashboard</h1>
            <p>Create and manage your courses, then upload lesson material.</p>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <CourseForm
                onCreated={(course) => {
                    setCourses((current) => [course, ...current]);
                    setLessons((current) => ({ ...current, [course._id]: [] }));
                    setMessage("Course added.");
                }}
            />

            {courses.length === 0 && <p>You have not added a course yet.</p>}

            {courses.map((course) => (
                <article className="course-card manager" key={course._id}>
                    <h2>
                        <Link to={`/courses/${course._id}`}>{course.title}</Link>
                    </h2>
                    <p>{course.category} · Rs. {course.price}</p>
                    <button type="button" className="danger" onClick={() => handleDelete(course._id)}>
                        Delete course
                    </button>

                    <ul>
                        {(lessons[course._id] || []).map((lesson) => (
                            <li key={lesson._id}>
                                <strong>{lesson.title}</strong> — {lesson.content}
                            </li>
                        ))}
                    </ul>

                    <LessonForm
                        courseId={course._id}
                        onCreated={(lesson) => {
                            setLessons((current) => ({
                                ...current,
                                [course._id]: [...(current[course._id] || []), lesson]
                            }));
                            setMessage("Lesson uploaded.");
                        }}
                    />
                </article>
            ))}
        </div>
    );
}

export default InstructorDashboard;
