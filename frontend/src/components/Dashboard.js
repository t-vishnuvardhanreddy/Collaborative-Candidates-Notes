"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserPlus, Bell, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mentions, setMentions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "" });

  const fetchMentions = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${userId}`);
      const data = await res.json();
      setMentions(data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return navigate("/");
    setUser(u);

    fetchMentions(u.id);

    fetch("http://localhost:5000/api/candidates")
      .then((r) => r.json())
      .then(setCandidates)
      .catch(console.error);

    const noteHandler = (note) => {
      if (note.content.toLowerCase().includes(`@${u.name.toLowerCase()}`)) {
        toast.info(`🔔 You were mentioned in Candidate #${note.candidate_id}`);
        fetchMentions(u.id);
      }
    };
    socket.on("noteAdded", noteHandler);
    return () => socket.off("noteAdded", noteHandler);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleCandidateChange = (e) => setNewCandidate({ ...newCandidate, [e.target.name]: e.target.value });

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) return;
    const res = await fetch("http://localhost:5000/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCandidate),
    });
    const data = await res.json();
    if (res.ok) {
      setCandidates((prev) => [data, ...prev]);
      setNewCandidate({ name: "", email: "" });
    } else {
      toast.error(data.error || "Failed to add candidate");
    }
  };

  if (!user) return <p className="min-h-screen flex items-center justify-center">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-fuchsia-500 to-rose-500 p-6 text-slate-800">
      <ToastContainer position="top-right" />
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 text-white">
        <h2 className="text-3xl font-bold">Hello, {user.name}</h2>
        <button onClick={logout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* Main Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Mentions Table */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-700 mb-4">
            <Bell className="h-5 w-5" /> Mentions ({mentions.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-purple-700 bg-purple-100">
                <tr>
                  <th className="py-2 px-3">Candidate</th>
                  <th className="py-2 px-3">Excerpt</th>
                </tr>
              </thead>
              <tbody>
                {mentions.length ? (
                  mentions.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-purple-50 cursor-pointer"
                      onClick={() => navigate(`/candidates/${m.candidate_id}/notes?highlight=${m.id}`)}
                    >
                      <td className="py-2 px-3">{m.candidate_name}</td>
                      <td className="py-2 px-3">{m.content.slice(0, 70)}…</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="py-4 text-purple-600 text-center">No mentions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-rose-700 mb-4">
            <UserPlus className="h-5 w-5" /> Candidates ({candidates.length})
          </h3>

          {/* Add Form */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newCandidate.name}
              onChange={handleCandidateChange}
              className="flex-1 px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newCandidate.email}
              onChange={handleCandidateChange}
              className="flex-1 px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <button
              onClick={handleAddCandidate}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-rose-700 bg-rose-100">
                <tr>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length ? (
                  candidates.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-rose-50 cursor-pointer"
                      onClick={() => navigate(`/candidates/${c.id}/notes`)}
                    >
                      <td className="py-2 px-3">{c.name}</td>
                      <td className="py-2 px-3">{c.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="py-4 text-rose-600 text-center">No candidates yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
