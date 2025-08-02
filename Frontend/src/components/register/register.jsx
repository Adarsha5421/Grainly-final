import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateName = (name) => /^[A-Za-z\s]{2,}$/.test(name.trim());
  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const validatePassword = (password) => {
    if (password.length < 8) return false;
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()]/.test(password);
  };
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()]/.test(password)) score++;
    if (password.length < 6) return 0;
    if (score >= 5) return 4;
    if (score === 4) return 3;
    if (score === 3) return 2;
    if (score === 2) return 1;
    return 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'password') setPasswordStrength(getPasswordStrength(value));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateName(form.name)) newErrors.name = "Name must be at least 2 letters.";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format.";
    if (!validatePassword(form.password)) newErrors.password = "Password must include upper, lower, number, and symbol.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.token) {
      toast.error("Please verify you are human");
      return;
    }
    if (!validateForm()) return;
    try {
      const res = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        token: form.token,
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  const handleRecaptchaChange = (token) => {
    setForm({ ...form, token });
  };

  const strengthLabels = ["Too short", "Weak", "Medium", "Strong", "Very strong"];
  const strengthColors = ["bg-gray-300", "bg-red-500", "bg-yellow-500", "bg-green-500", "bg-green-700"];

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#fff8e1]">
      {/* Left Visual */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[#f2c94c] px-10 text-[#4a2e2e]">
        <h1 className="text-5xl font-extrabold tracking-wide mb-4">Join Grainly</h1>
        <p className="text-lg text-center max-w-md">
          Create your account and start exploring our finest collection of dals, lentils & pulses.
        </p>
        <img src="/grain.svg" alt="Grains" className="w-56 mt-10" />
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-10">
          <h2 className="text-3xl font-bold text-[#4a2e2e] mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#4a2e2e] mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#9b3f3f]"
                required
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#4a2e2e] mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#9b3f3f]"
                required
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#4a2e2e] mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#9b3f3f]"
                required
              />
              {/* Strength Bar */}
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-2 flex-1 rounded ${passwordStrength > i ? strengthColors[passwordStrength] : 'bg-gray-200'}`} />
                ))}
              </div>
              <div className="text-xs mt-1 text-gray-600">{strengthLabels[passwordStrength]}</div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#4a2e2e] mb-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#9b3f3f]"
                required
              />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />

            <button
              type="submit"
              className="w-full bg-[#9b3f3f] text-white py-2 rounded hover:bg-[#7a2d2d] transition"
            >
              Sign up
            </button>

            <div className="text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-[#9b3f3f] font-semibold hover:underline">Sign in</Link>
            </div>

            <p className="text-[10px] text-gray-500 text-center mt-2">
              * Use a Gmail account for best compatibility.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
