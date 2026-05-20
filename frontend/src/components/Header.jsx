import React, { useState } from "react";
import { Bell, Menu, LogOut, FileText, HelpCircle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Logo from "./Logo";

export default function Header({ title }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className="header-bar">
      <button className="icon-btn" aria-label="Notifications">
        <Bell size={18} />
      </button>
      {title && <h1 className="text-base font-semibold text-gray-800">{title}</h1>}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center overflow-hidden">
          <Logo size={28} />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
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
              <MenuItem icon={FileText} label="Terms & Conditions" onClick={() => setOpen(false)} />
              <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => setOpen(false)} />
              <MenuItem icon={Phone} label="Contact Us" onClick={() => setOpen(false)} />
              <MenuItem icon={LogOut} label="Restart Onboarding" onClick={() => { setOpen(false); navigate("/"); }} />
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-xs text-gray-400">
              Bagdrop Logistics Solutions Pvt. Ltd.
              <br />Mumbai · Delhi · Ahmedabad · Vadodara · Goa
            </div>
          </SheetContent>
        </Sheet>
      </div>
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
