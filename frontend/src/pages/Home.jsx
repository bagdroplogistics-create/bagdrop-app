import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinned, Plane, Luggage, Moon, Building2, ArrowRight, Bell, Menu, FileText, HelpCircle, Phone, LogOut, Clock, Hotel } from "lucide-react";
import BottomNav from "../components/BottomNav";
import Logo from "../components/Logo";
import { SERVICES, SERVICE_CATEGORIES } from "../mock";
import { BookingsAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

const ICONS = { MapPinned, Plane, Luggage, Moon, Building2, Hotel };

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [activeCat, setActiveCat] = useState(SERVICE_CATEGORIES[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const greetName = user?.name ? user.name.split(" ")[0] : "Traveler";

  useEffect(() => {
    BookingsAPI.list()
      .then((data) => {
        const live = data.filter((b) => !["Delivered", "Cancelled"].includes(b.status));
        setUpcoming(live);
      })
      .catch(() => setUpcoming([]));
  }, []);

  const services = SERVICES.filter((s) => s.category === activeCat);

  return (
    <div className="app-shell">
      {/* Premium header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <p className="text-sm text-gray-500">Hello, {greetName} <span aria-hidden>👋</span></p>
          <p className="text-[15px] font-semibold text-gray-900 mt-0.5">Where are your bags going today?</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center overflow-hidden" aria-label="Bagdrop logo">
            <Logo size={28} />
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="icon-btn" aria-label="Menu">
                <Menu size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <Logo size={28} /> Bagdrop
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                <MenuItem icon={FileText} label="Terms & Conditions" onClick={() => setMenuOpen(false)} />
                <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => setMenuOpen(false)} />
                <MenuItem icon={Phone} label="Contact Us" onClick={() => setMenuOpen(false)} />
               <MenuItem icon={LogOut} label="Log out" onClick={async () => { await logout(); setMenuOpen(false); navigate("/login"); }} />
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-xs text-gray-400">
                Bagdrop Logistics Solutions Pvt. Ltd.
                <br />Mumbai · Delhi · Ahmedabad · Vadodara · Goa · Hyderabad
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-2xl font-bold text-gray-900">Pick a service</h2>
        <p className="text-sm text-gray-500 mt-1">Choose how you’d like us to handle your bags today.</p>
      </div>

      {/* Pill tabs */}
      <div className="mx-5 mt-4 p-1 rounded-full bg-gray-100 flex">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            data-testid={`tab-${cat.id}`}
            onClick={() => setActiveCat(cat.id)}
            className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${activeCat === cat.id ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4" key={activeCat}>
        {activeCat === "scheduled" ? (
          <ScheduledCards services={services} onSelect={(id) => navigate(`/book/${id}`)} />
        ) : (
          <AfterHoursCards services={services} onSelect={(id) => navigate(`/book/${id}`)} />
        )}
      </div>

      <div className="px-5 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Upcoming Bookings</h3>
          <button onClick={() => navigate("/history")} className="text-xs text-orange-600 font-medium hover:underline">See all</button>
        </div>
        <div className="mt-3">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Luggage size={22} className="text-gray-400" />
              </div>
              <p className="mt-3 text-sm text-gray-500">No upcoming bookings</p>
            </div>
          ) : (
            upcoming.map((b) => (
              <div key={b.id} onClick={() => navigate(`/track?code=${b.code}`)} className={`service-card accent-${b.service_color || "orange"} mb-3`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center icon-bubble-${b.service_color || "orange"}`}>
                  <Luggage size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{b.service_title}</h4>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{b.pickup_address} → {b.drop_address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="status-pill status-transit">{b.status}</span>
                    <span className="text-[11px] text-gray-400">#{b.code}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left text-sm text-gray-700">
      <Icon size={18} className="text-gray-500" />
      {label}
    </button>
  );
}

/* ============== Redesigned Cards ============== */
function ScheduledCards({ services, onSelect }) {
  const airport = services.find((s) => s.id === "airport-delivery");
  const door = services.find((s) => s.id === "address-to-address");
  const hotel = services.find((s) => s.id === "hotel-to-hotel");
  return (
    <div className="space-y-3 fade-in">
      {airport && <FeaturedCard service={airport} onClick={() => onSelect(airport.id)} />}
      <div className="grid grid-cols-2 gap-3">
        {door && <CompactCard service={door} icon={MapPinned} onClick={() => onSelect(door.id)} />}
        {hotel && <CompactCard service={hotel} icon={Hotel} onClick={() => onSelect(hotel.id)} />}
      </div>
    </div>
  );
}

function AfterHoursCards({ services, onSelect }) {
  const night = services.find((s) => s.id === "after-hour-airport");
  const pickup = services.find((s) => s.id === "self-collect");
  return (
    <div className="space-y-3 fade-in">
      {night && <NightCard service={night} onClick={() => onSelect(night.id)} />}
      {pickup && <PickupPointCard service={pickup} onClick={() => onSelect(pickup.id)} />}
    </div>
  );
}

function FeaturedCard({ service, onClick }) {
  return (
    <div onClick={onClick} role="button" className="card-featured">
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-popular">{service.badge || "FEATURED"}</span>
            <span className="badge-pill-orange">
              <Clock size={11} /> {service.hours}
            </span>
          </div>
          <h3 className="card-title">{service.title}</h3>
          <p className="card-subtitle mt-1.5">{service.subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-300/40">
            <Plane size={26} />
          </div>
          <div className="cta-circle-orange">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactCard({ service, icon: Icon, onClick }) {
  const isHotel = service.id === "hotel-to-hotel";
  return (
    <div onClick={onClick} role="button" className="card-compact">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHotel ? "icon-bubble-pink" : "icon-bubble-orange"}`}>
          <Icon size={22} />
        </div>
        {service.badge === "NEW" && (
          <span className={`badge ${isHotel ? "badge-new" : "badge-popular"}`}>NEW</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="card-title">{service.title}</h3>
        <p className="card-subtitle mt-1.5">{service.subtitle}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className={`badge-pill-orange ${isHotel ? "!bg-pink-50 !text-pink-600 !border-pink-200" : ""}`}>
          <Clock size={11} /> {service.hours}
        </span>
        <ArrowRight size={16} className={isHotel ? "text-pink-500" : "text-orange-500"} />
      </div>
    </div>
  );
}

function NightCard({ service, onClick }) {
  return (
    <div onClick={onClick} role="button" className="card-night">
      <div className="flex items-start gap-4 relative z-10">
        <div className="glow-clock">
          <Clock size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-pill-dark">FEATURED</span>
            {service.badge === "NEW" && <span className="badge-pill-dark">NEW</span>}
          </div>
          <h3 className="card-title !text-white">{service.title}</h3>
          <p className="card-subtitle !text-gray-300 mt-1.5">{service.subtitle}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-orange-300">
            <Moon size={12} /> {service.hours}
          </div>
        </div>
        <div className="cta-circle-orange shrink-0">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}

function PickupPointCard({ service, onClick }) {
  return (
    <div onClick={onClick} role="button" className="card-clean">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl icon-bubble-green flex items-center justify-center">
          <Building2 size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="card-title">{service.title}</h3>
          <p className="card-subtitle mt-1.5">{service.subtitle}</p>
          <div className="mt-3">
            <span className="badge-pill-orange">
              <Clock size={11} /> {service.hours}
            </span>
          </div>
        </div>
        <div className="cta-circle-light shrink-0">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}
