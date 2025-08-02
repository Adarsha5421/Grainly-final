import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#fff8e1]">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col items-center justify-center bg-[#f2c94c] px-10 text-[#4a2e2e]">
        <h1 className="text-5xl font-bold mb-4">Set New Password</h1>
        <p className="text-lg text-center max-w-md">
          Create a secure new password to access your Grainly account.
        </p>
        <img src="/grain.svg" alt="Grain illustration" className="w-56 mt-10" />
      </div>

      {/* Right Form */}
      <div className="flex justify-center items-center px-6 py-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-xl rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-[#4a2e2e] mb-6 text-center">
            Reset Password
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#4a2e2e] mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#9b3f3f]"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4a2e2e] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#9b3f3f]"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#9b3f3f] text-white py-2 rounded hover:bg-[#7a2d2d] transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="text-sm text-center text-gray-600 mt-4">
            Go back to{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#9b3f3f] font-semibold hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
