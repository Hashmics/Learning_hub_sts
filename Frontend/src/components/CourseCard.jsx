import { Link } from "react-router-dom";

function CourseCard({ course, enrolled }) {
    const instructorName = course.instructor?.name || "Instructor";

    return (
        <article className="course-card">
            <p className="category">{course.category}</p>
            <h2>
                <Link to={`/courses/${course._id}`}>{course.title}</Link>
            </h2>
            <p>{course.description}</p>
            <p>Instructor: {instructorName}</p>
            <p className="price">Rs. {course.price}</p>
            {enrolled && <p className="badge">Enrolled</p>}
        </article>
    );
}

export default CourseCard;
