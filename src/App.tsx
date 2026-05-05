import confetti from "canvas-confetti";
import gsap from "gsap";
import { Howl } from "howler";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { tribute } from "./data/tribute";

const scoreUrl = "/audio/nitin-cinematic-score.wav";

export default function App() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const score = useMemo(
    () =>
      new Howl({
        src: [scoreUrl],
        html5: true,
        volume: 0.6
      }),
    []
  );

  useEffect(() => {
    return () => {
      score.stop();
      score.unload();
    };
  }, [score]);

  useEffect(() => {
    if (!started || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speed = prefersReduced ? 0.65 : 1;
      const tributeLines = gsap.utils.toArray<HTMLElement>(".tribute-line");
      const finalLines = gsap.utils.toArray<HTMLElement>(".final-line");
      const photoCards = gsap.utils.toArray<HTMLElement>(".photo-card");
      const slotTrack = rootRef.current?.querySelector<HTMLElement>(".slot-track");
      const slotItem = rootRef.current?.querySelector<HTMLElement>(".slot-track span");
      const slotDistance = slotItem ? slotItem.offsetHeight * (tribute.gratitudeWords.length - 1) : 0;

      gsap.set(".stage", { autoAlpha: 0, clearProps: "transform" });
      gsap.set([".hero-title span", ".name-burst span"], { autoAlpha: 0, y: 18 });
      gsap.set([".chat-line span", ".virtue-word"], { autoAlpha: 0 });
      gsap.set(photoCards, { autoAlpha: 0, y: 24, scale: 0.985 });
      gsap.set(".slot-machine", { autoAlpha: 0, y: 10 });
      gsap.set(".slot-track", { y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          confetti({
            particleCount: 90,
            spread: 66,
            origin: { y: 0.68 },
            colors: ["#b37b22", "#ffffff", "#8bb8d8", "#f1c7b8"]
          });
        }
      });

      timelineRef.current = tl;

      tl.set(".scene", { autoAlpha: 1 })
        .to(".opening", { autoAlpha: 1, duration: 0.2 * speed })
        .from(".eyebrow", { autoAlpha: 0, y: 10, duration: 0.85 * speed })
        .to(".hero-title span", { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.82 * speed }, "-=0.15")
        .from(".hero-subtitle", { autoAlpha: 0, y: 16, duration: 0.85 * speed }, "+=0.05")
        .to(".opening", { autoAlpha: 0, y: -16, duration: 0.8 * speed }, "+=1.75")
        .to(".chat", { autoAlpha: 1, duration: 0.35 * speed }, "<0.35")
        .from(".chat-card", { y: 24, scale: 0.985, duration: 0.8 * speed })
        .to(".chat-line span", { autoAlpha: 1, duration: 0.022 * speed, stagger: 0.022 * speed, ease: "none" })
        .from(".send-button", { autoAlpha: 0, scale: 0.9, duration: 0.28 * speed })
        .to(".send-button", { backgroundColor: "#b37b22", color: "#ffffff", duration: 0.25 * speed })
        .to(".chat", { autoAlpha: 0, y: -24, duration: 0.7 * speed }, "+=0.95")
        .to(".pivot", { autoAlpha: 1, duration: 0.35 * speed }, "<0.32")
        .from(".pivot-line", { autoAlpha: 0, y: 22, stagger: 0.82, duration: 0.8 * speed })
        .to(".pivot-line .spotlight", { color: "#9b6a1d", duration: 0.55 * speed })
        .to(".pivot", { autoAlpha: 0, scale: 0.985, duration: 0.75 * speed }, "+=1.35")
        .to(".virtues", { autoAlpha: 1, duration: 0.35 * speed }, "<0.32")
        .fromTo(
          ".virtue-word",
          {
            autoAlpha: 0,
            x: () => gsap.utils.random(-240, 240),
            y: () => gsap.utils.random(-150, 150),
            scale: 0.9
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.28 * speed,
            stagger: 0.055 * speed,
            ease: "power3.out"
          }
        )
        .to(".virtue-word", { autoAlpha: 0, y: -16, duration: 0.28 * speed, stagger: 0.03 * speed }, "-=1.05")
        .to(".name-burst span", { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.82 * speed })
        .to(".name-burst span", { color: "#9b6a1d", duration: 0.45 * speed, stagger: 0.05 })
        .to(".virtues", { autoAlpha: 0, scale: 1.015, duration: 0.8 * speed }, "+=1.05")
        .to(".tribute-copy", { autoAlpha: 1, duration: 0.35 * speed }, "<0.32");

      tributeLines.forEach((line, index) => {
        const isLast = index === tributeLines.length - 1;
        tl.fromTo(line, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9 * speed })
          .to(line, { autoAlpha: isLast ? 1 : 0, y: isLast ? 0 : -14, duration: isLast ? 0.2 * speed : 0.62 * speed }, "+=1.55");
      });

      tl.to(".tribute-copy", { autoAlpha: 0, y: -18, duration: 0.7 * speed }, "+=0.9")
        .to(".portrait-scene", { autoAlpha: 1, duration: 0.35 * speed }, "<0.32")
        .from(".portrait-shell", { autoAlpha: 0, scale: 0.93, y: 24, duration: 1.05 * speed })
        .from(".portrait-copy", { autoAlpha: 0, y: 20, duration: 0.85 * speed }, "-=0.25")
        .to(".portrait-shell, .portrait-copy", { autoAlpha: 0, y: -14, duration: 0.72 * speed }, "+=1.55");

      photoCards.forEach((card, index) => {
        tl.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 * speed }, index === 0 ? "<0.35" : "<0.25")
          .to(card, { autoAlpha: 0, y: -14, scale: 0.985, duration: 0.62 * speed }, "+=1.6");
      });

      tl.to(".portrait-scene", { autoAlpha: 0, y: -18, duration: 0.8 * speed }, "+=0.7")
        .to(".finale", { autoAlpha: 1, duration: 0.35 * speed }, "<0.32");

      finalLines.slice(0, 3).forEach((line, index) => {
        tl.fromTo(line, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 * speed })
          .to(line, { autoAlpha: index === 2 ? 1 : 0, y: index === 2 ? 0 : -14, duration: index === 2 ? 0.2 * speed : 0.55 * speed }, "+=1.35");
      });

      tl.to(".slot-machine", { autoAlpha: 1, y: 0, duration: 0.3 * speed }, "+=0.1");

      if (slotTrack) {
        tl.to(slotTrack, { y: -slotDistance, duration: 4.6 * speed, ease: "power4.out" });
      }

      tl
        .to(".slot-machine", { boxShadow: "0 18px 60px rgba(179, 123, 34, 0.24)", duration: 0.35 * speed })
        .to(".final-line:nth-child(3)", { autoAlpha: 0, y: -12, duration: 0.45 * speed }, "+=0.35")
        .fromTo(".everything-line", { autoAlpha: 0, y: 26, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 * speed })
        .from(".replay-row", { autoAlpha: 0, y: 12, duration: 0.55 * speed }, "+=0.6");
    }, rootRef);

    return () => ctx.revert();
  }, [started, score]);

  const begin = () => {
    setStarted(true);
    setPaused(false);
    setMuted(false);
    score.mute(false);
    score.seek(0);
    score.play();
  };

  const replay = () => {
    timelineRef.current?.restart();
    score.seek(0);
    score.play();
    score.mute(muted);
    setPaused(false);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    score.mute(next);
  };

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    if (next) {
      timelineRef.current?.pause();
      score.pause();
    } else {
      timelineRef.current?.resume();
      score.play();
    }
  };

  const titleChars = tribute.honoree.split("");
  const chatChars = tribute.script.message.split("");

  return (
    <main ref={rootRef} className="app-shell">
      <AnimatePresence>
        {!started && (
          <motion.section
            className="start-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55 } }}
          >
            <div className="start-content">
              <p className="kicker">A birthday note</p>
              <h1>For Nitin</h1>
              <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={begin}>
                <Play size={20} fill="currentColor" />
                Play
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="scene" aria-live="polite">
        <div className="opening stage">
          <p className="eyebrow">{tribute.script.opener[1]}</p>
          <h1 className="hero-title">
            {tribute.script.opener[0].split(" ").map((word) => (
              <span key={word}>{word}</span>
            ))}
          </h1>
          <p className="hero-subtitle">{tribute.script.opener[2]}</p>
        </div>

        <div className="chat stage">
          <div className="chat-card">
            <p className="chat-meta">typing...</p>
            <p className="chat-line">
              {chatChars.map((char, index) => (
                <span key={`${char}-${index}`}>{char}</span>
              ))}
            </p>
            <button className="send-button">Send</button>
          </div>
        </div>

        <div className="pivot stage">
          <p className="pivot-line">{tribute.script.pivot[0]}</p>
          <p className="pivot-line">
            <span className="spotlight">{tribute.script.pivot[1]}</span>
          </p>
        </div>

        <div className="virtues stage">
          <div className="virtue-cloud">
            {tribute.virtueWords.map((word, index) => (
              <span className="virtue-word" key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </div>
          <h2 className="name-burst" aria-label={tribute.honoree}>
            {titleChars.map((char, index) => (
              <span key={`${char}-${index}`}>{char === " " ? "\u00A0" : char}</span>
            ))}
          </h2>
        </div>

        <div className="tribute-copy stage">
          {tribute.script.slowTribute.map((line) => (
            <p className="tribute-line" key={line}>
              {line}
            </p>
          ))}
        </div>

        <div className="portrait-scene stage">
          <div className="portrait-shell">
            <img src={tribute.heroImage} alt="Nitin smiling outdoors" />
          </div>
          <div className="portrait-copy">
            <p>Mentor. Standard-setter. The heart of the team.</p>
          </div>
          <div className="photo-reel">
            {tribute.galleryImages.map((image) => (
              <figure className="photo-card" key={image.src}>
                <img src={image.src} alt={`Nitin - ${image.caption}`} />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="finale stage">
          {tribute.script.finalLines.slice(0, 3).map((line) => (
            <p className="final-line" key={line}>
              {line}
            </p>
          ))}
          <div className="slot-machine" aria-hidden="true">
            <div className="slot-track">
              {tribute.gratitudeWords.map((word, index) => (
                <span key={`${word}-${index}`}>{word}</span>
              ))}
            </div>
          </div>
          <p className="everything-line">{tribute.script.finalLines.at(-1)}</p>
          <div className="replay-row">
            <button onClick={replay}>
              <RotateCcw size={18} />
              Replay
            </button>
          </div>
        </div>
      </section>

      {started && (
        <div className="control-dock">
          <button onClick={togglePause} aria-label={paused ? "Resume tribute" : "Pause tribute"}>
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button onClick={toggleMute} aria-label={muted ? "Unmute tribute" : "Mute tribute"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}
    </main>
  );
}
