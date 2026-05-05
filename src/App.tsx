import confetti from "canvas-confetti";
import gsap from "gsap";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { tribute } from "./data/tribute";

const balloonSrcs = ["/img/ballon1.svg", "/img/ballon2.svg", "/img/ballon3.svg"];
const balloons = Array.from({ length: 28 }, (_, i) => balloonSrcs[i % balloonSrcs.length]);

export default function App() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio("/audio/nitin-cinematic-score.wav");
    a.loop = true;
    a.volume = 0.45;
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!started || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const s = reduce ? 0.5 : 1;

      const chatChars = gsap.utils.toArray<HTMLElement>(".chat-line span");
      const hbdChars = gsap.utils.toArray<HTMLElement>(".big-hbd span");
      const photos = gsap.utils.toArray<HTMLElement>(".photo-card");

      gsap.set(".scene", { autoAlpha: 1 });
      gsap.set(".stage", { autoAlpha: 0 });
      gsap.set(chatChars, { visibility: "hidden" });
      gsap.set(hbdChars, { autoAlpha: 0 });
      gsap.set(".confetti-dot", { autoAlpha: 0, scale: 0 });
      gsap.set(".balloons img", { y: "110vh", opacity: 0 });
      gsap.set(".hat", { x: -120, y: 320, rotation: -200, opacity: 0 });
      gsap.set(photos, { autoAlpha: 0, scale: 0.92 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#f55f44", "#7fcef8", "#ffd166", "#ef476f", "#06d6a0"]
          });
        }
      });
      timelineRef.current = tl;

      // 1. Greeting
      tl.to(".s-greeting", { autoAlpha: 1, duration: 0.4 * s })
        .from(".s-greeting .greet", { y: 18, autoAlpha: 0, duration: 0.9 * s })
        .from(".s-greeting .name", { y: 18, autoAlpha: 0, duration: 0.7 * s }, "-=0.3")
        .from(".s-greeting .sub", { y: 14, autoAlpha: 0, duration: 0.7 * s }, "-=0.2")
        .to(".s-greeting", { autoAlpha: 0, y: -10, duration: 0.7 * s }, "+=2");

      // 2. Birthday line
      tl.to(".s-intro", { autoAlpha: 1, duration: 0.4 * s }, "<0.3")
        .from(".s-intro p", { y: 16, autoAlpha: 0, scale: 0.95, duration: 0.8 * s })
        .to(".s-intro", { autoAlpha: 0, y: -10, duration: 0.6 * s }, "+=1.6");

      // 3. Chat bubble typewriter
      tl.to(".s-chat", { autoAlpha: 1, duration: 0.3 * s }, "<0.3")
        .from(".chat-card", { scale: 0.85, autoAlpha: 0, duration: 0.5 * s })
        .to(chatChars, { visibility: "visible", duration: 0.04, stagger: 0.035 * s, ease: "none" })
        .from(".send-btn", { scale: 0.5, autoAlpha: 0, duration: 0.3 * s })
        .to(".send-btn", { backgroundColor: "#1f8ef1", color: "#fff", duration: 0.18 * s })
        .to(".s-chat", { autoAlpha: 0, y: -30, scale: 0.96, duration: 0.7 * s }, "+=1.4");

      // 4. Pivot (idea-style)
      tl.to(".s-pivot", { autoAlpha: 1, duration: 0.3 * s }, "<0.3")
        .from(".pivot-1", { autoAlpha: 0, y: 18, duration: 0.7 * s })
        .to(".pivot-1", { autoAlpha: 0, y: -18, duration: 0.6 * s }, "+=1.6")
        .from(".pivot-2", { autoAlpha: 0, y: 18, duration: 0.7 * s })
        .to(".pivot-2 .em", { scale: 1.18, color: "#fff", backgroundColor: "#1f8ef1", duration: 0.45 * s }, "+=0.4")
        .to(".s-pivot", { autoAlpha: 0, scale: 0.96, duration: 0.7 * s }, "+=1.4");

      // 5. Portrait + balloons rising + big HBD
      tl.to(".s-finale", { autoAlpha: 1, duration: 0.4 * s }, "<0.3")
        .fromTo(
          ".balloons img",
          { y: "110vh", opacity: 0.95 },
          { y: "-100vh", opacity: 1, duration: 5 * s, stagger: 0.18, ease: "power1.out" },
          "<"
        )
        .from(".portrait", { scale: 3.2, autoAlpha: 0, x: 25, y: -25, rotation: -45, duration: 0.7 * s }, "<0.4")
        .from(".hat", { x: -120, y: 320, rotation: -200, opacity: 0, duration: 0.5 * s })
        .to(".hat", { opacity: 1, duration: 0.01 })
        .to(hbdChars, {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          duration: 0.7 * s,
          stagger: 0.08,
          ease: "elastic.out(1, 0.55)"
        }, "-=0.1")
        .from(".portrait-sub", { autoAlpha: 0, y: 12, duration: 0.6 * s }, "-=0.3");

      // 6. Confetti dots burst (mirrors original .eight circles)
      tl.to(".confetti-dot", {
        autoAlpha: 1,
        scale: 1,
        duration: 1.2 * s,
        stagger: 0.14,
        repeat: 1,
        yoyo: true,
        repeatDelay: 0.4
      }, "+=0.3");

      // 7. Photo gallery (one at a time)
      photos.forEach((card, i) => {
        tl.to(card, { autoAlpha: 1, scale: 1, duration: 0.7 * s }, i === 0 ? "+=0.4" : "<0.2")
          .to(card, { autoAlpha: 0, scale: 1.04, duration: 0.55 * s }, "+=1.5");
      });

      // 8. Outro
      tl.to(".s-finale", { autoAlpha: 0, y: -20, duration: 0.7 * s }, "+=0.4")
        .to(".s-outro", { autoAlpha: 1, duration: 0.3 * s }, "<0.3")
        .from(".outro-line", { autoAlpha: 0, y: 14, duration: 0.7 * s, stagger: 0.6 })
        .from(".replay-btn", { autoAlpha: 0, y: 10, duration: 0.5 * s }, "+=0.3");
    }, rootRef);

    return () => ctx.revert();
  }, [started]);

  const begin = () => {
    setStarted(true);
    setPaused(false);
    setMuted(false);
    const a = audioRef.current;
    if (a) {
      a.muted = false;
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  };

  const replay = () => {
    timelineRef.current?.restart();
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      a.play().catch(() => {});
      a.muted = muted;
    }
    setPaused(false);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    const a = audioRef.current;
    if (next) {
      timelineRef.current?.pause();
      a?.pause();
    } else {
      timelineRef.current?.resume();
      a?.play().catch(() => {});
    }
  };

  const chatChars = tribute.script.chatLine.split("");
  const bigChars = tribute.script.bigText.split("");

  return (
    <main ref={rootRef} className="app-shell">
      {!started && (
        <section className="start-screen">
          <div className="start-content">
            <p className="kicker">A birthday note</p>
            <h1>For {tribute.honoree}</h1>
            <button onClick={begin}>
              <Play size={20} fill="currentColor" />
              Play
            </button>
          </div>
        </section>
      )}

      <section className="scene" aria-live="polite">
        <div className="stage s-greeting">
          <h1>
            <span className="greet">{tribute.script.greeting}</span>{" "}
            <span className="name">{tribute.script.name}</span>
          </h1>
          <p className="sub">It's a special day.</p>
        </div>

        <div className="stage s-intro">
          <p>{tribute.script.intro}</p>
        </div>

        <div className="stage s-chat">
          <div className="chat-card">
            <p className="chat-line">
              {chatChars.map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </p>
            <button className="send-btn">{tribute.script.sendLabel}</button>
          </div>
        </div>

        <div className="stage s-pivot">
          <p className="pivot-1">{tribute.script.pivotOne}</p>
          <p className="pivot-2">
            {tribute.script.pivotTwo}
            <strong className="em">{tribute.script.pivotEmphasis}</strong>.
          </p>
        </div>

        <div className="stage s-finale">
          <div className="portrait-wrap">
            <img className="portrait" src={tribute.heroImage} alt={tribute.honoree} />
            <svg className="hat" viewBox="0 0 64 64" aria-hidden="true">
              <polygon points="32,4 12,52 52,52" fill="#1f2933" />
              <rect x="10" y="50" width="44" height="6" rx="2" fill="#b37b22" />
              <circle cx="32" cy="6" r="4" fill="#f55f44" />
            </svg>
            <h2 className="big-hbd">
              {bigChars.map((c, i) => (
                <span key={i}>{c === " " ? " " : c}</span>
              ))}
            </h2>
            <p className="portrait-sub">{tribute.script.portrait}</p>
          </div>

          <div className="balloons" aria-hidden="true">
            {balloons.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                style={
                  {
                    left: `${(i * 7 + (i % 3) * 11) % 95}%`,
                    width: `${42 + ((i * 13) % 24)}px`,
                    animationDelay: `${(i % 7) * 0.2}s`
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="confetti-field" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={`confetti-dot dot-${i}`} />
            ))}
          </div>

          <div className="photo-reel">
            {tribute.galleryImages.map((image, i) => (
              <figure className={`photo-card pc-${i}`} key={image.src}>
                <img src={image.src} alt={`${tribute.honoree} ${i + 1}`} />
              </figure>
            ))}
          </div>
        </div>

        <div className="stage s-outro">
          <p className="outro-line">{tribute.script.closing}</p>
          <p className="outro-line signoff">{tribute.script.signoff}</p>
          <button className="replay-btn" onClick={replay}>
            <RotateCcw size={18} />
            {tribute.script.replay}
          </button>
        </div>
      </section>

      {started && (
        <div className="control-dock">
          <button onClick={togglePause} aria-label={paused ? "Resume" : "Pause"}>
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}
    </main>
  );
}
