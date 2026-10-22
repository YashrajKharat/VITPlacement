"use client";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f5f5f7] flex flex-col items-center justify-center font-sans select-none animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center gap-6">
        {/* Outline logo container that fills from bottom to top */}
        <div className="relative h-20 w-20 flex items-center justify-center border border-black/5 bg-white shadow-md rounded-2xl overflow-hidden">
          {/* background scale-up fill animation */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-[#DD3333] origin-bottom animate-fill-up" />
          
          {/* Foreground institutional letter V */}
          <span className="relative z-10 font-display font-extrabold text-3xl text-slate-800 mix-blend-difference select-none">
            V
          </span>
        </div>
        
        {/* Spinner metadata text block */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DD3333] animate-pulse">
            VIT Wadala
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
            Synchronizing Workspace...
          </span>
        </div>
      </div>
    </div>
  );
}
