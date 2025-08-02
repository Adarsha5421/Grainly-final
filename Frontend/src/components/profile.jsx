import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import API, { addEmail, removeEmail, generateBackupCodes, getBackupCodesCount } from "../api/api";
import toast from "react-hot-toast";
import { FaUserCircle, FaLock, FaEnvelope, FaShieldAlt, FaKey, FaQrcode, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [twoFA, setTwoFA] = useState({ enabled: false });
  const [qr, setQr] = useState("");
  const [twoFASecret, setTwoFASecret] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFASetup, setTwoFASetup] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [backupCount, setBackupCount] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          dob: data.dob || "",
        });
        setEmails(data.emails || []);
        setTwoFA({ enabled: !!data.twoFactorEnabled });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (twoFA.enabled) {
      getBackupCodesCount()
        .then((data) => setBackupCount(data.count))
        .catch(() => setBackupCount(null));
    }
  }, [twoFA.enabled]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwords;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({
        password: newPassword,
        currentPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await API.post("/users/2fa/generate");
      setQr(res.data.qr);
      setTwoFASecret(res.data.secret);
      setTwoFASetup(true);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to start 2FA setup");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      await API.post("/users/2fa/confirm", { code: twoFACode });
      toast.success("2FA enabled successfully");
      setTwoFA({ enabled: true });
      setTwoFASetup(false);
      setQr("");
      setTwoFASecret("");
      setTwoFACode("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to enable 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setTwoFALoading(true);
    try {
      await API.post("/users/2fa/disable");
      toast.success("2FA disabled");
      setTwoFA({ enabled: false });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to disable 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    setBackupLoading(true);
    try {
      const res = await generateBackupCodes();
      setBackupCodes(res.backupCodes);
      setBackupCount(res.backupCodes.length);
      toast.success("Backup codes generated! Save them in a safe place.");
    } catch (err) {
      toast.error(err.message || "Failed to generate backup codes");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await addEmail(newEmail);
      toast.success("Verification email sent");
      setEmails((prev) => [...prev, { address: newEmail, verified: false }]);
      setNewEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to add email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleRemoveEmail = async (address) => {
    setEmailLoading(true);
    try {
      await removeEmail(address);
      setEmails((prev) => prev.filter((e) => e.address !== address));
      toast.success("Email removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove email");
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, security, and account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Password */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-2xl text-white" />
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      disabled={saving}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      disabled={saving}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      disabled={saving}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      disabled={saving}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      disabled={saving}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaKey className="text-2xl text-white" />
                  <h2 className="text-xl font-semibold text-white">Change Password</h2>
                </div>
              </div>
              
              <form onSubmit={handleChangePassword} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      disabled={savingPassword}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      disabled={savingPassword}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwords.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      disabled={savingPassword}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={savingPassword}
                >
                  {savingPassword ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating Password...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Security & Email */}
          <div className="space-y-8">
            {/* Email Management Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-2xl text-white" />
                  <h2 className="text-xl font-semibold text-white">Email Accounts</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {emails.map((e) => (
                    <div key={e.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-700">{e.address}</span>
                        {e.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <FaCheck className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <FaTimes className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {e.address === form.email && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Primary</span>
                        )}
                      </div>
                      {e.address !== form.email && (
                        <button
                          onClick={() => handleRemoveEmail(e.address)}
                          disabled={emailLoading}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleAddEmail} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Add New Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      required
                      disabled={emailLoading}
                    />
                  </div>
                  <button
                    type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={emailLoading}
                  >
                    {emailLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-4 h-4" />
                        Add Email
                      </>
                    )}
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 text-center">You can log in from any verified email</p>
              </div>
            </div>

            {/* Two-Factor Authentication Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-2xl text-white" />
                  <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {twoFA.enabled ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FaCheck className="text-green-600" />
                      <span className="text-green-800 font-medium">2FA is enabled on your account</span>
                    </div>
                    
                    <button
                      onClick={handleDisable2FA}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                      disabled={twoFALoading}
                    >
                      {twoFALoading ? "Disabling..." : "Disable 2FA"}
                    </button>
                    
                    {/* Backup Codes Section */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Backup Codes</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Use backup codes if you lose access to your authenticator app. Each code can be used once.
                      </p>
                      
                      <div className="mb-3">
                        {backupCount !== null ? (
                          <span className="text-sm text-gray-700">
                            Backup codes remaining: <span className="font-bold text-green-600">{backupCount}</span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Loading backup code count...</span>
                        )}
                      </div>
                      
                      <button
                        onClick={handleGenerateBackupCodes}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                        disabled={backupLoading}
                      >
                        {backupLoading ? "Generating..." : "Generate New Backup Codes"}
                      </button>
                      
                      {backupCodes.length > 0 && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="font-medium text-gray-800 mb-2">Your new backup codes:</div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            {backupCodes.map((code, idx) => (
                              <div key={idx} className="bg-gray-100 border px-3 py-2 rounded font-mono text-sm text-gray-800">
                                {code}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-red-600 font-medium">
                            ⚠️ Save these codes securely - they won't be shown again!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : twoFASetup ? (
                  <form onSubmit={handleConfirm2FA} className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">Scan this QR code in your authenticator app:</p>
                      {qr && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                          <img src={qr} alt="2FA QR Code" className="w-32 h-32" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Enter code from app</label>
                      <input
                        type="text"
                        value={twoFACode}
                        onChange={e => setTwoFACode(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        required
                        disabled={twoFALoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                        disabled={twoFALoading}
                      >
                        {twoFALoading ? "Enabling..." : "Confirm & Enable 2FA"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => { setTwoFASetup(false); setQr(""); setTwoFASecret(""); setTwoFACode(""); }}
                        disabled={twoFALoading}
                        className="w-full text-gray-500 hover:text-gray-700 transition-colors py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <FaTimes className="text-yellow-600" />
                      <span className="text-yellow-800 font-medium">2FA is currently disabled</span>
                    </div>
                    
                    <button
                      onClick={handleEnable2FA}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      disabled={twoFALoading}
                    >
                      {twoFALoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <FaQrcode className="w-4 h-4" />
                          Enable 2FA
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
