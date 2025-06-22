"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        navigate("/");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-sky-400 to-indigo-500 flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-6"
      >
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-sky-500">Create New Account </h1>
          <p className="text-sm text-sky-500">Join us by filling the information below</p>
        </div>

        {/* Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="pl-11 pr-4 py-3 w-full text-sm rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="pl-11 pr-4 py-3 w-full text-sm rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="pl-11 pr-11 py-3 w-full text-sm rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-sm font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-lg shadow-sky-300"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-sky-500">
          Already have an account?{' '}
          <button
            type="button"
            className="text-sky-700 hover:underline font-semibold"
            onClick={() => navigate('/')}
          >
            Log in
          </button>
        </p>
      </motion.form>
    </div>
  );
}