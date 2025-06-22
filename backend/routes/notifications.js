const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT n.id, n.candidate_id, c.name AS candidate_name, no.content
       FROM notifications n
       JOIN candidates c ON c.id = n.candidate_id
       JOIN notes no ON no.id = n.note_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Notification fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
