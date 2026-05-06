// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data);
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData]);
          } else {
            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
          }
        }

        // Check if the iteration is over
        // Run amimation if so
        if ( dataArr.length === dataArr.indexOf(customData) + 1 ) {
          animationTimeline();
        } 
      });
    });
};

const confettiColors = ["#ff69b4", "#ffd166", "#7bdff2", "#b2f7ef", "#f7d6e0", "#ffffff", "#15a1ed"];

const fireConfetti = options => {
  if (!window.confetti) {
    return;
  }

  window.confetti(Object.assign({
    colors: confettiColors,
    disableForReducedMotion: true
  }, options));
};

const runPhotoConfetti = () => {
  fireConfetti({
    particleCount: 170,
    spread: 74,
    startVelocity: 38,
    origin: { y: 0.62 }
  });
  fireConfetti({
    particleCount: 85,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 }
  });
  fireConfetti({
    particleCount: 85,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 }
  });
  fireConfetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 28,
    scalar: 0.85,
    origin: { x: 0.5, y: 0.12 }
  });
};

const runFinaleConfetti = () => {
  if (!window.confetti) {
    return;
  }

  const end = Date.now() + 1800;

  fireConfetti({
    particleCount: 90,
    spread: 82,
    startVelocity: 42,
    origin: { x: 0.5, y: 0.54 }
  });

  setTimeout(() => {
    fireConfetti({
      particleCount: 65,
      angle: 58,
      spread: 70,
      startVelocity: 48,
      origin: { x: 0.05, y: 0.76 }
    });
    fireConfetti({
      particleCount: 65,
      angle: 122,
      spread: 70,
      startVelocity: 48,
      origin: { x: 0.95, y: 0.76 }
    });
  }, 240);

  const rain = () => {
    fireConfetti({
      particleCount: 2,
      startVelocity: 0,
      ticks: 220,
      gravity: 0.42,
      scalar: 0.85,
      spread: 90,
      origin: { x: Math.random(), y: -0.05 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(rain);
    }
  };

  setTimeout(rain, 520);
};

const playNameCelebration = () => {
  const name = document.querySelector(".celebration-name");

  if (!name) {
    return;
  }

  name.classList.remove("animate__animated", "animate__jackInTheBox", "animate__heartBeat");
  void name.offsetWidth;
  name.classList.add("animate__animated", "animate__jackInTheBox");

  setTimeout(() => {
    name.classList.remove("animate__jackInTheBox");
    void name.offsetWidth;
    name.classList.add("animate__heartBeat");
  }, 900);
};

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.9, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.3, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.9,
      {
        opacity: 0,
        y: 10
      },
      "+=3"
    )
    .to(
      ".two",
      0.5,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=3"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)"
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150
      },
      "+=0.5"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 90,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      3.2,
      {
        opacity: 0,
        y: 900,
        scale: 0.55,
        rotation: -8
      },
      {
        opacity: 0.92,
        y: -820,
        scale: 1,
        rotation: 8,
        ease: Power1.easeOut
      },
      0.12
    )
    .call(() => {
      runPhotoConfetti();
      playNameCelebration();
    })
    .fromTo(
      ".celebration-name",
      0.75,
      {
        opacity: 0,
        scale: 0.55,
        y: 20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: Back.easeOut.config(1.7)
      }
    )
    .to(
      ".celebration-name",
      0.45,
      {
        opacity: 0,
        scale: 1.08,
        y: -22,
        ease: Power1.easeIn
      },
      "+=1"
    )
    .from(
      ".lydia-dp",
      0.9,
      {
        scale: 1.18,
        opacity: 0,
        y: 38,
        ease: Expo.easeOut
      },
      "-=0.1"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .call(() => {
      runFinaleConfetti();
    }, null, null, "+=0.3")
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90,
        transformOrigin: "50% 50%",
        ease: Power1.easeOut
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};

// Run fetch and animation in sequence
fetchData();
