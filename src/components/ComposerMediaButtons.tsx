"use client";

import { EmojiPicker } from "@/components/EmojiPicker";
import { StickerPicker } from "@/components/StickerPicker";
import { useLocale } from "@/providers/LocaleProvider";

type ComposerMediaButtonsProps = {
  showEmojiPicker: boolean;
  showStickerPicker: boolean;
  onToggleEmojiPicker: () => void;
  onToggleStickerPicker: () => void;
  onEmojiPick: (emoji: string) => void;
  onStickerPick: (stickerId: string) => void;
};

export function ComposerMediaButtons({
  showEmojiPicker,
  showStickerPicker,
  onToggleEmojiPicker,
  onToggleStickerPicker,
  onEmojiPick,
  onStickerPick,
}: ComposerMediaButtonsProps) {
  const { t } = useLocale();

  function closePickers() {
    if (showEmojiPicker) onToggleEmojiPicker();
    if (showStickerPicker) onToggleStickerPicker();
  }

  return (
    <div className="relative flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => {
          if (showStickerPicker) onToggleStickerPicker();
          onToggleEmojiPicker();
        }}
        aria-label={t.video.addEmoji}
        className="text-lg text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
      >
        😊
      </button>

      <button
        type="button"
        onClick={() => {
          if (showEmojiPicker) onToggleEmojiPicker();
          onToggleStickerPicker();
        }}
        aria-label={t.video.addSticker}
        className="rounded-md px-1 text-[10px] font-black uppercase tracking-wide text-zinc-500 transition-colors hover:text-accent"
      >
        GIF
      </button>

      {showEmojiPicker ? (
        <EmojiPicker
          onPick={(emoji) => {
            onEmojiPick(emoji);
            closePickers();
          }}
        />
      ) : null}

      {showStickerPicker ? (
        <StickerPicker
          onPick={(stickerId) => {
            onStickerPick(stickerId);
            closePickers();
          }}
        />
      ) : null}
    </div>
  );
}
