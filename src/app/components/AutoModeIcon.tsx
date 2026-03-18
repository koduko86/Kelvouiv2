export function AutoModeIcon({ className, style, size = 24 }: { className?: string; style?: React.CSSProperties; size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="12" y="16.5" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="800" fontFamily="sans-serif">A</text>
    </svg>
  );
}
