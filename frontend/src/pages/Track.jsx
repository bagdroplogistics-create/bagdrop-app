import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Luggage, MapPin, CheckCircle2, Circle, FastForward } from "lucide-react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { BookingsAPI } from "../api";
import { toast } from "sonner";

const STAGES = [
  { key: "booked", label: "Booking confirmed" },
  { key: "picked", label: "Picked up" },
  { key: "transit", label: "In transit" },
  { key: "out", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function Track() {
  const { search } = useLocation();
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const c = params.get("code");
    if (c) {
      setCode(c);
      fetchTrack(c);
    } else {
      // try latest active booking
      BookingsAPI.list()
        .then((list) => {
          const active = list.find((b) => !["Delivered", "Cancelled"].includes(b.status)) || list[0];
          if (active) {
            setCode(active.code);
            setBooking(active);
          }
        })
        .catch(() => {});
    }
  }, [search]);

  const fetchTrack = async (c) => {
    if (!c) return;
    setLoading(true);
    try {
      const data = await BookingsAPI.track(c.trim().toUpperCase());
      setBooking(data);
    } catch {
      toast.error("Booking not found");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const advance = async () => {
    if (!booking) return;
    try {
      const nextIdx = Math.min((booking.stage_index ?? 0) + 1, STAGES.length - 1);
      const updated = await BookingsAPI.updateStatus(booking.id, { stage_index: nextIdx });
      setBooking(updated);
      toast.success(`Status: ${updated.status}`);
    } catch {
      toast.error("Could not update status");
    }
  };

  const currentStageIdx = booking?.stage_index ?? -1;

  return (
    <div className="app-shell">
      <Header />
      <div className="px-5 pt-2">
        <h2 className="text-2xl font-bold text-gray-900">Track your bag</h2>
        <p className="text-sm text-gray-500 mt-1">Enter your booking ID to see live status.</p>
      </div>

      <div className="px-5 mt-5">
        <div className="relative">
          <input
            className="input with-icon-left h-12"
            placeholder="e.g. BD24310"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTrack(code)}
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button onClick={() => fetchTrack(code)} disabled={loading} className="btn-primary mt-3 w-full h-12">
          {loading ? "Looking up…" : "Track Now"}
        </button>
      </div>

      {booking ? (
        <div className="px-5 mt-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Current shipment</h3>
          <div className={`service-card accent-${booking.service_color || "orange"}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center icon-bubble-${booking.service_color || "orange"}`}>
              <Luggage size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{booking.service_title}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{booking.pickup_address} → {booking.drop_address}</p>
              <p className="text-[11px] text-gray-400 mt-1">#{booking.code} · {booking.total_bags} bag(s)</p>
            </div>
            <span className="status-pill status-transit">{booking.status}</span>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">
            <ol className="relative space-y-5">
              {STAGES.map((st, i) => {
                const done = i <= currentStageIdx;
                return (
                  <li key={st.key} className="flex items-start gap-3">
                    {done ? (
                      <CheckCircle2 size={20} className={i === currentStageIdx ? "text-orange-500" : "text-green-500"} />
                    ) : (
                      <Circle size={20} className="text-gray-300" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${done ? "text-gray-900" : "text-gray-400"}`}>{st.label}</p>
                      <p className="text-[11px] text-gray-400">
                        {done ? (i === currentStageIdx ? "Active now" : "Completed") : "Pending"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {currentStageIdx < STAGES.length - 1 && (
            <button
              onClick={advance}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100"
            >
              <FastForward size={16} /> Advance shipment (demo)
            </button>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={14} className="text-orange-500" />
            Live tracking active · {booking.time_slot}
          </div>
        </div>
      ) : (
        <div className="px-5 mt-10">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center text-sm text-gray-500">
            Enter a booking ID above to view live status.
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
