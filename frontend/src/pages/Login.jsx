import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "../firebase";

export default function Login() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);

  const sendOTP = async () => {

    try {

      window.recaptchaVerifier =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          `+91${phone}`,
          window.recaptchaVerifier
        );

      setConfirmObj(confirmation);

      alert("OTP sent");

    } catch (error) {

      console.error(error);

      alert("Failed to send OTP");

    }
  };

  const verifyOTP = async () => {

    try {

      await confirmObj.confirm(otp);

      alert("Login successful");

      navigate("/home");

    } catch (error) {

      console.error(error);

      alert("Invalid OTP");

    }
  };

  return (
    <div className="app-shell p-5">

      <h1 className="text-2xl font-bold mb-6">
        Login
      </h1>

      <input
        className="input mb-4"
        placeholder="Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={sendOTP}
        className="btn-primary w-full mb-4"
      >
        Send OTP
      </button>

      <input
        className="input mb-4"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={verifyOTP}
        className="btn-primary w-full"
      >
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>

    </div>
  );
}
