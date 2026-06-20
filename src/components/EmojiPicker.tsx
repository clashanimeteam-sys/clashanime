const QUICK_EMOJIS = ["😀", "😂", "❤️", "🔥", "👏", "😍", "🙏", "💯", "⚔️", "🎌", "👍", "😭", "✨", "💪", "😎"];

type EmojiPickerProps = {
  onPick: (emoji: string) => void;
};

export function EmojiPicker({ onPick }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-full end-0 z-10 mb-2 grid w-56 grid-cols-5 gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onPick(emoji)}
          className="rounded-lg p-2 text-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export { QUICK_EMOJIS };
