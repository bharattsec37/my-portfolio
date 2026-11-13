"use client";

class TrainAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("midnight_express_muted");
      this.isMuted = saved !== null ? saved === "true" : true;
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("midnight_express_muted", String(this.isMuted));
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
    if (!this.isMuted && !this.isRunning) {
      this.startRhythm();
    }
    return this.isMuted;
  }

  public startRhythm() {
    this.initContext();
    if (this.isRunning || !this.ctx) return;
    this.isRunning = true;

    const playClickClack = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      // Two quick noise bursts (clack-clack) followed by short pause
      this.createWheelClick(now, 1.0);
      this.createWheelClick(now + 0.12, 0.7);
      this.createWheelClick(now + 0.38, 0.85);
      this.createWheelClick(now + 0.50, 0.6);

      // Low rumble train body resonance
      this.createLowRumble(now, 0.8);

      // Next rail cycle after 1.1s
      this.timerId = window.setTimeout(playClickClack, 1100);
    };

    playClickClack();
  }

  public stopRhythm() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private createWheelClick(time: number, gainMul: number) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(380, time);
    filter.Q.setValueAtTime(3.0, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.3 * gainMul, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.038);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.04);
  }

  private createLowRumble(time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(55, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.09, time + 0.1);
    gain.gain.linearRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  public playStationChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const chimeFrequencies = [659.25, 493.88]; // E5 then B4

    chimeFrequencies.forEach((freq, idx) => {
      const oscTime = now + idx * 0.35;
      const osc = this.ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, oscTime);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.001, oscTime);
      gain.gain.exponentialRampToValueAtTime(0.35, oscTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, oscTime + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(oscTime);
      osc.stop(oscTime + 0.95);
    });
  }

  public playEmergencyBrake() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Air brake hiss
    const bufferSize = this.ctx.sampleRate * 0.9;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1400, now);

    const hissGain = this.ctx.createGain();
    hissGain.gain.setValueAtTime(0.4, now);
    hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    noise.connect(filter);
    filter.connect(hissGain);
    hissGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.9);

    // Wheel screech tone
    const screech = this.ctx.createOscillator();
    screech.type = "sawtooth";
    screech.frequency.setValueAtTime(1600, now);
    screech.frequency.exponentialRampToValueAtTime(320, now + 0.7);

    const screechGain = this.ctx.createGain();
    screechGain.gain.setValueAtTime(0.12, now);
    screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    screech.connect(screechGain);
    screechGain.connect(this.masterGain);

    screech.start(now);
    screech.stop(now + 0.75);
  }
}

export const trainAudio = new TrainAudioEngine();

