const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const { Server } = require('socket.io');

// route modules
const authRoutes      = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const notesRoutes     = require('./routes/notes');
const usersRoutes     = require('./routes/users');

const app    = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// ───── middleware ─────
app.use(cors());
app.use(express.json());

// ───── REST routes ─────
app.use('/api/auth',       authRoutes);
app.use('/api/candidates', notesRoutes);      // /:id/notes
app.use('/api/candidates', candidateRoutes);  // add / list candidates
app.use('/api/users',      usersRoutes);      // list users

// ───── Socket.IO events ─────
io.on('connection', (socket) => {
  console.log('client connected');

  socket.on('newNote', (note) => {
    socket.broadcast.emit('noteAdded', note); 
  });

  socket.on('disconnect', () => console.log('client disconnected'));
});
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);
const PORT = 5000;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);



module.exports = io;
