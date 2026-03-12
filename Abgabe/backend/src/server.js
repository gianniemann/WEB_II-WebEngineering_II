"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const API_KEY = process.env.API_KEY || "";

const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, "..", "logs");
const REQUEST_LOG_FILE = path.join(LOG_DIR, "requests.log");
const ERROR_LOG_FILE = path.join(LOG_DIR, "errors.log");

fs.mkdirSync(LOG_DIR, { recursive: true });

if (!API_KEY) {
    console.warn("[SECURITY] API_KEY is not set. Protected endpoints will return HTTP 503 until configured.");
}

function logLine(filePath, message) {
    const timestamp = new Date().toISOString();
    fs.appendFile(filePath, `[${timestamp}] ${message}\n`, (err) => {
        if (err) {
            console.error("Could not write log file:", err.message);
        }
    });
}

app.use(
    cors({
        origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN
    })
);
app.use(express.json());

app.use((req, res, next) => {
    const started = Date.now();
    res.on("finish", () => {
        const durationMs = Date.now() - started;
        logLine(REQUEST_LOG_FILE, `${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    });
    next();
});

function requireApiKey(req, res, next) {
    if (!API_KEY) {
        logLine(ERROR_LOG_FILE, `${req.method} ${req.originalUrl} API key enforcement misconfigured (API_KEY missing).`);
        return res.status(503).json({ message: "API key protection is not configured on the server." });
    }

    const received = req.header("x-api-key");
    if (!received || received !== API_KEY) {
        return res.status(401).json({ message: "Unauthorized. Missing or invalid API key." });
    }

    next();
}

function isPositiveNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
}

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "ok", db: "connected" });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/health ${error.message}`);
        res.status(500).json({ status: "error", db: "not connected", message: "Database unavailable." });
    }
});

app.get("/api/status", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "ok", db: "connected" });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/status ${error.message}`);
        res.status(500).json({ status: "error", db: "not connected", message: "Database unavailable." });
    }
});

app.get("/api/currencies", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, iso_code, name, countries FROM currency ORDER BY iso_code ASC");
        res.json(rows);
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/currencies ${error.message}`);
        res.status(500).json({ message: "Could not fetch currencies." });
    }
});

app.post("/api/currencies", requireApiKey, async (req, res) => {
    const { iso_code, name, countries } = req.body;

    if (!iso_code || !name || !countries) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO currency (iso_code, name, countries) VALUES (?, ?, ?)",
            [String(iso_code).toUpperCase(), name, countries]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `POST /api/currencies ${error.message}`);
        res.status(500).json({ message: "Could not create currency." });
    }
});

app.get("/api/rates", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, base_currency, target_currency, rate_value, rate_date FROM rate ORDER BY rate_date DESC, id DESC"
        );
        res.json(rows);
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/rates ${error.message}`);
        res.status(500).json({ message: "Could not fetch rates." });
    }
});

app.post("/api/rates", requireApiKey, async (req, res) => {
    const { base_currency, target_currency, rate_value, rate_date } = req.body;

    if (!base_currency || !target_currency || !isPositiveNumber(rate_value) || !rate_date) {
        return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO rate (base_currency, target_currency, rate_value, rate_date) VALUES (?, ?, ?, ?)",
            [String(base_currency).toUpperCase(), String(target_currency).toUpperCase(), rate_value, rate_date]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `POST /api/rates ${error.message}`);
        res.status(500).json({ message: "Could not create rate." });
    }
});

app.get("/api/transactions", async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, transaction_date, user_login, source_amount, source_currency, target_currency, exchange_rate, status
             FROM transaction ORDER BY transaction_date DESC, id DESC`
        );
        res.json(rows);
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/transactions ${error.message}`);
        res.status(500).json({ message: "Could not fetch transactions." });
    }
});

app.get("/api/transactions/:id", async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, transaction_date, user_login, source_amount, source_currency, target_currency, exchange_rate, status
             FROM transaction WHERE id = ?`,
            [Number(req.params.id)]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        res.json(rows[0]);
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/transactions/:id ${error.message}`);
        res.status(500).json({ message: "Could not fetch transaction." });
    }
});

app.post("/api/transactions", requireApiKey, async (req, res) => {
    const { transaction_date, user_login, source_amount, source_currency, target_currency, exchange_rate } = req.body;

    if (
        !transaction_date ||
        !user_login ||
        !source_currency ||
        !target_currency ||
        !isPositiveNumber(source_amount) ||
        !isPositiveNumber(exchange_rate)
    ) {
        return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO transaction
            (transaction_date, user_login, source_amount, source_currency, target_currency, exchange_rate)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                transaction_date,
                user_login,
                source_amount,
                String(source_currency).toUpperCase(),
                String(target_currency).toUpperCase(),
                exchange_rate
            ]
        );

        res.status(201).json({ id: result.insertId });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `POST /api/transactions ${error.message}`);
        res.status(500).json({ message: "Could not create transaction." });
    }
});

app.put("/api/transactions/:id", requireApiKey, async (req, res) => {
    const { source_amount, exchange_rate } = req.body;
    if (!isPositiveNumber(source_amount) || !isPositiveNumber(exchange_rate)) {
        return res.status(400).json({ message: "source_amount and exchange_rate must be positive numbers." });
    }

    try {
        const [result] = await pool.query(
            "UPDATE transaction SET source_amount = ?, exchange_rate = ? WHERE id = ?",
            [source_amount, exchange_rate, Number(req.params.id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        res.json({ message: "Transaction updated." });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `PUT /api/transactions/:id ${error.message}`);
        res.status(500).json({ message: "Could not update transaction." });
    }
});

app.delete("/api/transactions/:id", requireApiKey, async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM transaction WHERE id = ?", [Number(req.params.id)]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        res.status(204).send();
    } catch (error) {
        logLine(ERROR_LOG_FILE, `DELETE /api/transactions/:id ${error.message}`);
        res.status(500).json({ message: "Could not delete transaction." });
    }
});

app.post("/api/transactions/:id/status", requireApiKey, async (req, res) => {
    const { status } = req.body;
    const allowed = ["pending", "approved", "cancelled"];

    if (!allowed.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}.` });
    }

    try {
        const [rows] = await pool.query("SELECT id, status FROM transaction WHERE id = ?", [Number(req.params.id)]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        const current = rows[0].status;
        if (current === "cancelled") {
            return res.status(409).json({ message: "Cancelled transactions cannot change status anymore." });
        }

        await pool.query("UPDATE transaction SET status = ? WHERE id = ?", [status, Number(req.params.id)]);
        res.json({ id: Number(req.params.id), old_status: current, new_status: status });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `POST /api/transactions/:id/status ${error.message}`);
        res.status(500).json({ message: "Could not update transaction status." });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, first_name, last_name, login FROM user ORDER BY id ASC");
        res.json(rows);
    } catch (error) {
        logLine(ERROR_LOG_FILE, `GET /api/users ${error.message}`);
        res.status(500).json({ message: "Could not fetch users." });
    }
});

app.post("/api/users", requireApiKey, async (req, res) => {
    const { first_name, last_name, login, password } = req.body;

    if (!first_name || !last_name || !login || !password) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const [result] = await pool.query("INSERT INTO user (first_name, last_name, login, password) VALUES (?, ?, ?, ?)", [
            first_name,
            last_name,
            login,
            password
        ]);

        res.status(201).json({ id: result.insertId });
    } catch (error) {
        logLine(ERROR_LOG_FILE, `POST /api/users ${error.message}`);
        res.status(500).json({ message: "Could not create user." });
    }
});

app.post("/api/login", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: "Missing login or password." });
    }

    try {
        const [rows] = await pool.query("SELECT id, first_name, last_name, login FROM user WHERE login = ? AND password = ?", [
            login,
            password
        ]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid login." });
        }

        res.json(rows[0]);
    } catch (error) {
        logLine(ERROR_LOG_FILE, `POST /api/login ${error.message}`);
        res.status(500).json({ message: "Could not login." });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
    console.log(`GTC backend running on port ${PORT}`);
});
