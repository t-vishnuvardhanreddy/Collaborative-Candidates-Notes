import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '' });
  const navigate = useNavigate();                 

  const fetchCandidates = async () => {
    try {
      const res  = await fetch('http://localhost:5000/api/candidates');
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleChange = (e) =>
    setNewCandidate({ ...newCandidate, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate),
      });
      if (res.ok) {
        setNewCandidate({ name: '', email: '' });
        fetchCandidates();      
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add candidate');
      }
    } catch (err) {
      console.error('Error adding candidate:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-emerald-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold text-emerald-700 mb-4">Add Candidate</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            name="name"
            value={newCandidate.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="flex-1 px-4 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="email"
            name="email"
            value={newCandidate.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="flex-1 px-4 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Add
          </button>
        </form>

        <h3 className="text-xl font-bold text-emerald-700 mb-2">Candidate List</h3>
        <ul className="space-y-3">
          {candidates.map((c) => (
            <li key={c.id} className="flex justify-between items-center bg-emerald-50 px-4 py-2 rounded-md">
              <div>
                <span className="font-medium text-emerald-900">{c.name}</span>
                <span className="text-emerald-600 ml-2">{c.email}</span>
              </div>
              <button
                onClick={() => navigate(`/candidates/${c.id}/notes`)}
                className="text-sm text-white bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700"
              >
                View Notes
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CandidateList;