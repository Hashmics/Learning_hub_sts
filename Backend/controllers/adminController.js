const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

async function getUsers(req, res) {
    try {
        const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Could not load users." });
    }
}

async function updateUserRole(req, res) {
    try {
        const role = req.body.role;

        if (!["admin", "instructor", "student"].includes(role)) {
            return res.status(400).json({
                message: "Role must be admin, instructor, or student."
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user._id.toString() === req.user.id && role !== "admin") {
            return res.status(400).json({
                message: "You cannot remove your own admin access."
            });
        }

        user.role = role;
        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: "You cannot delete your own account." });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await Enrollment.deleteMany({ student: user._id });
        await user.deleteOne();
        res.json({ message: "User deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAnalytics(req, res) {
    try {
        const [users, courses, enrollments, roles] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            User.aggregate([
                { $group: { _id: "$role", count: { $sum: 1 } } }
            ])
        ]);

        const byRole = { admin: 0, instructor: 0, student: 0 };
        roles.forEach((item) => {
            byRole[item._id] = item.count;
        });

        res.json({ users, courses, enrollments, byRole });
    } catch (error) {
        res.status(500).json({ message: "Could not load analytics." });
    }
}

module.exports = {
    getUsers,
    updateUserRole,
    deleteUser,
    getAnalytics
};
