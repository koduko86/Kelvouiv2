export function ActionButton({
  onClick,
  disabled,
  active,
  icon,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  const className = disabled
    ? 'bg-app-control opacity-40 cursor-not-allowed'
    : active
      ? 'bg-app-action hover:bg-app-action-hover'
      : 'bg-app-control hover:bg-app-hover';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 min-w-0 overflow-hidden ${className}`}
    >
      {icon}
      <span className={`text-[11px] font-medium truncate w-full text-center px-1 ${active ? 'text-white' : 'text-app-text'}`}>
        {label}
      </span>
    </button>
  );
}
