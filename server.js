const express = require('express');
let helmet; let morgan;
try { helmet = require('helmet'); } catch (e) { console.warn('helmet not installed'); }
try { morgan = require('morgan'); } catch (e) { console.warn('morgan not installed'); }
const app = express();
const db = require('./database/db');
const PORT = process.env.PORT || 3000;

// Security and logging middleware
app.disable('x-powered-by');
if (helmet) app.use(helmet());
if (morgan) app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse bodies and serve static assets with caching headers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public', { maxAge: '1d', etag: true, setHeaders(res) { res.setHeader('X-Content-Type-Options', 'nosniff'); } }));


app.post('/submit', async (req, res) => {
    let name = req.body.name || 'Anonymous';
    const message = req.body.message;

    const sql = "INSERT INTO messages (name, message) VALUES (?, ?)";

    try {
        const [result] = await db.query(sql, [name, message]);
        console.log("Message Posted Successfully!");
        res.redirect("/");
    } catch (err) {
        console.error("Error Posting a Message!", err);
        res.redirect("/");
    }
});


const getMessages = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, message, created_at FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('GET /messages error:', err);
        const payload = { error: err.message };
        if (process.env.DEBUG === 'true' || process.env.DEBUG === '1') {
            payload.stack = err.stack;
        }
        res.status(500).json(payload);
    }
};

// API endpoints
app.get('/users', getMessages); // legacy route kept for compatibility
app.get('/messages', getMessages);

// DB connectivity check endpoint (returns 200 with a small query result or 500 with error info)
app.get('/dbcheck', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS ok');
        res.json({ ok: true, rows });
    } catch (err) {
        console.error('GET /dbcheck error:', err);
        res.status(500).json({ ok: false, error: err.message, code: err.code });
    }
});

// Graceful shutdown
const server = app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

const shutdown = async () => {
    console.log('Shutting down...');
    server.close(() => {
        // close DB pool if available
        if (db && typeof db.end === 'function') {
            db.end().then(() => process.exit(0)).catch(() => process.exit(0));
        } else {
            process.exit(0);
        }
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = app;