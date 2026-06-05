const AVATARS = [
  { emoji: "👦", label: "Garçon" },
  { emoji: "👧", label: "Fille" },
  { emoji: "🧒", label: "Enfant" },
  { emoji: "👶", label: "Bébé" },
  { emoji: "🦊", label: "Renard" },
  { emoji: "🐻", label: "Ours" },
  { emoji: "🐼", label: "Panda" },
  { emoji: "🦁", label: "Lion" },
  { emoji: "🐯", label: "Tigre" },
  { emoji: "🐸", label: "Grenouille" },
  { emoji: "🦄", label: "Licorne" },
  { emoji: "🐬", label: "Dauphin" },
  { emoji: "🐧", label: "Pingouin" },
  { emoji: "🐨", label: "Koala" },
  { emoji: "🦋", label: "Papillon" },
  { emoji: "🌟", label: "Étoile" },
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export default function AvatarPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-3">Choisis un avatar</p>
      <div className="grid grid-cols-8 gap-2">
        {AVATARS.map(({ emoji, label }) => (
          <button
            key={emoji}
            type="button"
            title={label}
            onClick={() => onChange(emoji)}
            className={`text-2xl rounded-2xl p-2 transition-all duration-150 hover:scale-125 ${
              value === emoji
                ? "bg-purple-100 ring-3 ring-purple-400 scale-125 shadow-md"
                : "hover:bg-purple-50"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
