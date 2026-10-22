"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  scanOfferLetterClausesAction, generateCounterOfferLetterAction 
} from "@/actions/ai";
import { 
  Scale, Plus, Trash2, Sparkles, Building, MapPin, 
  IndianRupee, ShieldAlert, CheckCircle2, AlertTriangle, 
  ArrowLeft, Download, RefreshCw, Send, Copy, Check, Info
} from "lucide-react";

export default function OfferComparisonPage() {
  // Offers List
  const [offers, setOffers] = useState([
    {
      id: "1",
      company: "Stripe",
      role: "Software Development Engineer",
      location: "Bangalore",
      ctc: 36.0, // in LPA
      base: 24.0,
      variable: 4.0,
      joiningBonus: 4.0,
      stocks: 4.0,
      bondMonths: 0
    },
    {
      id: "2",
      company: "Morgan Stanley",
      role: "Technology Analyst",
      location: "Mumbai",
      ctc: 24.5,
      base: 18.0,
      variable: 3.5,
      joiningBonus: 3.0,
      stocks: 0,
      bondMonths: 0
    },
    {
      id: "3",
      company: "Barclays",
      role: "Graduate Technology Developer",
      location: "Pune",
      ctc: 14.2,
      base: 11.5,
      variable: 1.5,
      joiningBonus: 1.2,
      stocks: 0,
      bondMonths: 0
    }
  ]);

  // Cost of living multipliers relative to Mumbai
  const cityMultipliers = {
    "Mumbai": 1.0,
    "Bangalore": 0.92,
    "Hyderabad": 0.76,
    "Pune": 0.78,
    "Gurgaon": 0.85,
    "Noida": 0.72,
    "Remote": 0.55
  };

  // Indian Income Tax Calculator (New Tax Regime FY 2025-26)
  const calculateTaxAndInHand = (baseLpa, variableLpa = 0) => {
    const annualGross = (baseLpa + variableLpa) * 100000;
    const pfDeduction = (baseLpa * 100000) * 0.12; // 12% EPF
    const standardDeduction = 75000; // New Tax Regime FY 2025-26
    const taxableIncome = Math.max(annualGross - standardDeduction - pfDeduction, 0);

    let tax = 0;
    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 700000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 50000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 80000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 140000 + (taxableIncome - 1500000) * 0.30;
    }

    // 87A rebate for taxable income <= 7 LPA
    if (taxableIncome <= 700000) tax = 0;

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const annualInHand = annualGross - totalTax - pfDeduction;
    const monthlyInHand = Math.round(annualInHand / 12);

    return {
      annualGross,
      pfDeduction,
      totalTax: Math.round(totalTax),
      annualInHand: Math.round(annualInHand),
      monthlyInHand
    };
  };

  // Scanner States
  const [offerTextToScan, setOfferTextToScan] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Negotiation Script States
  const [counterTarget, setCounterTarget] = useState("Morgan Stanley");
  const [desiredCTC, setDesiredCTC] = useState("28 LPA");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [negotiationLetter, setNegotiationLetter] = useState(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const handleScanOffer = async () => {
    if (!offerTextToScan) return;
    setScanning(true);
    setScanResult(null);
    try {
      const res = await scanOfferLetterClausesAction(offerTextToScan);
      if (res?.success) {
        setScanResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleGenerateCounter = async () => {
    setGeneratingLetter(true);
    try {
      const targetOffer = offers.find(o => o.company === counterTarget) || offers[0];
      const competingOffer = offers.find(o => o.company !== counterTarget) || offers[1];
      
      const res = await generateCounterOfferLetterAction(
        targetOffer.company,
        `${targetOffer.ctc} LPA`,
        competingOffer.company,
        desiredCTC,
        `Competing campus offer of ${competingOffer.ctc} LPA at ${competingOffer.company}`
      );
      if (res?.success) {
        setNegotiationLetter(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const addEmptyOffer = () => {
    setOffers([
      ...offers,
      {
        id: Date.now().toString(),
        company: "New Corporate Partner",
        role: "Software Engineer",
        location: "Mumbai",
        ctc: 18.0,
        base: 14.0,
        variable: 2.0,
        joiningBonus: 2.0,
        stocks: 0,
        bondMonths: 0
      }
    ]);
  };

  const updateOffer = (id, field, value) => {
    setOffers(offers.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeOffer = (id) => {
    if (offers.length <= 1) return;
    setOffers(offers.filter(o => o.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DD3333] mb-1">
            <Link href="/dashboard/student/offers" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to My Offers
            </Link>
            <span>•</span>
            <span className="bg-red-50 text-[#DD3333] px-2 py-0.5 rounded-full font-bold">COMPENSATION BATTLEGROUND</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Multi-Offer Battleground & In-Hand Tax Calculator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare packages side-by-side with New Tax Regime take-home estimates, city living costs, and AI clause risk scanning.
          </p>
        </div>

        <button
          onClick={addEmptyOffer}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Another Offer</span>
        </button>
      </div>

      {/* SECTION 1: SIDE BY SIDE COMPARISON MATRIX */}
      <div className="grid md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => {
          const breakdown = calculateTaxAndInHand(Number(offer.base) || 0, Number(offer.variable) || 0);
          const cityCostIndex = cityMultipliers[offer.location] || 1.0;
          const adjustedPurchasingPower = Math.round(breakdown.monthlyInHand / cityCostIndex);

          return (
            <div 
              key={offer.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5 relative"
            >
              {offers.length > 1 && (
                <button
                  onClick={() => removeOffer(offer.id)}
                  className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Remove Offer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              {/* Company & Role Header */}
              <div className="space-y-2 pr-6">
                <input
                  type="text"
                  value={offer.company}
                  onChange={(e) => updateOffer(offer.id, "company", e.target.value)}
                  className="font-bold font-display text-lg text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-[#DD3333] focus:outline-none"
                />
                <input
                  type="text"
                  value={offer.role}
                  onChange={(e) => updateOffer(offer.id, "role", e.target.value)}
                  className="text-xs text-slate-500 w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-[#DD3333] focus:outline-none"
                />
                
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-[#DD3333]" />
                  <select
                    value={offer.location}
                    onChange={(e) => updateOffer(offer.id, "location", e.target.value)}
                    className="p-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold"
                  >
                    {Object.keys(cityMultipliers).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Monthly In-Hand Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/15 space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-100">Estimated Monthly In-Hand Pay</p>
                <p className="text-2xl font-extrabold">₹{breakdown.monthlyInHand.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-emerald-100/90">
                  After EPF (₹{Math.round(breakdown.pfDeduction / 12).toLocaleString()}/mo) & Income Tax
                </p>
              </div>

              {/* Purchasing Power Comparison */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">City Purchasing Power:</span>
                <strong className="text-slate-900 font-bold">
                  ₹{adjustedPurchasingPower.toLocaleString("en-IN")} /mo
                </strong>
              </div>

              {/* Editable Package Fields */}
              <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Total CTC (LPA):</span>
                  <input
                    type="number"
                    step="0.5"
                    value={offer.ctc}
                    onChange={(e) => updateOffer(offer.id, "ctc", parseFloat(e.target.value) || 0)}
                    className="w-20 p-1.5 rounded-lg border border-slate-200 text-right font-bold text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fixed Base Pay (LPA):</span>
                  <input
                    type="number"
                    step="0.5"
                    value={offer.base}
                    onChange={(e) => updateOffer(offer.id, "base", parseFloat(e.target.value) || 0)}
                    className="w-20 p-1.5 rounded-lg border border-slate-200 text-right font-bold text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Performance Bonus:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={offer.variable}
                    onChange={(e) => updateOffer(offer.id, "variable", parseFloat(e.target.value) || 0)}
                    className="w-20 p-1.5 rounded-lg border border-slate-200 text-right font-bold text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Joining Bonus (LPA):</span>
                  <input
                    type="number"
                    step="0.5"
                    value={offer.joiningBonus}
                    onChange={(e) => updateOffer(offer.id, "joiningBonus", parseFloat(e.target.value) || 0)}
                    className="w-20 p-1.5 rounded-lg border border-slate-200 text-right font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: AI OFFER CONTRACT RISK & BOND SCANNER */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Offer Bond & Lock-in Risk Scanner</h3>
              <p className="text-xs text-slate-500">Paste contract text to flag service bonds, notice periods & non-competes.</p>
            </div>
          </div>

          <textarea
            rows={5}
            placeholder="Paste offer letter terms or employment contract text here to audit for hidden risks..."
            value={offerTextToScan}
            onChange={(e) => setOfferTextToScan(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/20"
          />

          <button
            onClick={handleScanOffer}
            disabled={scanning || !offerTextToScan}
            className="w-full py-3 rounded-xl bg-[#DD3333] hover:bg-[#c52b2b] text-white font-bold text-xs shadow-md shadow-[#DD3333]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {scanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Audit Contract Clauses</span>
          </button>

          {/* Scanner Output */}
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Risk Assessment:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  scanResult.riskLevel === "LOW" ? "bg-emerald-100 text-emerald-700" :
                  scanResult.riskLevel === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {scanResult.riskLevel} Risk ({scanResult.riskScore}/100)
                </span>
              </div>

              <div className="space-y-2">
                {scanResult.flaggedClauses?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> {item.clause}
                    </p>
                    <p className="text-slate-600 text-[11px]">{item.explanation}</p>
                    <p className="text-[#DD3333] text-[10px] font-semibold">Advice: {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* SECTION 3: AI COUNTER-OFFER LETTER BUILDER */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Counter-Offer & Negotiation Builder</h3>
              <p className="text-xs text-slate-500">Draft polite, high-leverage compensation revision emails.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Target Company</label>
              <select
                value={counterTarget}
                onChange={(e) => setCounterTarget(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              >
                {offers.map(o => <option key={o.id} value={o.company}>{o.company}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Target Desired CTC</label>
              <input
                type="text"
                value={desiredCTC}
                onChange={(e) => setDesiredCTC(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateCounter}
            disabled={generatingLetter}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {generatingLetter ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span>Generate Diplomatic Counter-Offer Email</span>
          </button>

          {negotiationLetter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Generated Email Draft:</span>
                <button
                  onClick={() => handleCopyText(negotiationLetter.emailBody)}
                  className="flex items-center gap-1 text-[#DD3333] font-semibold text-[11px] hover:underline"
                >
                  {copiedLetter ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLetter ? "Copied" : "Copy to Clipboard"}</span>
                </button>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-slate-700 whitespace-pre-line text-[11px] leading-relaxed max-h-56 overflow-y-auto">
                {negotiationLetter.emailBody}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
