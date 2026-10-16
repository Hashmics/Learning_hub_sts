import { useState } from "react";
import { addCourse } from "../services/courseService";

const emptyForm = {
    title: "",
    description: "",
    category: "",
    price: ""
};

function CourseForm({ onCreated }) {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const created = await addCourse({
                ...form,
                price: Number(form.price)
            });
            setForm(emptyForm);
            onCreated(created);
        } catch (err) {
            setError(err.response?.data?.message || "Could not add the course.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="course-form" onSubmit={handleSubmit}>
            <h2>Add a course</h2>

            <label>
                Title
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Description
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Category
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Price (Rs.)
                <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add course"}
            </button>
        </form>
    );
}

export default CourseForm;
