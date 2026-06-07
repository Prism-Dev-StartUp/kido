import { WordTypeConfig } from "../data/grammar";

interface Props {
  symbol: WordTypeConfig["symbol"];
  color: string;
  size?: number;
}

export default function GrammarSymbol({ symbol, color, size = 40 }: Props) {
  const s = size;
  switch (symbol) {
    case "triangle-lg":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40">
          <polygon points="20,3 38,37 2,37" fill={color} />
        </svg>
      );
    case "triangle-md":
      return (
        <svg width={s * 0.85} height={s * 0.85} viewBox="0 0 40 40">
          <polygon points="20,3 38,37 2,37" fill={color} />
        </svg>
      );
    case "triangle-sm":
      return (
        <svg width={s * 0.65} height={s * 0.65} viewBox="0 0 40 40">
          <polygon points="20,3 38,37 2,37" fill={color} />
        </svg>
      );
    case "circle-lg":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill={color} />
        </svg>
      );
    case "circle-sm":
      return (
        <svg width={s * 0.65} height={s * 0.65} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill={color} />
        </svg>
      );
    case "half-circle":
      return (
        <svg width={s} height={s * 0.55} viewBox="0 0 40 22">
          <path d="M2,20 A18,18 0 0,1 38,20" fill={color} />
        </svg>
      );
    case "dash":
      return (
        <svg width={s} height={s * 0.35} viewBox="0 0 40 14">
          <rect x="2" y="3" width="36" height="8" rx="4" fill={color} />
        </svg>
      );
  }
}
