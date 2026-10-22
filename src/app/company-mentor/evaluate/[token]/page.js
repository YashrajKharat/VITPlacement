"use client";

import { useState, useEffect, use } from "react";
import { 
  getCompanyEvaluationByTokenAction, 
  submitCompanyEvaluationAction 
} from "@/actions/internships";
import { 
  Building, Star, CheckCircle2, ShieldCheck, AlertCircle, 
  User, Calendar, Lock, Send, Sparkles, ThumbsUp
} from "lucide-react";

export default function StandaloneCompanyMentorEvaluationPage({ params }) {
  const unwrappedParams = use(params);
  const token = unwrappedParams.token;

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields (6 criteria /5 each)
  const [mentorName, setMentorName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [technicalKnowledge, setTechnicalKnowledge] = useState(5);
  const [qualityOfWork, setQualityOfWork] = useState(5);
  const [problemSolving, setProblemSolving] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [teamwork, setTeamwork] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await getCompanyEvaluationByTokenAction(token);
        if (res?.error) {
          setError(res.error);
        } else if (res?.evaluation) {
          setEvaluation(res.evaluation);
          setSubmission(res.evaluation.submission);
          setMentorName(res.evaluation.mentorName || "");
          setMentorEmail(res.evaluation.mentorEmail || "");
          if (res.evaluation.isSubmitted) {
            setSuccess(true);
            setTechnicalKnowledge(res.evaluation.technicalKnowledge || 5);
            setQualityOfWork(res.evaluation.qualityOfWork || 5);
            setProblemSolving(res.evaluation.problemSolving || 5);
            setCommunication(res.evaluation.communication || 5);
            setTeamwork(res.evaluation.teamwork || 5);
            setProfessionalism(res.evaluation.professionalism || 5);
            setFeedback(res.evaluation.feedback || "");
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load evaluation link");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await submitCompanyEvaluationAction(token, {
        mentorName,
        mentorEmail,
        technicalKnowledge,
        qualityOfWork,
        problemSolving,
        communication,
        teamwork,
        professionalism,
        feedback
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="text-center font-semibold text-slate-400 text-xs">
          Loading secure company evaluation link...
        </div>
      </div>
    );
  }

  if (error && !evaluation) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-black/5">
          <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-display font-bold text-slate-800">Invalid Evaluation Link</h2>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  const totalScore = technicalKnowledge + qualityOfWork + problemSolving + communication + teamwork + professionalism;

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-12 px-4 flex items-center justify-center text-left font-sans antialiased">
      <div className="max-w-2xl w-full space-y-6">
        {/* VIT Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DD3333]/10 text-[#DD3333] border border-[#DD3333]/20 text-[10px] font-bold uppercase tracking-wider font-display">
            Vidyalankar Institute of Technology (VIT Mumbai)
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            Company Mentor Internship Evaluation
          </h1>
          <p className="text-xs text-slate-500">
            Confidential student performance assessment for academic credit verification.
          </p>
        </div>

        {/* Student & Internship Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-black/5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Intern Candidate</span>
              <h3 className="text-lg font-bold font-display text-slate-800">
                {submission?.student?.name || "Student Intern"}
              </h3>
              <p className="text-xs text-slate-500">
                Department: {submission?.student?.department || "CMPN"} • {submission?.requirement?.semester?.replace("_", " ")}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Corporate Partner</span>
              <p className="text-sm font-bold text-slate-800">{submission?.companyName}</p>
              <p className="text-xs text-indigo-600 font-semibold">{submission?.internshipRole}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Work Mode</span>
              <p className="font-semibold text-slate-800">{submission?.workMode || "HYBRID"}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
              <p className="font-semibold text-slate-800">{submission?.durationWeeks || 8} Weeks</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
              <p className="font-semibold text-emerald-600">Verification Active</p>
            </div>
          </div>
        </div>

        {/* Completed Confirmation Screen */}
        {success ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-xl border border-black/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-display font-bold text-slate-800">Evaluation Submitted & Verified</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Thank you for evaluating <strong>{submission?.student?.name}</strong>. Your feedback has been securely transmitted to the Vidyalankar Institute of Technology Placement & Internship Cell.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-black/5 max-w-sm mx-auto space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Performance Rating</span>
              <p className="text-2xl font-bold font-display text-purple-600">{evaluation?.totalScore || totalScore}/30 Marks</p>
              <p className="text-[10px] text-slate-400">Authenticated by {mentorName} ({mentorEmail})</p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Record is officially locked for academic grading.</span>
            </div>
          </div>
        ) : (
          /* Evaluation Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 space-y-6 border border-black/5 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-black/5">
              <h3 className="font-display font-bold text-base text-slate-800">
                Performance Rating (30 Marks Total)
              </h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                Total: {totalScore}/30
              </span>
            </div>

            {/* Mentor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] uppercase font-bold text-slate-400">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full p-2.5 border border-black/10 rounded-xl"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] uppercase font-bold text-slate-400">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={mentorEmail}
                  onChange={(e) => setMentorEmail(e.target.value)}
                  placeholder="mentor@company.com"
                  className="w-full p-2.5 border border-black/10 rounded-xl"
                />
              </div>
            </div>

            {/* 6 Performance Criteria */}
            <div className="space-y-4 pt-2">
              {[
                { label: "1. Technical Knowledge & Skill Application", val: technicalKnowledge, setVal: setTechnicalKnowledge, desc: "Understanding of programming concepts, frameworks, and tools." },
                { label: "2. Quality of Deliverables & Output", val: qualityOfWork, setVal: setQualityOfWork, desc: "Accuracy, cleanliness of code, attention to detail, and bug-free output." },
                { label: "3. Problem Solving & Critical Thinking", val: problemSolving, setVal: setProblemSolving, desc: "Ability to debug issues, think independently, and resolve technical roadblocks." },
                { label: "4. Communication & Responsiveness", val: communication, setVal: setCommunication, desc: "Clarity in daily standups, status updates, and Slack/Teams collaboration." },
                { label: "5. Teamwork & Cultural Contribution", val: teamwork, setVal: setTeamwork, desc: "Collaboration with team members, receptive to feedback, and positive attitude." },
                { label: "6. Professionalism & Punctuality", val: professionalism, setVal: setProfessionalism, desc: "Meeting sprint deadlines, attendance, and work ethic." }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-black/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <span className="text-xs font-bold font-display text-[#DD3333] bg-white px-2 py-0.5 rounded-lg border border-black/5">
                      {item.val}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={item.val}
                    onChange={(e) => item.setVal(parseInt(e.target.value))}
                    className="w-full accent-[#DD3333]"
                  />
                </div>
              ))}
            </div>

            {/* Written Remarks */}
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-bold text-slate-400">Written Feedback & Commendations</label>
              <textarea
                rows="3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share any special project contributions, key strengths, or areas for improvement..."
                className="w-full p-3 border border-black/10 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#DD3333] hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 font-display"
              >
                {submitting ? (
                  <span>Submitting Confidential Evaluation...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Confirm & Submit Performance Evaluation ({totalScore}/30)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
