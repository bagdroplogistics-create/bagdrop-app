import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";

import Booking from "./pages/Booking";
import Track from "./pages/Track";
import History from "./pages/History";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} /
          <Route path="/book/:serviceId" element={<Booking />} />
          <Route path="/track" element={<Track />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
