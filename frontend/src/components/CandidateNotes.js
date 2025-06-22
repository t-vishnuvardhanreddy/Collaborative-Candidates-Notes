import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const socket = io('http://localhost:5000');

export default function CandidateNotes() {
  const { candidateId } = useParams();
  const location = useLocation();
  const highlightId = new URLSearchParams(location.search).get('highlight');

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/candidates/${candidateId}/notes`)
      .then(res => res.json())
      .then(setNotes)
      .catch(console.error);
  }, [candidateId]);

  useEffect(() => {
    const handler = (note) => {
      if (note.candidate_id === Number(candidateId)) {
        setNotes(prev => [note, ...prev]);
        if (note.content.toLowerCase().includes(`@${currentUser.name.toLowerCase()}`)) {
          toast.info(`You were mentioned in Candidate #${candidateId}`);
        }
      }
    };
    socket.on('noteAdded', handler);
    return () => socket.off('noteAdded', handler);
  }, [candidateId, currentUser.name]);

  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`note-${highlightId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [notes, highlightId]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setNoteText(val);
    const last = val.split(/\s/).pop();
    if (last.startsWith('@')) {
      const kw = last.slice(1).toLowerCase();
      setSuggestions(users.filter(u => u.name.toLowerCase().startsWith(kw)).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const chooseUser = (u) => {
    const words = noteText.split(/\s/);
    words.pop();
    setNoteText([...words, `@${u.name}`].join(' ') + ' ');
    setSuggestions([]);
    textareaRef.current.focus();
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    const res = await fetch(`http://localhost:5000/api/candidates/${candidateId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText }),
    });
    const newNote = await res.json();
    if (res.ok) {
      setNotes(prev => [newNote, ...prev]);
      socket.emit('newNote', newNote);
      setNoteText('');
    } else {
      toast.error(newNote.error || 'Failed to add note');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 py-10 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl shadow-xl">
        <h3 className="text-2xl font-bold text-orange-600 mb-6">Candidate #{candidateId} Notes</h3>

        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={3}
            value={noteText}
            placeholder="Type a note… use @ to tag"
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 top-full mt-1 bg-white border rounded-md shadow w-full">
              {suggestions.map(u => (
                <li
                  key={u.id}
                  onClick={() => chooseUser(u)}
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-orange-700"
                >
                  @{u.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={addNote}
          className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Add Note
        </button>

        <ul className="mt-6 space-y-4">
          {notes.map(n => (
            <li
              key={n.id}
              id={`note-${n.id}`}
              className={`p-4 rounded-xl border border-orange-100 ${highlightId === String(n.id) ? 'bg-yellow-200' : 'bg-orange-50'}`}
            >
              {n.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}