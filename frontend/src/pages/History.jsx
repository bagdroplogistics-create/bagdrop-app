import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { Luggage, RefreshCw } from "lucide-react";
import { BookingsAPI } from "../api";
import { toast } from "sonner";

const TABS = ["All", "Active", "Delivered"];

export default function History() {
  const [tab, setTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    BookingsAPI.list()
      .then((data) => setBookings(data))
      .catch(() => toast.error("Could not load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await BookingsAPI.cancel(id);
      toast.success("Booking cancelled");
      load();
    } catch {
      toast.error("Could not cancel");
    }
  };

  const filtered = bookings.filter((b) => {
    if (tab === "Active") return !["Delivered", "Cancelled"].includes(b.status);
    if (tab === "Delivered") return b.status === "Delivered";
    return true;
  });

  return (
    <div className="app-shell">
      <Header />
      <div className="px-5 pt-2 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your bookings</h2>
          <p className="text-sm text-gray-500 mt-1">All past and active shipments in one place.</p>
        </div>
        <button onClick={load} className="icon-btn" aria-label="Refresh">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="px-5 mt-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 mt-5 space-y-3">
        {filtered.map((b) => {
          const color = b.service_color || "orange";
          const statusClass = b.status === "Delivered" ? "status-delivered" : b.status === "Booked" ? "status-scheduled" : "status-transit";
          return (
            <div key={b.id} className={`service-card accent-${color}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center icon-bubble-${color}`}>
                <Luggage size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">{b.service_title}</h4>
                  <span className={`status-pill ${statusClass}`}>{b.status}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">{b.pickup_address} → {b.drop_address}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gray-400">#{b.code} · {b.date} · {b.total_bags} bag(s)</span>
                  <span className="text-sm font-semibold text-gray-900">₹{(b.total_price || 0).toLocaleString("en-IN")}</span>
                </div>
                {!["Delivered", "Cancelled"].includes(b.status) && (
<button
  onClick={async () => {
    try {

      await cancelBooking(b.id);

    } catch (error) {

      console.error(error);

      toast.error("Failed to cancel booking");

    }
  }}
  className="mt-3 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
>
  Cancel Booking
</button>

                )}
              </div>
            </div>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No bookings in this view.
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
