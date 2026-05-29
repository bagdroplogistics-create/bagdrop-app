import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { isAuthed, ready } = useAuth();
  const location = useLocation();
  if (!ready) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        <div className="text-sm text-gray-400">Loading…</div>
      </div>
    );
  }
  if (!isAuthed) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}
