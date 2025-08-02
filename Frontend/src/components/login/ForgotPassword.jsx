import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent! Check your email.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#fff8e1]">
      {/* Left Info Panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[#f2c94c] text-[#4a2e2e] px-10">
        <h1 className="text-5xl font-bold mb-4">Reset Password</h1>
        <p className="text-lg text-center max-w-md">
          Forgot your password? No worries — we'll email you a secure reset link.
        </p>
        <img src="/grain.svg" alt="Grain Illustration" className="w-56 mt-10" />
      </div>

      {/* Right Form Card */}
      <div className="flex justify-center items-center px-6 py-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-[#4a2e2e] mb-6 text-center">
            Forgot Password
          </h2>
          <label className="block text-sm font-medium text-[#4a2e2e] mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-[#9b3f3f]"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#9b3f3f] text-white py-2 rounded hover:bg-[#7a2d2d] transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-700">Remembered your password?</span>{" "}
            <button
              type="button"
              className="text-[#9b3f3f] font-semibold hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
