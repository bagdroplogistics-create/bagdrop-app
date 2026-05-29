import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, CalendarDays, Luggage, Check, Phone, User, Plane, Truck, ArrowRightLeft, Moon, Building2, MapPinned, Hotel } from "lucide-react";
import { toast } from "sonner";
import { SERVICES, LOCATIONS, BAG_TYPES } from "../mock";
import { BookingsAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const ICONS = { Truck, Plane, ArrowRightLeft, Moon, Building2, MapPinned, Luggage, Hotel };

export default function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId) || SERVICES[0], [serviceId]);
  const Icon = ICONS[service.icon];

  const [step, setStep] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [date, setDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bagCount, setBagCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  // Prefill contact details from logged-in user
  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const [selectedBag, setSelectedBag] = useState(0);
  const bagOptions = BAG_TYPES[service.id] || [];
  const bagType = bagOptions[selectedBag];

  const totalBags = bagCount;
  const totalPrice = bagCount * bagType.price;

  const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00", "20:00 - 22:00", "22:00 - 00:00"];

  const today = new Date().toISOString().split("T")[0];

  const canContinue = () => {
    if (step === 1) return from && to && pickupAddress && dropAddress;
    if (step === 2) {
      if (!date || !dropDate || !timeSlot || bagCount < 1) return false;
      if (dropDate < date) return false;
      return true;
    }
    if (step === 3) return name && phone && phone.length >= 10;
    return true;
  };

  const handleNext = () => {
    if (!canContinue()) {
      if (step === 2 && dropDate && date && dropDate < date) {
        toast.error("Delivery date cannot be before pickup date");
      } else {
        toast.error("Please fill in the required fields");
      }
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleConfirm = async () => {
    try {
      const fromLoc = LOCATIONS.find((l) => l.id === from);
      const toLoc = LOCATIONS.find((l) => l.id === to);
      const payload = {
        service_id: service.id,
        service_title: service.title,
        service_color: service.color,
        from_location_id: from,
        to_location_id: to,
        from_label: fromLoc?.label || "",
        to_label: toLoc?.label || "",
        pickup_address: pickupAddress,
        drop_address: dropAddress,
        date,
        drop_date: dropDate,
        time_slot: timeSlot,
        bag_selections: { [bagType.id]: bagCount },
        total_bags: totalBags,
        total_price: totalPrice,
        name,
        phone,
        email,
      };
      const res = await BookingsAPI.create(payload);
      toast.success(`Booking confirmed! ID: ${res.code}`);
      setTimeout(() => navigate("/history"), 800);
    } catch (e) {
      toast.error("Could not create booking. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="app-shell">
      <div className="flex items-center gap-3 px-5 pt-5">
        <button className="icon-btn" onClick={() => (step > 1 ? setStep(step - 1) : navigate("/home"))} aria-label="Back">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">Booking</p>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">{service.title}</h2>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center tile-${service.color}`}>
          <Icon size={20} />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center px-6 mt-5">
        {[1, 2, 3, 4].map((n) => (
          <React.Fragment key={n}>
            <span className={`step-dot ${step === n ? "active" : step > n ? "done" : ""}`}>
              {step > n ? <Check size={14} /> : n}
            </span>
            {n < 4 && <span className={`step-line ${step > n ? "active" : ""}`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between px-5 mt-2 text-[11px] text-gray-500">
        <span>Route</span><span>Bags</span><span>Contact</span><span>Review</span>
      </div>

      <div className="px-5 mt-6 pb-32 fade-in" key={step}>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label">Pickup From</label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select pickup city / airport" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">Pickup address</label>
              <input className="input" placeholder="Flat / Hotel / Landmark, Area" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
            </div>
            <div>
              <label className="label">Deliver To</label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select delivery city / airport" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">Delivery address</label>
              <input className="input" placeholder="Flat / Hotel / Landmark, Area" value={dropAddress} onChange={(e) => setDropAddress(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Pickup date</label>
                <div className="relative">
                  <input data-testid="pickup-date" type="date" className="input with-icon-right" value={date} onChange={(e) => setDate(e.target.value)} min={today} />
                  <CalendarDays size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">Delivery date</label>
                <div className="relative">
                  <input data-testid="drop-date" type="date" className="input with-icon-right" value={dropDate} onChange={(e) => setDropDate(e.target.value)} min={date || today} />
                  <CalendarDays size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="label">Pickup time slot</label>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => (
                  <button key={s} onClick={() => setTimeSlot(s)} className={`bag-tile text-sm font-medium ${timeSlot === s ? "selected" : ""}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
    
<div>
  <label className="label">Bags</label>

  <div className="space-y-3">

    {bagOptions.map((bag, index) => (

      <div
        key={bag.id}
        onClick={() => setSelectedBag(index)}
        className={`bag-tile flex items-center justify-between cursor-pointer ${
          selectedBag === index ? "selected border-orange-500" : ""
        }`}
      >

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full icon-bubble-orange flex items-center justify-center">
            <Luggage size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {bag.name}
            </p>

            <p className="text-[11px] text-gray-500">
              {bag.dim} · {bag.weight}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-700">
            ₹{bag.price}/bag
          </p>

          <Counter
            value={bagCount}
            onChange={setBagCount}
            min={1}
          />
        </div>

      </div>

    ))}

  </div>

  <p className="text-[11px] text-gray-400 mt-2">
    Carrying odd-sized or fragile items? Add a note when our team calls to confirm.
  </p>
</div>


          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <input className="input with-icon-left" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="label">Phone Number</label>
              <div className="relative">
                <input className="input with-icon-left" placeholder="+91 9XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">Review your booking</h3>
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="summary-row"><span>Service</span><span className="text-gray-900 font-medium">{service.title}</span></div>
              <div className="summary-row"><span>Pickup</span><span className="text-gray-900 text-right max-w-[60%]">{pickupAddress}<br/>{LOCATIONS.find(l=>l.id===from)?.city}</span></div>
              <div className="summary-row"><span>Drop</span><span className="text-gray-900 text-right max-w-[60%]">{dropAddress}<br/>{LOCATIONS.find(l=>l.id===to)?.city}</span></div>
              <div className="summary-row"><span>Pickup date · Slot</span><span className="text-gray-900">{date} · {timeSlot}</span></div>
              <div className="summary-row"><span>Delivery date</span><span className="text-gray-900">{dropDate}</span></div>
              <div className="summary-row"><span>Bags</span><span className="text-gray-900">{totalBags} × {bagType.name}</span></div>
              <div className="summary-row"><span>Contact</span><span className="text-gray-900">{name} · {phone}</span></div>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-orange-900">Total payable</span>
              <span className="text-xl font-bold text-orange-700">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[11px] text-gray-400">Final pricing may vary based on distance & actual weight checks at pickup.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 p-4">
        {step < 4 ? (
          <button onClick={handleNext} className="btn-primary w-full h-14">Continue</button>
        ) : (
          <button onClick={handleConfirm} className="btn-primary w-full h-14">Confirm Booking · ₹{totalPrice.toLocaleString("en-IN")}</button>
        )}
      </div>
    </div>
  );
}

function Counter({ value, onChange, min = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }} className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">-</button>
      <span className="w-5 text-center text-sm font-semibold">{value}</span>
      <button onClick={(e) => { e.stopPropagation(); onChange(value + 1); }} className="w-7 h-7 rounded-full bg-orange-500 text-white hover:bg-orange-600">+</button>
    </div>
  );
}
