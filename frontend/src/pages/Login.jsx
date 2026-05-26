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

  const setupRecaptcha = () => {

    if (!window.recaptchaVerifier) {

      window.recaptchaVerifier =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {}
          }
        );
    }
  };

  const sendOTP = async () => {

    try {

      setupRecaptcha();

      const appVerifier =
        window.recaptchaVerifier;

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          `+91${phone}`,
          appVerifier
        );

      setConfirmObj(confirmation);

      alert("OTP sent successfully");

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

      <h1 className="text-3xl font-bold mb-2">
        Welcome to Bagdrop
      </h1>

      <p className="text-gray-500 mb-6">
        Login with your mobile number
      </p>

      <input
        className="input mb-4"
        placeholder="Enter Mobile Number"
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

