require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 4000;



// Hardcoded users
const USERS = [
    {
        id: 1,
        email: "admin@deskline.com",
        passwordHash: "$2b$10$JeqLUnWTIKR8mgF4nCDXkeQUelXscK14qpWw.OaQFseoqLhPxUSAS",
        role: "admin",
        name: "Admin User",
    },
    {
        id: 2,
        email: "user@deskline.com",
        passwordHash: "$2b$10$SsWFzZjMyj.Ihw.19xaQUuwGtu0FuCa31mCAcz2stNxuZlsBjHS6C",
        role: "user",
        name: "Regular User",
    },
];

//Hardcoded tickets, owned by user id
let TICKETS = [
    { id: 1, ownerId: 2, title: "Can't reset my password", status: "open" },
    { id: 2, ownerId: 2, title: "Billing page shows wrong amount", status: "open" },
    { id: 3, ownerId: 1, title: "Feature request: dark mode", status: "closed" },
];

// POST /login 
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = USERS.find((u) => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Sign a real JWT 
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

// Middleware: verifies the JWT on protected routes 
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // attach decoded user info to the request
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

//GET /tickets - regular users 
app.get("/tickets", requireAuth, (req, res) => {
    const myTickets = TICKETS.filter((t) => t.ownerId === req.user.id);
    res.json(myTickets);
});

//  GET /tickets/all - admin only
app.get("/tickets/all", requireAuth, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    res.json(TICKETS);
});

app.listen(PORT, () => {
    console.log(`deskline server running on port ${PORT}`);
});