"use client";

// ─── Universe Audio Engine ────────────────────────────────────────────────────
// Pure Web Audio API synthesis — no external audio files required.
// All sounds are procedurally generated and very subtle (gain ≤ 0.08).

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // Resume if suspended (browser policy)
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function envelope(
  gainNode: GainNode,
  attack: number,
  sustain: number,
  release: number,
  peakGain: number,
  startTime: number
) {
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
  gainNode.gain.setValueAtTime(peakGain, startTime + attack + sustain);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + sustain + release);
}

/** Short high-frequency chirp — hover over district pad */
export function playHover() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.06);
  envelope(gain, 0.005, 0.03, 0.05, 0.04, c.currentTime);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.1);
}

/** Two-tone select — clicking a district */
export function playSelect() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  [[440, now], [554, now + 0.09]].forEach(([freq, time]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq as number, time as number);
    envelope(gain, 0.01, 0.06, 0.12, 0.06, time as number);
    osc.start(time as number);
    osc.stop((time as number) + 0.2);
  });
}

/** Soft low thud — closing panel / deselect */
export function playDeselect() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, c.currentTime + 0.15);
  envelope(gain, 0.005, 0.05, 0.12, 0.05, c.currentTime);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.2);
}

/** Ascending three-note arpeggio — quest completed */
export function playQuestComplete() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const time = c.currentTime + i * 0.12;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    envelope(gain, 0.01, 0.1, 0.2, 0.07, time);
    osc.start(time);
    osc.stop(time + 0.35);
  });
}

/** XP gain ping — short bright click */
export function playXPGain() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(1046, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1318, c.currentTime + 0.04);
  envelope(gain, 0.005, 0.02, 0.08, 0.05, c.currentTime);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.12);
}

/** Level up — big rising chord */
export function playLevelUp() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const chord = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
  chord.forEach((freq, i) => {
    const time = c.currentTime + i * 0.07;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    envelope(gain, 0.015, 0.15, 0.3, 0.06, time);
    osc.start(time);
    osc.stop(time + 0.5);
  });
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("universe_audio_muted", value ? "1" : "0");
    } catch {}
  }
}

export function initMutedState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = sessionStorage.getItem("universe_audio_muted");
    muted = saved === "1";
  } catch {}
  return muted;
}

