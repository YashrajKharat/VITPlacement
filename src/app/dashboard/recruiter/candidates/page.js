"use client";

import { useState, useEffect } from "react";
import { getRecruiterCandidatesAction } from "@/actions/dashboard";
import { Search, User, ExternalLink, GraduationCap, Code } from "lucide-react";

export default function RecruiterCandidatesPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minCgpa, setMinCgpa] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await getRecruiterCandidatesAction();
        if (res?.success) {
          setStudents(res.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading student profile bank...</div>;
  }

  const filtered = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.skills && Array.isArray(s.skills) && s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()))) ||
      (s.department && s.department.toLowerCase().includes(search.toLowerCase()));

    const matchesCgpa = (s.cgpa || 0) >= parseFloat(minCgpa);
    return matchesSearch && matchesCgpa;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          Student Profiles Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Search the university talent network, filter by academics, and view student portfolios.
        </p>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, skill, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs focus:outline-none text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Min CGPA</span>
          <select
            value={minCgpa}
            onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
            className="px-3 py-2.5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl text-xs focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
          >
            <option value="0">All CGPAs</option>
            <option value="7">7.0+ CGPA</option>
            <option value="8">8.0+ CGPA</option>
            <option value="9">9.0+ CGPA</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Candidates Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 col-span-2">
              <User className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">No candidates match criteria</p>
            </div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left space-y-4
                  ${selectedStudent?.id === student.id
                    ? "bg-slate-50 border-purple-500 dark:bg-zinc-900/60"
                    : "bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800/80 hover:shadow-md"
                  }
                `}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-slate-500">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{student.name}</h3>
                    <p className="text-[10px] text-slate-400">{student.department || "Computer Science"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-zinc-900 pt-3">
                  <span className="font-semibold text-indigo-500">{student.cgpa ? `${student.cgpa} CGPA` : "No CGPA"}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Click to view details</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Selected Candidate Details */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 text-left space-y-6">
          {selectedStudent ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">{selectedStudent.name}</h3>
                <p className="text-xs text-indigo-500 font-semibold">{selectedStudent.department} (Batch: {selectedStudent.batch})</p>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed pt-1 italic">&quot;{selectedStudent.bio}&quot;</p>
              </div>

              {selectedStudent.skills && Array.isArray(selectedStudent.skills) && selectedStudent.skills.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 dark:border-zinc-900 pt-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Verified Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500 font-bold text-[9px] uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education list */}
              {selectedStudent.education && Array.isArray(selectedStudent.education) && selectedStudent.education.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Education</h4>
                  <div className="space-y-2 text-xs">
                    {selectedStudent.education.map((edu, idx) => (
                      <div key={idx} className="flex gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-zinc-300">{edu.school}</p>
                          <p className="text-[10px] text-slate-400">{edu.degree} • Grade: {edu.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project repositories */}
              {selectedStudent.projects && Array.isArray(selectedStudent.projects) && selectedStudent.projects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Featured Projects</h4>
                  <div className="space-y-2 text-xs">
                    {selectedStudent.projects.map((proj, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Code className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-zinc-300">{proj.title}</p>
                          <p className="text-[10px] text-slate-400">{proj.description}</p>
                          {proj.repoLink && (
                            <a href={proj.repoLink} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 mt-0.5 font-bold">
                              <span>Repository Link</span> <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <User className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-semibold">Select a candidate card to view academic background and experience logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
