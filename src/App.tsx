import confetti from "canvas-confetti";
import gsap from "gsap";
import { Howl } from "howler";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CinematicBackdrop } from "./components/CinematicBackdrop";
import { tribute } from "./data/tribute";

const scoreUrl = "/audio/nitin-cinematic-score.wav";

export default function App() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scoreRef = useRef<Howl | null>(null);

  const score = useMemo(
    () =>
      new Howl({
        src: [scoreUrl],
        html5: true,
        volume: 0.72
      }),
    []
  );

  useEffect(() => {
    scoreRef.current = score;
    return () => {
      score.stop();
      score.unload();
    };
  }, [score]);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!started || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speed = prefersReduced ? 0.45 : 1;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          confetti({
            particleCount: 180,
            spread: 80,
            origin: { y: 0.65 },
            colors: ["#f5d26b", "#f9fafb", "#87f5ff", "#ff7ab6"]
          });
        }
      });

      timelineRef.current = tl;

      const tributeLines = gsap.utils.toArray<HTMLElement>(".tribute-line");
      const finalLines = gsap.utils.toArray<HTMLElement>(".final-line");

      tl.set(".scene", { autoAlpha: 1 })
        .from(".eyebrow", { autoAlpha: 0, y: 14, duration: 0.7 * speed })
        .from(".hero-title span", { autoAlpha: 0, yPercent: 110, rotateX: -45, stagger: 0.06, duration: 0.86 * speed }, "-=0.2")
        .from(".hero-subtitle", { autoAlpha: 0, y: 20, duration: 0.8 * speed }, "-=0.25")
        .to(".opening", { autoAlpha: 0, y: -30, duration: 0.8 * speed }, "+=1.35")
        .from(".chat-card", { autoAlpha: 0, y: 40, scale: 0.94, duration: 0.7 * speed })
        .from(".chat-line span", { autoAlpha: 0, duration: 0.03 * speed, stagger: 0.018 * speed, ease: "none" })
        .from(".send-button", { autoAlpha: 0, scale: 0.7, duration: 0.25 * speed })
        .to(".send-button", { backgroundColor: "#f5d26b", color: "#111827", duration: 0.2 * speed })
        .to(".chat-card", { autoAlpha: 0, y: -70, scale: 0.92, duration: 0.55 * speed }, "+=0.55")
        .from(".pivot-line", { autoAlpha: 0, y: 30, stagger: 0.65, duration: 0.7 * speed })
        .to(".pivot-line .spotlight", { color: "#f5d26b", textShadow: "0 0 36px rgba(245,210,107,.9)", duration: 0.55 * speed })
        .to(".pivot", { autoAlpha: 0, scale: 0.92, duration: 0.65 * speed }, "+=1")
        .fromTo(
          ".virtue-word",
          {
            autoAlpha: 0,
            x: () => gsap.utils.random(-420, 420),
            y: () => gsap.utils.random(-280, 280),
            rotate: () => gsap.utils.random(-18, 18),
            scale: () => gsap.utils.random(0.7, 1.25)
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.18 * speed,
            stagger: 0.055 * speed,
            ease: "expo.out"
          }
        )
        .to(".virtue-word", {
          autoAlpha: 0,
          x: () => gsap.utils.random(-620, 620),
          y: () => gsap.utils.random(-360, 360),
          rotate: () => gsap.utils.random(-26, 26),
          duration: 0.16 * speed,
          stagger: 0.035 * speed,
          ease: "expo.in"
        }, "-=1.55")
        .from(".name-burst span", { autoAlpha: 0, yPercent: 105, rotateX: -70, stagger: 0.08, duration: 0.75 * speed })
        .to(".name-burst span", { color: "#f5d26b", duration: 0.35 * speed, stagger: 0.05 })
        .to(".name-burst", { autoAlpha: 0, scale: 1.08, filter: "blur(10px)", duration: 0.55 * speed }, "+=0.75");

      tributeLines.forEach((line, index) => {
        const isLast = index === tributeLines.length - 1;
        tl.fromTo(line, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.72 * speed })
          .to(line, { autoAlpha: isLast ? 1 : 0, y: isLast ? 0 : -22, duration: isLast ? 0.2 * speed : 0.48 * speed }, "+=0.95");
      });

      tl.to(".tribute-copy", { autoAlpha: 0, y: -24, duration: 0.65 * speed }, "+=0.8")
        .from(".portrait-shell", { autoAlpha: 0, scale: 0.82, rotate: -2, duration: 0.9 * speed })
        .from(".portrait-copy", { autoAlpha: 0, y: 30, duration: 0.8 * speed }, "-=0.35")
        .from(".photo-card", { autoAlpha: 0, y: 60, rotate: -4, stagger: 0.18, duration: 0.7 * speed }, "+=0.35")
        .to(".photo-card", { y: -14, stagger: 0.08, yoyo: true, repeat: 1, duration: 0.5 * speed })
        .to(".portrait-scene", { autoAlpha: 0, y: -28, duration: 0.75 * speed }, "+=1.35");

      finalLines.slice(0, 3).forEach((line, index) => {
        tl.fromTo(line, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.76 * speed })
          .to(line, { autoAlpha: index === 2 ? 1 : 0, y: index === 2 ? 0 : -22, duration: index === 2 ? 0.2 * speed : 0.48 * speed }, "+=1.15");
      });

      tl.fromTo(
        ".slot-track",
        { yPercent: 0 },
        { yPercent: -97.5, duration: 3.2 * speed, ease: "power4.out" },
        "+=0.15"
      )
        .fromTo(".everything-line", { autoAlpha: 0, y: 40, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 * speed })
        .to(".final-line:nth-child(3), .slot-machine", { autoAlpha: 0, y: -24, duration: 0.45 * speed }, "+=0.15")
        .from(".replay-row", { autoAlpha: 0, y: 18, duration: 0.5 * speed });
    }, rootRef);

    return () => ctx.revert();
  }, [started]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <CinematicBackdrop active={started} />

      <AnimatePresence>
        {!started && (
          <motion.section
            className="start-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.7 } }}
          >
            <div className="start-photo" style={{ backgroundImage: `url("${tribute.heroImage}")` }} />
            <div className="start-content">
              <p className="kicker">A birthday film from the office family</p>
              <h1>For Nitin</h1>
              <p>
                A few words, a lot of gratitude, and one cinematic pause for the person who makes the room feel steady.
              </p>
              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} onClick={begin}>
                <Play size={20} fill="currentColor" />
                Tap to begin
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
            <div className="portrait-glow" />
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
