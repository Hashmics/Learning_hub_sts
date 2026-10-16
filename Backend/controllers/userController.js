const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

function signToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

function publicUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

function normalizeRole(role) {
    return role === "instructor" ? "instructor" : "student";
}

async function register(req, res) {
    try {
        const name = (req.body.name || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";
        if (req.body.role === "admin") {
            return res.status(400).json({
                message: "You cannot register as an admin."
            });
        }

        const role = normalizeRole(req.body.role);

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email address."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            token: signToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "An account with this email already exists."
            });
        }

        res.status(500).json({ message: "Could not create account." });
    }
}

async function login(req, res) {
    try {
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({
            token: signToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        res.status(500).json({ message: "Could not log in." });
    }
}

async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        res.json({ user: publicUser(user) });
    } catch (error) {
        res.status(500).json({ message: "Could not load profile." });
    }
}

module.exports = {
    register,
    login,
    getMe
};
