//importing express library
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
//importing cors library
const cors = require('cors');

//configure app to run on port 3000
const app = express();
const PORT = 3000;
//enabling cross origin request
app.use(cors());
app.use(express.json());

// Connect to SQLite DB (file-based)
const db = new sqlite3.Database('./mydb.sqlite');

// Initialize customer table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      company_name TEXT,
      phone TEXT,
      profile_picture_url TEXT,
      contract_start_date TEXT,
      contract_expire_date TEXT
    )
  `);
});

// GET / – Return all customer
app.get('/', (req, res) => {
  db.get("SELECT * FROM customer order by id desc", (err, rows) => {
   if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

     res.json(rows);

  });
});

// GET /customer - List all customers
app.get('/customer', (req, res) => {
  db.all("SELECT * FROM customer ORDER BY id desc", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.json(rows);
  });
});

// POST /customer - Add a new customer
app.post('/customer', (req, res) => {
  const { name, email, company_name, phone, profile_picture, start_date, expire_date } = req.body;
  if (!name || !email) return res.status(400).send("Name and email are required");

  db.run(`
    INSERT INTO customer (name, email, company_name, phone, profile_picture_url, contract_start_date, contract_expire_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, company_name, phone, profile_picture, start_date, expire_date],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to add customer");
      }
      res.json({ id: this.lastID, name });
    });
});

// DELETE /customer/:id - Delete customer by ID
app.delete('/customer/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM customer WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to delete customer");
    }
    if (this.changes === 0) return res.status(404).send("Customer not found");
    res.json({ deleted: true, id });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
