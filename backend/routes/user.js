const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();

// ── GET profile ───────────────────────────────────────────────
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, age, gender, height_cm, weight_kg, fitness_goal, bio, avatar_color, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── UPDATE profile ────────────────────────────────────────────
router.put('/profile', auth, async (req, res) => {
  const { full_name, age, gender, height_cm, weight_kg, fitness_goal, bio, avatar_color } = req.body;
  try {
    await pool.query(
      `UPDATE users SET full_name=?, age=?, gender=?, height_cm=?, weight_kg=?,
       fitness_goal=?, bio=?, avatar_color=? WHERE id=?`,
      [full_name || '', age || null, gender || 'Prefer not to say',
       height_cm || null, weight_kg || null,
       fitness_goal || '', bio || '', avatar_color || '#7a9e7e',
       req.user.id]
    );
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, age, gender, height_cm, weight_kg, fitness_goal, bio, avatar_color, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── SAVE pose session ─────────────────────────────────────────
router.post('/session', auth, async (req, res) => {
  const { pose_name, duration_sec, best_sec } = req.body;
  if (!pose_name) return res.status(400).json({ error: 'pose_name is required' });
  try {
    await pool.query(
      'INSERT INTO pose_sessions (user_id, pose_name, duration_sec, best_sec) VALUES (?, ?, ?, ?)',
      [req.user.id, pose_name, duration_sec || 0, best_sec || 0]
    );
    res.status(201).json({ message: 'Session saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET all sessions for user ─────────────────────────────────
router.get('/sessions', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM pose_sessions WHERE user_id = ? ORDER BY practiced_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET stats per pose (aggregated) ───────────────────────────
router.get('/stats', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         pose_name,
         COUNT(*)          AS total_sessions,
         SUM(duration_sec) AS total_time_sec,
         MAX(best_sec)     AS personal_best_sec,
         MAX(practiced_at) AS last_practiced
       FROM pose_sessions
       WHERE user_id = ?
       GROUP BY pose_name
       ORDER BY total_time_sec DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
