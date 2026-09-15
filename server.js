const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from the 'public' directory
app.use(express.static('public'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test Database Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to Supabase Database:', err.stack);
  }
  console.log('Connected to Supabase PostgreSQL Database successfully!');
  release();
});

// ------------------- QUOTES ROUTES -------------------

// GET a random quote from the database
app.get('/api/quotes/random', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No quotes found in database' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({ error: 'Server error fetching quote' });
  }
});

// ------------------- JOURNAL ROUTES -------------------

// GET all journal entries
app.get('/api/entries', async (req, res) => {
  try {
    const userId = 1;
    const result = await pool.query(
      'SELECT id, text, entry_date FROM entries WHERE user_id = $1 ORDER BY entry_date DESC, created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching entries' });
  }
});

// POST a new journal entry
app.post('/api/entries', async (req, res) => {
  const { text, date } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const userId = 1;
    const entryDate = date || new Date().toISOString().slice(0, 10);
    const result = await pool.query(
      'INSERT INTO entries (user_id, text, entry_date) VALUES ($1, $2, $3) RETURNING *',
      [userId, text, entryDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving entry' });
  }
});

// DELETE a journal entry
app.delete('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM entries WHERE id = $1', [id]);
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting entry' });
  }
});

// ------------------- START SERVER -------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Little Light server running on http://localhost:${PORT}`);
});