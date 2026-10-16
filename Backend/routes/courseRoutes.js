const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    addLesson
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", authMiddleware, requireRole("instructor", "admin"), createCourse);
router.put("/:id", authMiddleware, requireRole("instructor", "admin"), updateCourse);
router.delete("/:id", authMiddleware, requireRole("instructor", "admin"), deleteCourse);
router.post("/:id/lessons", authMiddleware, requireRole("instructor", "admin"), addLesson);

module.exports = router;
