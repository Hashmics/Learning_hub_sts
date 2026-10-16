const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");

async function enroll(req, res) {
    try {
        const courseId = req.body.courseId;

        if (!courseId) {
            return res.status(400).json({ message: "Choose a course to enroll in." });
        }

        const student = await User.findById(req.user.id);

        if (!student) {
            return res.status(401).json({ message: "User not found." });
        }

        if (student.role !== "student") {
            return res.status(403).json({
                message: "Only students can enroll in courses."
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        const existing = await Enrollment.findOne({
            student: student._id,
            course: course._id
        });

        if (existing) {
            return res.status(400).json({
                message: "You are already enrolled in this course."
            });
        }

        const enrollment = await Enrollment.create({
            student: student._id,
            course: course._id,
            progress: 0
        });

        const populated = await Enrollment.findById(enrollment._id).populate({
            path: "course",
            populate: { path: "instructor", select: "name email" }
        });

        res.status(201).json({
            message: "Enrolled successfully",
            enrollment: populated
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You are already enrolled in this course."
            });
        }

        res.status(400).json({ message: error.message });
    }
}

async function myCourses(req, res) {
    try {
        const student = await User.findById(req.user.id);

        if (!student) {
            return res.status(401).json({ message: "User not found." });
        }

        if (student.role !== "student") {
            return res.status(403).json({
                message: "Enrolled courses are available to students."
            });
        }

        const enrollments = await Enrollment.find({ student: student._id })
            .populate({
                path: "course",
                populate: { path: "instructor", select: "name email" }
            })
            .sort({ createdAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: "Could not load your courses." });
    }
}

async function updateProgress(req, res) {
    try {
        const progress = Number(req.body.progress);

        if (Number.isNaN(progress) || progress < 0 || progress > 100) {
            return res.status(400).json({
                message: "Progress must be a number from 0 to 100."
            });
        }

        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found." });
        }

        if (enrollment.student.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own progress."
            });
        }

        enrollment.progress = progress;
        await enrollment.save();

        const populated = await Enrollment.findById(enrollment._id).populate({
            path: "course",
            populate: { path: "instructor", select: "name email" }
        });

        res.json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    enroll,
    myCourses,
    updateProgress
};
