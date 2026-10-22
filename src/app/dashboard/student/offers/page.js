"use client";

import { useState, useEffect } from "react";
import { getStudentOffersAction } from "@/actions/dashboard";
import { updateOfferStatusAction } from "@/actions/jobs";
import { CheckSquare, CheckCircle2, XCircle } from "lucide-react";

export default function StudentOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [studentProfile, setStudentProfile] = useState(null);

  const loadOffers = async () => {
    try {
      const res = await getStudentOffersAction();
      if (res?.success) {
        setStudentProfile(res.student);
        setOffers(res.offers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOfferAction = async (offerId, status) => {
    setActionId(offerId);
    try {
      await updateOfferStatusAction(offerId, status);
      await loadOffers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId("");
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading student offer letters...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
            My Offer Letters
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Review corporate packages, download employment offers, and finalize your placement drives.
          </p>
        </div>

        <a
          href="/dashboard/student/offers/compare"
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <span>⚖️ Compare Offers & In-Hand Tax</span>
        </a>
      </div>

      {/* Offer Battleground Promo Card */}
      <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-800/40 shadow-sm">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-extrabold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full">
            Tax & Salary Engine
          </span>
          <h3 className="font-bold text-sm text-white">
            Multi-Offer Battleground & Indian Take-Home Salary Calculator
          </h3>
          <p className="text-xs text-slate-300">
            Compare monthly in-hand cash after New Tax Regime & EPF, check city cost-of-living indices, and audit offer letters for service bonds.
          </p>
        </div>
        <a
          href="/dashboard/student/offers/compare"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold whitespace-nowrap shadow-sm"
        >
          Open Battleground Matrix
        </a>
      </div>

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80">
            <CheckSquare className="h-12 w-12 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="font-semibold text-slate-500 dark:text-zinc-400">No offers received yet</p>
            <p className="text-xs text-slate-400 mt-1">Clear technical assessments to receive offer letters.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div 
              key={offer.id}
              className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 grid md:grid-cols-4 gap-6 items-center"
            >
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Corporate Offer Letter
                </span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {offer.application?.job?.title || "Software Engineer Intern"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Company: <span className="font-semibold text-slate-700 dark:text-slate-300">{offer.application?.job?.company?.name || "Corporate Partner"}</span>
                </p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-zinc-400">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Package Value</p>
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{offer.package}</p>
              </div>

              <div className="flex flex-col gap-2">
                {offer.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOfferAction(offer.id, "ACCEPTED")}
                      disabled={actionId === offer.id}
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleOfferAction(offer.id, "DECLINED")}
                      disabled={actionId === offer.id}
                      className="flex-1 py-2 px-3 rounded-lg bg-rose-50/20 border border-rose-100 dark:border-rose-950/30 text-rose-600 hover:bg-rose-50/40 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                ) : (
                  <span 
                    className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center w-full
                      ${offer.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}
                    `}
                  >
                    Offer {offer.status}
                  </span>
                )}
                
                {offer.offerLetterUrl && (
                  <a 
                    href={offer.offerLetterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline text-center font-semibold mt-1"
                  >
                    Download PDF Document
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
