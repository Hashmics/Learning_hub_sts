const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { enroll, myCourses, updateProgress } = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/enroll", authMiddleware, enroll);
router.get("/my-courses", authMiddleware, myCourses);
router.put("/my-courses/:id", authMiddleware, updateProgress);

module.exports = router;
