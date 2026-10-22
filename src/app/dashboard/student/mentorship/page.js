"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getMentorsAction, bookMentorSessionAction, getStudentBookingsAction 
} from "@/actions/mentorship";
import { 
  GraduationCap, Star, Calendar, Clock, Video, CheckCircle2, 
  ArrowRight, ArrowLeft, Search, Filter, ShieldCheck, Sparkles,
  Building, User, Send, ExternalLink
} from "lucide-react";

export default function MentorshipHubPage() {
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("mentors"); // mentors | my_bookings

  // Booking Modal State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-10-15");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, bRes] = await Promise.all([
        getMentorsAction({ search: searchQuery, company: companyFilter }),
        getStudentBookingsAction()
      ]);
      if (mRes?.success) setMentors(mRes.mentors || []);
      if (bRes?.success) setBookings(bRes.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyFilter]);

  const handleOpenBooking = (mentor, service = null) => {
    setSelectedMentor(mentor);
    setSelectedService(service || mentor.services?.[0] || null);
    setSelectedSlot(mentor.availableSlots?.[0]?.time || "05:00 PM - 05:45 PM");
    setBookingNotes("");
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedMentor) return;
    setBookingInProgress(true);
    try {
      const res = await bookMentorSessionAction(selectedMentor.id, {
        serviceName: selectedService?.name || "1:1 Career Guidance",
        duration: selectedService?.duration || "45 Mins",
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: bookingNotes
      });
      if (res?.success) {
        setBookingSuccess(true);
        // Refresh bookings
        const bRes = await getStudentBookingsAction();
        if (bRes?.success) setBookings(bRes.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <span className="bg-blue-50 text-[#1C4980] px-2 py-0.5 rounded-full font-bold">ALUMNI & INDUSTRY MENTORSHIP</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="h-7 w-7 text-[#1C4980]" />
            1-on-1 Mentorship & FAANG Mock Interviews
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Book 1:1 sessions with verified engineering leaders, senior product managers, and consultants from Google, Microsoft, Amazon & McKinsey.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("mentors")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "mentors" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Top Mentors
          </button>
          <button
            onClick={() => setActiveTab("my_bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my_bookings" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            My Sessions ({bookings.length})
          </button>
        </div>
      </div>

      {activeTab === "mentors" ? (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {["ALL", "Google", "Microsoft", "Amazon", "McKinsey"].map((comp) => (
                <button
                  key={comp}
                  onClick={() => setCompanyFilter(comp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    companyFilter === comp
                      ? "bg-[#1C4980] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {comp === "ALL" ? "All Companies" : comp}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500 font-semibold">
              Showing <strong>{mentors.length}</strong> verified senior mentors
            </p>
          </div>

          {/* Mentors Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-semibold text-xs">Loading mentors...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar, Name, Company Badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <img
                            src={mentor.avatar}
                            alt={mentor.name}
                            className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                          />
                          <span className="absolute -bottom-1 -right-1 text-sm">
                            {mentor.companyLogo || "🏢"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
                            {mentor.alumniStatus && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.2 rounded-full border border-amber-200">
                                {mentor.alumniStatus}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-600">{mentor.title}</p>
                          <p className="text-[11px] font-bold text-[#1C4980]">{mentor.company}</p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-black text-amber-800">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{mentor.rating}</span>
                        <span className="text-[10px] text-amber-600 font-normal">({mentor.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mentor.bio}
                    </p>

                    {/* Skills tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {mentor.skills?.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Available 1:1 Offerings</p>
                    <div className="space-y-1.5">
                      {mentor.services?.map((svc) => (
                        <div
                          key={svc.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between hover:bg-blue-50/40 transition-colors"
                        >
                          <div>
                            <p className="font-bold text-xs text-slate-900">{svc.name}</p>
                            <p className="text-[10px] text-slate-500">{svc.duration} • {svc.price}</p>
                          </div>
                          <button
                            onClick={() => handleOpenBooking(mentor, svc)}
                            className="px-3 py-1.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                          >
                            Book Slot
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MY BOOKINGS TAB */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Calendar className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No booked sessions</h3>
              <p className="text-xs text-slate-500">Book a 1:1 session with a mentor to get placement coaching.</p>
              <button
                onClick={() => setActiveTab("mentors")}
                className="px-4 py-2 rounded-xl bg-[#1C4980] text-white font-bold text-xs"
              >
                Explore Mentors
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#1C4980] text-white flex items-center justify-center text-xl font-bold">
                      🧑‍🏫
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {b.status || "CONFIRMED"}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{b.serviceName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Mentor: <strong>{b.mentorName} ({b.mentorCompany})</strong>
                      </p>
                      <p className="text-xs text-[#1C4980] font-bold mt-0.5 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {b.date} at {b.timeSlot}
                      </p>
                    </div>
                  </div>

                  <a
                    href={b.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Video className="h-4 w-4" />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#1C4980]">Book 1:1 Mentorship Session</p>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedMentor.name}</h3>
                <p className="text-[11px] text-slate-500">{selectedMentor.title} at {selectedMentor.company}</p>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-slate-900">Session Confirmed!</h3>
                <p className="text-xs text-slate-600">
                  Your 1:1 session with {selectedMentor.name} has been booked. Google Meet calendar invite has been dispatched.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { setSelectedMentor(null); setActiveTab("my_bookings"); }}
                    className="px-5 py-2 rounded-xl bg-[#1C4980] text-white font-bold text-xs"
                  >
                    View My Sessions
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Service Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Service</label>
                  <select
                    value={selectedService?.id || ""}
                    onChange={(e) => {
                      const svc = selectedMentor.services?.find(s => s.id === e.target.value);
                      setSelectedService(svc);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  >
                    {selectedMentor.services?.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.duration})</option>
                    ))}
                  </select>
                </div>

                {/* Date and Slot */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Session Date</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Available Slot</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold"
                    >
                      {selectedMentor.availableSlots?.map(slot => (
                        <option key={slot.id} value={slot.time}>{slot.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">What would you like help with? *</label>
                  <textarea
                    rows={3}
                    required
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="E.g. Target companies, specific algorithms, or resume bullets to audit..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingInProgress}
                    className="px-5 py-2 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    {bookingInProgress ? "Confirming..." : "Confirm 1:1 Session"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
