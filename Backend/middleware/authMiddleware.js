const jwt = require("jsonwebtoken");
const User = require("../models/user");

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Please log in to continue." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }
}

function requireRole(...roles) {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({
                    message: "You do not have permission to do that."
                });
            }

            req.account = user;
            next();
        } catch (error) {
            res.status(500).json({ message: "Could not verify your account." });
        }
    };
}

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
