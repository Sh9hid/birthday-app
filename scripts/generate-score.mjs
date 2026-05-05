import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sampleRate = 44100;
const duration = 68;
const channels = 2;
const totalSamples = sampleRate * duration;
const data = new Float32Array(totalSamples * channels);

const notes = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  G3: 196,
  A3: 220,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99
};

const clamp = (value) => Math.max(-1, Math.min(1, value));

const envelope = (time, start, length, attack = 0.03, release = 0.6) => {
  const local = time - start;
  if (local < 0 || local > length) return 0;
  const attackGain = Math.min(1, local / attack);
  const releaseStart = Math.max(attack, length - release);
  const releaseGain = local > releaseStart ? Math.max(0, 1 - (local - releaseStart) / release) : 1;
  return attackGain * releaseGain;
};

const addTone = ({ start, length, frequency, gain, pan = 0, shimmer = false }) => {
  const startSample = Math.max(0, Math.floor(start * sampleRate));
  const endSample = Math.min(totalSamples, Math.floor((start + length) * sampleRate));
  for (let i = startSample; i < endSample; i += 1) {
    const time = i / sampleRate;
    const local = time - start;
    const env = envelope(time, start, length, shimmer ? 0.004 : 0.035, shimmer ? 0.18 : 0.7);
    const sine = Math.sin(2 * Math.PI * frequency * local);
    const overtone = Math.sin(2 * Math.PI * frequency * 2.01 * local) * 0.22;
    const air = shimmer ? Math.sin(2 * Math.PI * frequency * 4.03 * local) * 0.12 : 0;
    const value = (sine + overtone + air) * env * gain;
    const left = Math.cos((pan + 1) * Math.PI * 0.25);
    const right = Math.sin((pan + 1) * Math.PI * 0.25);
    data[i * channels] += value * left;
    data[i * channels + 1] += value * right;
  }
};

const addNoiseSweep = ({ start, length, gain }) => {
  let seed = 42;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296 - 0.5;
  };
  const startSample = Math.max(0, Math.floor(start * sampleRate));
  const endSample = Math.min(totalSamples, Math.floor((start + length) * sampleRate));
  for (let i = startSample; i < endSample; i += 1) {
    const time = i / sampleRate;
    const env = envelope(time, start, length, 0.15, 1.8);
    const value = random() * env * gain;
    data[i * channels] += value * 0.45;
    data[i * channels + 1] += value * 0.45;
  }
};

const chords = [
  { start: 0, notes: ["C3", "G3", "E4", "G4"], gain: 0.085 },
  { start: 5.5, notes: ["A3", "E4", "C5", "E5"], gain: 0.075 },
  { start: 11, notes: ["E3", "B3", "G4", "B4"], gain: 0.075 },
  { start: 16.5, notes: ["G3", "D4", "B4", "D5"], gain: 0.08 },
  { start: 23, notes: ["C3", "G3", "E4", "C5"], gain: 0.09 },
  { start: 36, notes: ["A3", "E4", "C5", "G5"], gain: 0.095 },
  { start: 48, notes: ["F3", "C4", "A4", "E5"], gain: 0.08 },
  { start: 58, notes: ["C3", "G3", "E4", "G4", "C5"], gain: 0.1 }
];

for (const chord of chords) {
  for (const note of chord.notes) {
    addTone({ start: chord.start, length: 8.5, frequency: notes[note], gain: chord.gain, pan: (Math.random() - 0.5) * 0.35 });
  }
}

const melody = [
  [3.2, "G4"], [4.1, "E4"], [5, "C5"],
  [8.5, "B4"], [9.3, "G4"], [10.2, "E5"],
  [18, "D5"], [18.9, "C5"], [20, "G4"],
  [40.5, "E5"], [41.3, "D5"], [42.1, "C5"], [43, "G4"],
  [54, "A4"], [55.1, "C5"], [56.1, "E5"], [57.2, "G5"],
  [61, "E5"], [62.2, "D5"], [63.4, "C5"]
];

for (const [start, note] of melody) {
  addTone({ start, length: 1.9, frequency: notes[note], gain: 0.09, pan: 0.2 });
}

for (let i = 0; i < 42; i += 1) {
  const start = 27.2 + i * 0.115;
  const noteNames = ["C5", "D5", "E5", "G5", "A4", "B4"];
  addTone({
    start,
    length: 0.42,
    frequency: notes[noteNames[i % noteNames.length]],
    gain: 0.065,
    pan: Math.sin(i) * 0.75,
    shimmer: true
  });
}

addNoiseSweep({ start: 24.5, length: 8, gain: 0.025 });
addNoiseSweep({ start: 51, length: 10, gain: 0.018 });

let peak = 0;
for (const value of data) peak = Math.max(peak, Math.abs(value));
const normalizer = peak > 0 ? 0.88 / peak : 1;

const wavBytes = 44 + data.length * 2;
const buffer = Buffer.alloc(wavBytes);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(wavBytes - 8, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * channels * 2, 28);
buffer.writeUInt16LE(channels * 2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(data.length * 2, 40);

for (let i = 0; i < data.length; i += 1) {
  buffer.writeInt16LE(Math.round(clamp(data[i] * normalizer) * 32767), 44 + i * 2);
}

const output = resolve("public/audio/nitin-cinematic-score.wav");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, buffer);
console.log(`Generated ${output}`);
