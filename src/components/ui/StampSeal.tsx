interface Props {
  primary: string;
  secondary: string;
  rotate?: number;
  size?: number;
}

export function StampSeal({
  primary,
  secondary,
  rotate = -8,
  size = 86,
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0 mt-display"
      style={{
        width: size,
        height: size,
        border: "2.5px solid var(--mt-accent)",
        borderRadius: "50%",
        color: "var(--mt-accent)",
        transform: `rotate(${rotate}deg)`,
        opacity: 0.85,
        fontSize: 9,
        textAlign: "center",
        lineHeight: 1.15,
        letterSpacing: "0.1em",
      }}
    >
      <div>
        <div style={{ fontSize: size * 0.22, fontWeight: 700 }}>{primary}</div>
        <div style={{ whiteSpace: "pre-line" }}>{secondary}</div>
      </div>
      <div
        aria-hidden
        className="absolute"
        style={{
          inset: 5,
          border: "1px solid var(--mt-accent)",
          borderRadius: "50%",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
