const express = require('express');
const router  = express.Router({ mergeParams: true });
const pool    = require('../db');

const extractMentions = (text) => {
  const matches = text.match(/@(\w+)/g);
  return matches ? matches.map(m => m.slice(1)) : [];
};

router.get('/:id/notes', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notes WHERE candidate_id = $1 ORDER BY id DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch notes error:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/:id/notes', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });

  try {
    const noteQ =
      'INSERT INTO notes (candidate_id, content) VALUES ($1,$2) RETURNING *';
    const { rows } = await pool.query(noteQ, [req.params.id, content]);
    const note = rows[0];

    const usernames = extractMentions(content);
    for (const uname of usernames) {
const uRes = await pool.query(
   'SELECT id FROM users WHERE LOWER(name) = LOWER($1)',
  [uname]
 );      if (uRes.rows.length) {
        await pool.query(
          'INSERT INTO notifications (user_id, candidate_id, note_id) VALUES ($1,$2,$3)',
          [uRes.rows[0].id, req.params.id, note.id]
        );
      }
    }

    res.status(201).json(note);
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

module.exports = router;
