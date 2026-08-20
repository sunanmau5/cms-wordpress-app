// PROTOTYPE — throwaway. See .scratch/birthday-portal/issues/01-visual-language.md

export function Broom({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg className={className} fill="none" style={style} viewBox="0 0 24 48">
      <path
        d="M12 2v22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        d="M4 27c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v3H4v-3Z"
        fill="currentColor"
      />
      <path d="M4 30h16l2 15H2l2-15Z" fill="currentColor" fillOpacity="0.55" />
      <path
        d="M8 31v13M12 31v13M16 31v13"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1.2"
      />
    </svg>
  );
}
