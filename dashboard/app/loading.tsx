export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}
