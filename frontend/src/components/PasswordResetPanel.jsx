import { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

const PasswordResetPanel = ({ basePath, onClose, onSuccess, accountType }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailInputRef = useRef(null);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (step === 1 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
    );
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      ease: "power3.in",
      onComplete: onClose,
    });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
  };

  const sendOtp = async () => {
    setError("");
    if (!email) return;
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/${basePath}/forgot-password`,
        { email },
      );
      setStep(2);
    } catch (_) {
      setError("Unable to send OTP. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setError("");
    if (!otp) return;
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/${basePath}/verify-otp`,
        { email, otp },
      );
      setStep(3);
    } catch (_) {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    setError("");
    if (!password || password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/${basePath}/reset-password`,
        { email, otp, newPassword: password },
      );
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirm("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (_) {
      setError("Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
            <p className="text-sm text-blue-600 font-medium mt-1">
              Reset Password for: {accountType}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="ri-close-line text-2xl text-gray-500"></i>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  ref={emailInputRef}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  Enter the registered email for your account to receive a
                  password reset OTP.
                </p>
              </div>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <p className="mt-3 text-xs text-gray-500">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>
              <button
                onClick={verify}
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={update}
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleClose}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPanel;
