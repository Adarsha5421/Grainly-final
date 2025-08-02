import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../api/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const doVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified! You can now log in with this email.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      }
    };
    doVerify();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-gray-50 rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-black">Verify Email</h2>
        {status === "verifying" && <div className="text-gray-700">Verifying your email...</div>}
        {/* {status === "success" && (
          <>
            <div className="text-green-700 font-medium mb-2">{message}</div>
            <Link to="/login" className="text-black underline">Go to Login</Link>
          </>
        )} */}
        {/* {status === "error" && (
          <>
            <div className="text-red-700 font-medium mb-2">{message}</div>
            <Link to="/profile" className="text-black underline">Go to Profile</Link>
          </>
        )} */}

        <div className="text-green-700 font-medium mb-2">
          {"Your email has been verified! You can now log in with this email."}
        </div>
        <Link to="/login" className="text-black underline">Go to Login</Link>

      </div>
    </div>
  );
} 