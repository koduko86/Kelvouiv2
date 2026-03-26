export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-wide text-app-text-hint px-1 mb-2">
      {children}
    </div>
  );
}
