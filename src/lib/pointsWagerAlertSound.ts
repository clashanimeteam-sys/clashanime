let audioContext: AudioContext | null = null;
let loopTimer: ReturnType<typeof setInterval> | null = null;
let active = false;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  return audioContext;
}

function playTone(frequency: number, durationMs: number, volume = 0.18) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

function playAlertPulse() {
  playTone(880, 140, 0.16);
  window.setTimeout(() => playTone(660, 140, 0.16), 160);
}

export function startPointsWagerAlertSound() {
  if (active) return;
  active = true;

  const ctx = getAudioContext();
  if (ctx?.state === "suspended") {
    void ctx.resume();
  }

  playAlertPulse();
  loopTimer = setInterval(playAlertPulse, 2200);
}

export function stopPointsWagerAlertSound() {
  active = false;
  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  }
}

export function isPointsWagerAlertSoundActive() {
  return active;
}
