import React from "react";
import { Home, MapPin, Clock, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  { key: "home", label: "Home", icon: Home, path: "/home" },
  { key: "track", label: "Track", icon: MapPin, path: "/track" },
  { key: "history", label: "History", icon: Clock, path: "/history" },
  { key: "profile", label: "Profile", icon: User, path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="bottom-nav">
      {items.map((it) => {
        const active = location.pathname.startsWith(it.path);
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            onClick={() => navigate(it.path)}
            className={`nav-item ${active ? "active" : ""}`}
            aria-label={it.label}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
