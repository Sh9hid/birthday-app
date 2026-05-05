import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { tribute } from "../data/tribute";

type TributeVideoProps = {
  format: "landscape" | "story";
};

const seconds = (value: number) => Math.round(value * 30);

function fade(frame: number, start: number, end: number) {
  return interpolate(frame, [start, start + 18, end - 18, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
}

function WordStorm() {
  const frame = useCurrentFrame();
  return (
    <div className="rv-word-storm">
      {tribute.virtueWords.map((word, index) => {
        const start = index * 3;
        const progress = spring({
          frame: frame - start,
          fps: 30,
          config: { damping: 16, stiffness: 160 }
        });
        const exit = interpolate(frame, [start + 18, start + 32], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });
        const angle = index * 37;
        const x = Math.cos(angle) * interpolate(progress, [0, 1], [480, 0]);
        const y = Math.sin(angle) * interpolate(progress, [0, 1], [290, 0]);
        return (
          <span
            className="rv-word"
            key={`${word}-${index}`}
            style={{
              opacity: Math.min(progress, exit),
              transform: `translate(${x}px, ${y}px) rotate(${interpolate(progress, [0, 1], [index % 2 ? -18 : 18, 0])}deg)`
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

function LineSequence({ lines, start, hold = 64 }: { lines: string[]; start: number; hold?: number }) {
  const frame = useCurrentFrame();
  return (
    <>
      {lines.map((line, index) => {
        const inFrame = start + index * hold;
        const opacity = fade(frame, inFrame, inFrame + hold + 18);
        const y = interpolate(opacity, [0, 1], [34, 0]);
        return (
          <p className="rv-line" key={line} style={{ opacity, transform: `translateY(${y}px)` }}>
            {line}
          </p>
        );
      })}
    </>
  );
}

function SlotThanks() {
  const frame = useCurrentFrame();
  const roll = interpolate(frame, [0, 92], [0, -97], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const finalOpacity = interpolate(frame, [90, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <div className="rv-slot-scene">
      <p>Thank you for being</p>
      <div className="rv-slot">
        <div className="rv-slot-track" style={{ transform: `translateY(${roll}%)` }}>
          {tribute.gratitudeWords.map((word, index) => (
            <span key={`${word}-${index}`}>{word}</span>
          ))}
        </div>
      </div>
      <h2 style={{ opacity: finalOpacity }}>Thank you for everything.</h2>
    </div>
  );
}

const toStatic = (src: string) => staticFile(src.replace(/^\//, ""));

export function TributeVideo({ format }: TributeVideoProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const story = format === "story";

  const openerOpacity = fade(frame, 0, seconds(8));
  const chatOpacity = fade(frame, seconds(7), seconds(16));
  const pivotOpacity = fade(frame, seconds(15), seconds(22));
  const stormOpacity = fade(frame, seconds(21), seconds(30));
  const nameOpacity = fade(frame, seconds(28), seconds(35));
  const portraitOpacity = fade(frame, seconds(48), seconds(59));
  const finaleOpacity = interpolate(frame, [seconds(58), seconds(61)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill className={`rv-root ${story ? "rv-story" : ""}`} style={{ width, height }}>
      <Audio src={staticFile("audio/nitin-cinematic-score.wav")} volume={0.75} />
      <div className="rv-aurora" />
      <div className="rv-grain" />

      <Sequence from={0}>
        <div className="rv-center" style={{ opacity: openerOpacity }}>
          <p className="rv-kicker">{tribute.office}</p>
          <h1 className="rv-title">Happy Birthday, Nitin</h1>
          <p className="rv-subtitle">Today, the noise can wait.</p>
        </div>
      </Sequence>

      <Sequence from={seconds(7)}>
        <div className="rv-card" style={{ opacity: chatOpacity }}>
          <p className="rv-kicker">typing...</p>
          <p>{tribute.script.message}</p>
        </div>
      </Sequence>

      <Sequence from={seconds(15)}>
        <div className="rv-center" style={{ opacity: pivotOpacity }}>
          <p className="rv-subtitle">{tribute.script.pivot[0]}</p>
          <h2 className="rv-title rv-gold">More Than Leadership</h2>
        </div>
      </Sequence>

      <Sequence from={seconds(21)}>
        <div style={{ opacity: stormOpacity }}>
          <WordStorm />
        </div>
      </Sequence>

      <Sequence from={seconds(28)}>
        <div className="rv-center" style={{ opacity: nameOpacity }}>
          <h2 className="rv-title rv-name">NITIN</h2>
        </div>
      </Sequence>

      <Sequence from={seconds(34)}>
        <div className="rv-center rv-copy">
          <LineSequence lines={tribute.script.slowTribute} start={seconds(34)} hold={52} />
        </div>
      </Sequence>

      <Sequence from={seconds(48)}>
        <div className="rv-portrait-stage" style={{ opacity: portraitOpacity }}>
          <Img className="rv-hero-img" src={toStatic(tribute.heroImage)} />
          <div className="rv-gallery">
            {tribute.galleryImages.map((image) => (
              <Img key={image.src} src={toStatic(image.src)} />
            ))}
          </div>
          <p>Mentor. Standard-setter. The heart of the team.</p>
        </div>
      </Sequence>

      <Sequence from={seconds(58)}>
        <div className="rv-center rv-final" style={{ opacity: finaleOpacity }}>
          {tribute.script.finalLines.slice(0, 2).map((line, index) => (
            <p key={line} className={index === 0 ? "rv-final-title" : ""}>
              {line}
            </p>
          ))}
        </div>
      </Sequence>

      <Sequence from={seconds(62)}>
        <SlotThanks />
      </Sequence>
    </AbsoluteFill>
  );
}
