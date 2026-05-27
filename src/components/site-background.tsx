export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-28 h-64 w-64 rounded-full bg-[oklch(0.86_0.11_160/0.35)] blur-3xl" />
      <div className="absolute right-[-4rem] top-12 h-72 w-72 rounded-full bg-[oklch(0.76_0.19_32/0.3)] blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[oklch(0.58_0.12_230/0.25)] blur-3xl" />
    </div>
  );
}
