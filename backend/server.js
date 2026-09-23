const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// ==============================
// MYSQL CONNECTION
// ==============================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "engalitdorothy",
    database: "construction_information_system"
});


// Connect to MySQL
db.connect((err) => {

    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");

});


// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Construction Information System backend is running"
    });

});


// ==============================
// ADD PROJECT
// ==============================

app.post("/api/projects", (req, res) => {

    const {
        projectName,
        clientName,
        location,
        budget,
        startDate,
        endDate,
        status
    } = req.body;


    // Check required information

    if (
        !projectName ||
        !clientName ||
        !location ||
        !budget ||
        !startDate ||
        !endDate ||
        !status
    ) {

        return res.status(400).json({

            success: false,
            message: "All project fields are required"

        });

    }


    // SQL query

    const sql = `
        INSERT INTO projects
        (
            project_name,
            client_name,
            location,
            budget,
            start_date,
            end_date,
            status
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
        projectName,
        clientName,
        location,
        budget,
        startDate,
        endDate,
        status
    ];


    // Save project

    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Database error:", err.message);

            return res.status(500).json({

                success: false,
                message: "Failed to save project",
                error: err.message

            });

        }


        res.status(201).json({

            success: true,
            message: "Project saved successfully",

            projectId: result.insertId

        });

    });

});
// ==============================
// GET ALL PROJECTS
// ==============================

app.get("/api/projects", (req, res) => {

    const sql = `
        SELECT
            project_id,
            project_name,
            client_name,
            location,
            budget,
            start_date,
            end_date,
            status,
            created_at
        FROM projects
        ORDER BY project_id DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error("Database error:", err.message);

            return res.status(500).json({

                success: false,
                message: "Failed to retrieve projects",
                error: err.message

            });

        }


        res.json({

            success: true,
            projects: results

        });

    });

});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});