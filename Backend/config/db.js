const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const LOCAL_URI = "mongodb://127.0.0.1:27017/learnhub";

async function seedAdmin() {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";

    if (!email || !password) {
        console.log("Admin seed skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
        return;
    }

    const existing = await User.findOne({ email });

    if (existing) {
        if (existing.role !== "admin") {
            existing.role = "admin";
            await existing.save();
            console.log("Existing account promoted to admin");
        }
        return;
    }

    await User.create({
        name: "LearnHub Admin",
        email,
        password: await bcrypt.hash(password, 10),
        role: "admin"
    });
    console.log("Admin account ready");
}

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000
        });
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
        console.log("Atlas is unreachable. Connecting to local MongoDB...");

        await mongoose.disconnect().catch(() => {});
        await mongoose.connect(LOCAL_URI);
        console.log("Local MongoDB Connected Successfully");
    }

    await seedAdmin();
}

module.exports = connectDatabase;
