import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Clock, MapPin, ChevronLeft, ChevronRight, Plane, Hotel, Sparkles } from "lucide-react";
import { ONBOARDING_SLIDES, LOGO_URL } from "../mock";
import { useAuth } from "../context/AuthContext";
const ICONS = { Truck, ShieldCheck, Clock, MapPin };

export default function Onboarding() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const slide = ONBOARDING_SLIDES[idx];
  const Icon = ICONS[slide.icon];
  const isLast = idx === ONBOARDING_SLIDES.length - 1;
  const isFirst = idx === 0;

 const goNext = () => (isAuthed ? "/home" : "/login");


  const next = () => {
    if (isLast) navigate(goNext());
    else setIdx(idx + 1);
  };

  return (
    <div className="app-shell flex flex-col bg-white">
      <div className="flex justify-end p-5">
      <button onClick={() => navigate(goNext())} className="text-sm text-gray-500 hover:text-gray-800 px-2">Skip</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center fade-in" key={idx}>
        {isFirst ? (
          <SplashIntro />
        ) : (
          <>
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg tile-${slide.color}`}>
              <Icon size={44} strokeWidth={2.2} />
            </div>
            <h1 className="mt-8 text-3xl font-bold text-gray-900">{slide.title}</h1>
            <p className={`mt-1 text-lg font-semibold text-tagline-${slide.color}`}>{slide.tagline}</p>
            <p className="mt-5 text-gray-500 leading-relaxed max-w-xs">{slide.description}</p>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 pb-10 px-6">
        <div className="flex items-center gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <span key={i} className={`dot ${i === idx ? "active" : ""}`} />
          ))}
        </div>
        <div className="flex items-center gap-3 w-full justify-center">
          {idx > 0 && (
            <button onClick={() => setIdx(idx - 1)} className="btn-ghost" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
          )}
          <button onClick={next} className="btn-primary flex-1 max-w-[320px] h-14">
            {isLast ? "Get Started" : isFirst ? "Continue" : "Next"}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SplashIntro() {
  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-[360px]">
        {/* soft gradient halo */}
        <div className="absolute inset-0 -z-0 rounded-[36px] bg-gradient-to-b from-orange-100/70 via-orange-50/50 to-white" />

        <div className="relative z-10 py-10">
          {/* Floating service chips */}
          <div className="relative h-56">
            <Chip className="absolute left-0 top-2" color="orange" icon="plane" label="Airport" />
            <Chip className="absolute right-0 top-8" color="pink" icon="hotel" label="Hotel" />
            <Chip className="absolute left-4 bottom-2" color="green" icon="sparkles" label="Door" />

            {/* Logo tile center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 splash-logo-wrap">
              <img
                src={LOGO_URL}
                alt="Bagdrop"
                style={{ width: 124, height: 124, objectFit: "cover", objectPosition: "center top", borderRadius: 22 }}
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] tracking-[0.18em] font-bold text-orange-600 uppercase">Bagdrop</p>
            <h1 className="mt-2 text-[28px] leading-tight font-extrabold text-gray-900">
              Bag. Box. <span className="text-orange-600">Delivered.</span>
            </h1>
            <p className="mt-4 text-gray-500 leading-relaxed max-w-[300px] mx-auto">
              India's hands-free luggage service. Mumbai · Delhi · Ahmedabad · Vadodara · Goa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ className = "", color = "orange", icon = "plane", label }) {
  const Icon = icon === "plane" ? Plane : icon === "hotel" ? Hotel : Sparkles;
  return (
    <div className={`${className} flex items-center gap-2 bg-white border border-gray-100 rounded-full pl-2 pr-3 py-1.5 shadow-md`}>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center icon-bubble-${color}`}>
        <Icon size={14} />
      </span>
      <span className="text-[12px] font-semibold text-gray-700">{label}</span>
    </div>
  );
}
