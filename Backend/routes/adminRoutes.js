const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const {
    getUsers,
    updateUserRole,
    deleteUser,
    getAnalytics
} = require("../controllers/adminController");

const router = express.Router();
const adminOnly = [authMiddleware, requireRole("admin")];

router.get("/users", ...adminOnly, getUsers);
router.put("/users/:id", ...adminOnly, updateUserRole);
router.delete("/users/:id", ...adminOnly, deleteUser);
router.get("/analytics", ...adminOnly, getAnalytics);

module.exports = router;
