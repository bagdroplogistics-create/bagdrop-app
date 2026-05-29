import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Phone, ShieldCheck, KeyRound } from "lucide-react";
import { AuthAPI, LOGO_URL_OK } from "../api";
import { LOGO_URL } from "../mock";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/home";
  const { login, isAuthed } = useAuth();

  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [phone, setPhone] = useState("");
  const [normalized, setNormalized] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [mockOtp, setMockOtp] = useState("");

  useEffect(() => {
    if (isAuthed) navigate(redirect, { replace: true });
  }, [isAuthed, navigate, redirect]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setSending(true);
    try {
      const res = await AuthAPI.requestOtp(phone);
      setNormalized(res.phone);
      setStep(2);
      setResendIn(30);
      if (res.mocked) {
        setMockOtp(res.mock_otp);
        toast.success(`OTP sent (DEV): ${res.mock_otp}`);
      } else {
        toast.success("OTP sent to your mobile");
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleCodeChange = (i, v) => {
    const next = [...code];
    next[i] = v.replace(/\D/g, "").slice(0, 1);
    setCode(next);
    if (next[i] && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      if (el) el.focus();
    }
  };

  const handleCodePaste = (e) => {
    const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCode(next);
    const focusIdx = Math.min(pasted.length, 5);
    const el = document.getElementById(`otp-${focusIdx}`);
    if (el) el.focus();
  };

  const verify = async () => {
    const full = code.join("");
    if (full.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setVerifying(true);
    try {
      const res = await AuthAPI.verifyOtp(normalized || phone, full, name || undefined);
      login(res.token, res.user);
      toast.success(`Welcome${res.user.name ? ", " + res.user.name : ""}!`);
      setTimeout(() => navigate(redirect, { replace: true }), 400);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="app-shell flex flex-col min-h-screen bg-white">
      <div className="flex items-center px-5 pt-5">
        <button
          className="icon-btn"
          onClick={() => (step === 2 ? setStep(1) : navigate("/"))}
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center overflow-hidden">
            <img src={LOGO_URL} alt="Bagdrop" style={{ width: 50, height: 50, objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] font-bold text-orange-600 uppercase">Bagdrop</p>
            <p className="text-sm text-gray-500">Bag. Box. Delivered.</p>
          </div>
        </div>

        {step === 1 ? (
          <div className="fade-in">
            <h1 className="text-2xl font-bold text-gray-900">Sign in to continue</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your mobile number to receive a verification code.</p>

            <div className="mt-7">
              <label className="label">Mobile Number</label>
              <div className="relative">
                <input
                  data-testid="login-phone"
                  className="input with-icon-left h-12 text-base tracking-wide"
                  placeholder="9876543210"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                />
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-400 mt-2">By continuing you agree to our Terms and Privacy Policy.</p>
            </div>

            <button onClick={sendOtp} disabled={sending} className="btn-primary w-full h-14 mt-6">
              {sending ? "Sending…" : "Send OTP"}
            </button>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Feature icon={ShieldCheck} label="Secure" />
              <Feature icon={KeyRound} label="Quick" />
              <Feature icon={Phone} label="Mobile OTP" />
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <h1 className="text-2xl font-bold text-gray-900">Verify your number</h1>
            <p className="text-sm text-gray-500 mt-1">
              We sent a 6-digit code to <span className="font-semibold text-gray-700">{normalized}</span>
            </p>
            {mockOtp && (
              <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3 text-[12px] text-orange-800">
                <strong>DEV (mocked):</strong> Your OTP is <strong className="tracking-widest">{mockOtp}</strong>. Real SMS will be added later.
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 justify-between" onPaste={handleCodePaste}>
              {code.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  data-testid={`otp-${i}`}
                  className="otp-box"
                  value={d}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[i] && i > 0) {
                      const el = document.getElementById(`otp-${i - 1}`);
                      if (el) el.focus();
                    }
                  }}
                  inputMode="numeric"
                  maxLength={1}
                />
              ))}
            </div>

            <div className="mt-4">
              <label className="label">Your name <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="input" placeholder="e.g. Aarav Sharma" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <button onClick={verify} disabled={verifying} className="btn-primary w-full h-14 mt-6">
              {verifying ? "Verifying…" : "Verify & Continue"}
            </button>

            <div className="mt-4 text-center text-sm">
              {resendIn > 0 ? (
                <span className="text-gray-400">Resend OTP in {resendIn}s</span>
              ) : (
                <button onClick={sendOtp} className="text-orange-600 font-semibold hover:underline">Resend OTP</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-gray-50 border border-gray-100">
      <Icon size={18} className="text-orange-500" />
      <span className="text-[11px] font-medium text-gray-600">{label}</span>
    </div>
  );
}

