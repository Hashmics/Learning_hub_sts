const Course = require("../models/course");
const Lesson = require("../models/lesson");
const Enrollment = require("../models/enrollment");

function readCourseInput(body) {
    const title = (body.title || "").trim();
    const description = (body.description || "").trim();
    const category = (body.category || "").trim();
    const price = Number(body.price);

    if (!title || !description || !category || Number.isNaN(price)) {
        return { error: "Title, description, category, and price are required." };
    }

    if (price < 0) {
        return { error: "Price cannot be negative." };
    }

    return { title, description, category, price };
}

async function getCourses(req, res) {
    try {
        const courses = await Course.find()
            .populate("instructor", "name email role")
            .sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getCourse(req, res) {
    try {
        const course = await Course.findById(req.params.id).populate(
            "instructor",
            "name email role"
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lessons = await Lesson.find({ course: course._id }).sort({ createdAt: 1 });
        res.json({ ...course.toObject(), lessons });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function createCourse(req, res) {
    try {
        const input = readCourseInput(req.body);

        if (input.error) {
            return res.status(400).json({ message: input.error });
        }

        const created = await Course.create({
            title: input.title,
            description: input.description,
            category: input.category,
            price: input.price,
            instructor: req.user.id
        });

        const course = await Course.findById(created._id).populate(
            "instructor",
            "name email role"
        );

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateCourse(req, res) {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (req.account.role !== "admin" && course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own courses."
            });
        }

        const input = readCourseInput(req.body);

        if (input.error) {
            return res.status(400).json({ message: input.error });
        }

        course.title = input.title;
        course.description = input.description;
        course.category = input.category;
        course.price = input.price;
        await course.save();

        const updated = await Course.findById(course._id).populate(
            "instructor",
            "name email role"
        );

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteCourse(req, res) {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (req.account.role !== "admin" && course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own courses."
            });
        }

        await Lesson.deleteMany({ course: course._id });
        await Enrollment.deleteMany({ course: course._id });
        await course.deleteOne();

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function addLesson(req, res) {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        if (req.account.role !== "admin" && course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only add lessons to your own courses."
            });
        }

        const title = (req.body.title || "").trim();
        const content = (req.body.content || "").trim();

        if (!title || !content) {
            return res.status(400).json({
                message: "Lesson title and content are required."
            });
        }

        const lesson = await Lesson.create({
            title,
            content,
            course: course._id
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    addLesson
};
