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
      <p className="text-sm font-semibold text-gray-500 mb-3">Choisis un avatar</p>
      <div className="grid grid-cols-8 gap-2">
        {AVATARS.map(({ emoji, label }) => (
          <button
            key={emoji}
            type="button"
            title={label}
            onClick={() => onChange(emoji)}
            className={`text-2xl rounded-xl p-2 transition-all hover:scale-110 ${
              value === emoji
                ? "bg-amber-100 ring-2 ring-amber-400 scale-110"
                : "hover:bg-gray-100"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
