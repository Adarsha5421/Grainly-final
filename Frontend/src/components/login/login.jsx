import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/api";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import { useBackupCode } from "../../api/api";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [backupLoading, setBackupLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!recaptchaToken) {
      toast.error("Please verify you are human");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
        token: recaptchaToken,
      });

      if (res.data.twoFactorRequired) {
        setTwoFARequired(true);
        setPendingUser({ email, password, userId: res.data.userId });
        toast("Enter your 2FA code to continue.");
        setLoading(false);
        return;
      }

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("Login successful!");
        navigate(res.data.user.isAdmin ? "/admin" : "/");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.twoFactorRequired
      ) {
        setTwoFARequired(true);
        setPendingUser({ email, password, userId: err.response.data.userId });
        toast("Enter your 2FA code to continue.");
        setLoading(false);
        return;
      }
      toast.error(err.response?.data?.msg || "Login failed");
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", {
        email: pendingUser.email,
        password: pendingUser.password,
        twoFactorCode: twoFACode,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Login successful!");
      navigate(res.data.user.isAdmin ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "2FA failed");
    }
    setLoading(false);
  };

  const handleBackupCodeSubmit = async (e) => {
    e.preventDefault();
    setBackupLoading(true);
    try {
      const res = await useBackupCode(backupCode, pendingUser.userId);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      toast.success("Login successful with backup code!");
      setShowBackupModal(false);
      navigate(res.user.isAdmin ? "/admin" : "/");
    } catch (err) {
      toast.error(err.message || "Invalid backup code");
    }
    setBackupLoading(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#fff8e1]">
      {/* Left section */}
      <div className="hidden md:flex flex-col items-center justify-center bg-[#f2c94c] px-10 text-[#4a2e2e]">
        <h1 className="text-5xl font-extrabold tracking-wide mb-4">Welcome Back!</h1>
        <p className="text-lg max-w-md text-center">
          Log in to your Grainly account to shop fresh lentils, dals, and more.
        </p>
        <img src="/grain.svg" alt="Grain Illustration" className="w-60 mt-10" />
      </div>

      {/* Right section */}
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl px-8 py-10">
          <h2 className="text-3xl font-bold text-[#4a2e2e] mb-6">Login to Grainly</h2>

          {twoFARequired ? (
            <>
              <form className="space-y-5" onSubmit={handle2FASubmit}>
                <p className="text-sm text-gray-700">
                  2FA required. Enter your authentication code.
                </p>
                <input
                  type="text"
                  placeholder="Enter 2FA Code"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#9b3f3f]"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-[#9b3f3f] text-white py-2 rounded hover:bg-[#7a2d2d] transition"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <button
                  type="button"
                  className="text-sm text-blue-600 underline"
                  onClick={() => setShowBackupModal(true)}
                >
                  Use a backup code
                </button>
              </form>

              {showBackupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
                    <h3 className="text-lg font-semibold mb-3">
                      Use Backup Code
                    </h3>
                    <form onSubmit={handleBackupCodeSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter backup code"
                        value={backupCode}
                        onChange={(e) => setBackupCode(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-[#9b3f3f] text-white py-2 rounded"
                        disabled={backupLoading}
                      >
                        {backupLoading ? "Verifying..." : "Login"}
                      </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">
                      Backup codes are one-time use only.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-[#4a2e2e] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#9b3f3f]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#4a2e2e] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#9b3f3f]"
                  required
                />
              </div>

              <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} />

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-[#9b3f3f] hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-[#9b3f3f] text-white py-2 rounded hover:bg-[#7a2d2d] transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-sm text-center text-gray-700">
                Don’t have an account?{" "}
                <Link to="/register" className="font-semibold text-[#9b3f3f] hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
