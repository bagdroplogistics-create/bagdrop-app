import React from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { ChevronRight, MapPin, Phone, Mail, Shield, FileText, HelpCircle, LogOut, Star } from "lucide-react";
import { USER } from "../mock";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const Row = ({ icon: Icon, label, sub, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left transition-colors">
      <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
        <Icon size={17} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  );

  return (
    <div className="app-shell">
      <Header />
      <div className="px-5 pt-2">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      </div>

      <div className="px-5 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {USER.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg leading-tight">{USER.name}</p>
              <p className="text-sm text-orange-50">{USER.phone}</p>
            </div>
            <Star size={18} className="text-yellow-200" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-xs text-orange-50">Bookings</p>
              <p className="text-xl font-bold">{USER.total_bookings}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-xs text-orange-50">Member since</p>
              <p className="text-sm font-semibold">{USER.member_since}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mx-5 rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <Row icon={MapPin} label="Saved addresses" sub="Home, Office, Hotel" />
        <div className="border-t border-gray-50" />
        <Row icon={Phone} label="Phone" sub={USER.phone} />
        <div className="border-t border-gray-50" />
        <Row icon={Mail} label="Email" sub={USER.email} />
      </div>

      <div className="mt-4 mx-5 rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <Row icon={Shield} label="Privacy & Security" />
        <div className="border-t border-gray-50" />
        <Row icon={FileText} label="Terms & Conditions" />
        <div className="border-t border-gray-50" />
        <Row icon={HelpCircle} label="Help & Support" sub="+91 96245 16661" />
      </div>

      <div className="mx-5 mt-4 mb-2">
        <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100">
          <LogOut size={16} /> Restart Onboarding
        </button>
      </div>
      <p className="text-center text-[11px] text-gray-400 mt-3">Bagdrop · v1.0.0</p>

      <BottomNav />
    </div>
  );
}
