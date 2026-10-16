import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import { useAuth } from "../context/AuthContext";
import { getCourses } from "../services/courseService";
import { getMyCourses } from "../services/enrollmentService";

function Courses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (err) {
                setError("Courses could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        if (user?.role !== "student") {
            setEnrolledIds([]);
            return;
        }

        getMyCourses()
            .then((rows) => setEnrolledIds(rows.map((row) => row.course?._id)))
            .catch(() => {});
    }, [user]);

    return (
        <div className="page">
            <h1>Our Courses</h1>
            <p>Browse courses, or add one if you are signed in as an instructor.</p>

            {user?.role === "instructor" && (
                <CourseForm
                    onCreated={(course) => setCourses((current) => [course, ...current])}
                />
            )}

            {loading && <p>Loading courses...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && courses.length === 0 && (
                <p>No courses are available yet.</p>
            )}

            {!loading && !error && courses.length > 0 && (
                <div className="course-grid">
                    {courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            enrolled={enrolledIds.includes(course._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;
