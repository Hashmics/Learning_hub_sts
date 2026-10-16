import { useState } from "react";
import { addLesson } from "../services/courseService";

function LessonForm({ courseId, onCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const lesson = await addLesson(courseId, { title, content });
            setTitle("");
            setContent("");
            onCreated(lesson);
        } catch (err) {
            setError(err.response?.data?.message || "Could not upload the lesson.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="lesson-form" onSubmit={handleSubmit}>
            <h3>Upload a lesson</h3>
            <label>
                Lesson title
                <input value={title} onChange={(event) => setTitle(event.target.value)} required />
            </label>
            <label>
                Lesson content
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={submitting}>
                {submitting ? "Uploading..." : "Upload lesson"}
            </button>
        </form>
    );
}

export default LessonForm;
