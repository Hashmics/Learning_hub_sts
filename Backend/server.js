const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { register, login } = require("./controllers/userController");

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env");
    process.exit(1);
}

app.post("/register", register);
app.post("/login", login);
app.use("/courses", courseRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use(enrollmentRoutes);
app.use(adminRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(__dirname, "../Frontend/dist");
    app.use(express.static(frontendDist));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("LearnHub Backend is Running!");
    });
}

connectDatabase().catch((error) => {
    console.log("Database connection failed:", error.message);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
