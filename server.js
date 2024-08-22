const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Correct SQLite3 import
const path = require('path');
const app = express();
const PORT = 3000;

// Initialize SQLite database
const db = new sqlite3.Database(':memory:'); // You can use a file-based database by specifying a file path

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route to handle ride offers
app.post('/api/offer-ride', (req, res) => {
    const { startCheckpoint, endCheckpoint, rideTime, seatsAvailable } = req.body;

    // Save the ride data to the database
    db.run(`INSERT INTO rides (startCheckpoint, endCheckpoint, rideTime, seatsAvailable) VALUES (?, ?, ?, ?)`,
        [startCheckpoint, endCheckpoint, rideTime, seatsAvailable],
        function(err) {
            if (err) {
                return res.status(500).send({ message: 'Error saving ride data' });
            }
            res.status(201).send({ message: 'Ride offered successfully!' });
        });
});

// Sample route to handle ride search
app.post('/api/search-ride', (req, res) => {
    const { searchCheckpoint } = req.body;

    // Query the database to find matching rides
    db.all(`SELECT * FROM rides WHERE startCheckpoint LIKE ? OR endCheckpoint LIKE ?`,
        [`%${searchCheckpoint}%`, `%${searchCheckpoint}%`],
        (err, rows) => {
            if (err) {
                return res.status(500).send({ message: 'Error querying rides' });
            }
            res.send({ rides: rows });
        });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create the "rides" table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS rides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startCheckpoint TEXT,
        endCheckpoint TEXT,
        rideTime TEXT,
        seatsAvailable INTEGER
    )`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
