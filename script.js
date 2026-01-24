// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Init Lenis
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
  smoothTouch: false
});

// Sync Lenis scroll with ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

// Use GSAP ticker for Lenis RAF
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP lag smoothing (IMPORTANT)
gsap.ticker.lagSmoothing(0);






function home() {

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
      duration: 0.85
    }
  });

  /* VIDEO FADE (FASTER) */
  tl.from(".hero-video", {
    opacity: 0,
    scale: 1.03,
    duration: 1.1,
    ease: "power2.out"
  });

  /* NAVBAR */
  tl.from(".nav", {
    y: -24,
    opacity: 0,
    duration: 0.65
  }, "-=0.9");

  /* HERO TEXT */
  tl.from(".hero-content h1", {
    y: 60,
    opacity: 0,
    duration: 0.9
  }, "-=0.5");

  /* BOTTOM LINE */
  tl.from(".bottom-line", {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 0.75
  }, "-=0.6");

  /* PRODUCT CARD */
  tl.from(".product-card", {
    y: 32,
    opacity: 0,
    duration: 0.7
  }, "-=0.45");

  /* CTA TEXT */
  tl.from(".cta p", {
    y: 22,
    opacity: 0,
    duration: 0.65
  }, "-=0.4");

  /* CTA BUTTON */
  tl.from(".hero-cta", {
    y: 18,
    opacity: 0,
    duration: 0.65
  }, "-=0.35");

}

home()

function page1() {
  gsap.registerPlugin(ScrollTrigger);

  /* ========================= */
  /* PERFECT PARAGRAPH REVEAL */
  /* ========================= */

  const text = document.querySelector(".reveal-text");
  const content = text.textContent;
  text.innerHTML = "";

  content.split("").forEach(char => {
    if (char === " ") {
      text.appendChild(document.createTextNode("\u00A0"));
    } else {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("char");
      text.appendChild(span);
    }
  });

  // SET INITIAL STATE (IMPORTANT FOR RESET)
  gsap.set(".char", {
    opacity: 0,
    y: 50,
    filter: "blur(10px)"
  });

  gsap.to(".char", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    ease: "power3.out",
    stagger: 0.02,           // ⏳ slower reveal

    scrollTrigger: {
      trigger: ".reveal-text",
      start: "top 90%",
      end: "top 30%",        // 🧘 longer scroll distance
      scrub: 1.5,            // 🔥 smooth & slow
      toggleActions: "play reverse play reverse"
      // 👆 resets when leaving, replays when entering again
    }
  });

  /* ========================= */
  /* IMAGE → VIDEO HOVER */
  /* ========================= */

  const hoverBox = document.querySelector(".hover-video");
  if (!hoverBox) return;

  const video = hoverBox.querySelector("video");
  const poster = hoverBox.querySelector(".video-poster");

  hoverBox.addEventListener("mouseenter", () => {
    poster.style.opacity = "0";
    video.currentTime = 0;
    video.play();
  });

  hoverBox.addEventListener("mouseleave", () => {
    poster.style.opacity = "1";
    video.pause();
  });
}

page1();


function page2() {
  const track = document.querySelector(".shopers-track");
  const nextBtn = document.querySelector(".slider-btn.next");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const body = document.body;

  let cards = Array.from(document.querySelectorAll(".shoper-card"));
  let index = 1;
  let autoSlide;
  let isAnimating = false;
  const GAP = 30;

  /* CLONE */
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = Array.from(document.querySelectorAll(".shoper-card"));

  function getCardSize() {
    return cards[0].offsetWidth + GAP;
  }

  let cardSize = getCardSize();
  track.style.transform = `translateX(-${cardSize * index}px)`;

  /* MOVE */
  function move() {
    isAnimating = true;
    track.style.transition = "transform 0.7s ease";
    track.style.transform = `translateX(-${cardSize * index}px)`;
  }

  function nextSlide() {
    if (isAnimating) return;
    index++;
    move();
  }

  function prevSlide() {
    if (isAnimating) return;
    index--;
    move();
  }

  /* LOOP FIX */
  track.addEventListener("transitionend", () => {
    isAnimating = false;
    track.style.transition = "none";

    if (index === cards.length - 1) {
      index = 1;
      track.style.transform = `translateX(-${cardSize * index}px)`;
    }

    if (index === 0) {
      index = cards.length - 2;
      track.style.transform = `translateX(-${cardSize * index}px)`;
    }
  });

  /* AUTO */
  function startAuto() {
    stopAuto();
    autoSlide = setInterval(nextSlide, 3000);
  }

  function stopAuto() {
    clearInterval(autoSlide);
  }

  nextBtn.addEventListener("click", () => {
    stopAuto();
    nextSlide();
    startAuto();
  });

  prevBtn.addEventListener("click", () => {
    stopAuto();
    prevSlide();
    startAuto();
  });

  /* GSAP REVEAL */
  gsap.from(cards, {
    y: 80,
    opacity: 0,
    duration: 1.3,
    ease: "power4.out",
    stagger: 0.12
  });

  /* CARD + BUTTON LOGIC */
  cards.forEach(card => {
    const img = card.querySelector("img");
    const bg = card.dataset.bg;
    const button = card.querySelector("button");

    /* CARD HOVER (NO BACKGROUND CHANGE) */
    card.addEventListener("mouseenter", () => {
      stopAuto();
      card.style.setProperty("--glow", 1);
    });

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rx = gsap.utils.mapRange(0, rect.height, 10, -10, y);
      const ry = gsap.utils.mapRange(0, rect.width, -10, 10, x);

      gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.25 });
      gsap.to(img, { x: ry * 0.6, y: rx * 0.6, duration: 0.25 });

      card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      startAuto();
      card.style.setProperty("--glow", 0);

      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6 });
      gsap.to(img, { x: 0, y: 0, duration: 0.6 });
    });

    /* ✅ BACKGROUND CHANGE — ONLY ON BUTTON HOVER */
    button.addEventListener("mouseenter", () => {
      stopAuto();
      if (bg) body.style.backgroundColor = bg;
    });

    button.addEventListener("mouseleave", () => {
      body.style.backgroundColor = "#ffffff";
      startAuto();
    });
  });

  /* INIT */
  startAuto();
}

page2();



function page3(){
  gsap.registerPlugin(ScrollTrigger);

/* ================= WORD SPLIT ================= */
function splitWords(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(n => {
    const frag = document.createDocumentFragment();
    n.textContent.trim().split(/\s+/).forEach(w => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      frag.appendChild(span);
    });
    n.parentNode.replaceChild(frag, n);
  });
}

const headline = document.getElementById("hugger");
splitWords(headline);

/* ================= TEXT ANIMATION (ON ENTER PAGE 3) ================= */
const textTL = gsap.timeline({
  scrollTrigger: {
    trigger: "#page3",
    start: "top 70%",
    toggleActions: "play none none none" // 👈 play once
  }
});

textTL.from(".hugger .word", {
  y: 18,
  opacity: 0,
  filter: "blur(6px)",
  duration: 0.85,
  stagger: 0.045,
  ease: "power3.out"
}).from(".italic", {
  opacity: 0,
  filter: "blur(14px)",
  duration: 1
}, "-=0.4");

/* ================= IMAGE PARALLAX (DESKTOP ONLY) ================= */
ScrollTrigger.matchMedia({
  "(min-width: 901px)": function () {
    gsap.to("#heroImage", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: "#page3",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2
      }
    });
  }
});

}


page3()


const menuBtn = document.querySelector(".menu-btn");
const menuOverlay = document.querySelector(".menu-overlay");
const closeBtn = document.querySelector(".menu-close");
const links = document.querySelectorAll(".menu-main a");
const images = document.querySelectorAll(".menu-image");

let activeImage = images[0];
let nextImage = images[1];

/* =========================
   INITIAL STATE
========================= */
gsap.set(menuOverlay, { opacity: 0, pointerEvents: "none" });
gsap.set(".menu-left", { scale: 1.1, opacity: 0, filter: "blur(12px)" });
gsap.set(".menu-right", { y: 80, opacity: 0 });
gsap.set(links, { y: 50, opacity: 0 });

/* DEFAULT IMAGE */
activeImage.style.backgroundImage = `url(${links[0].dataset.img})`;
activeImage.dataset.img = links[0].dataset.img;
links[0].classList.add("active");

/* =========================
   MASTER OPEN TIMELINE
========================= */
const tl = gsap.timeline({
  paused: true,
  defaults: { ease: "expo.out" }
});

tl
  .set(menuOverlay, { pointerEvents: "auto" })
  .to(menuOverlay, {
    opacity: 1,
    duration: 0.6
  })
  .to(".menu-left", {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.6
  }, 0)
  .to(".menu-right", {
    y: 0,
    opacity: 1,
    duration: 1.3
  }, 0.15)
  .to(links, {
    y: 0,
    opacity: 1,
    stagger: 0.08,
    duration: 1.2
  }, 0.35);

/* =========================
   OPEN
========================= */
menuBtn.addEventListener("click", () => {
  tl.timeScale(1).play(0);
});

/* =========================
   CLOSE (BUTTERY SMOOTH)
========================= */
closeBtn.addEventListener("click", () => {
  tl.timeScale(1.4).reverse();
});

/* =========================
   CINEMATIC IMAGE TRANSITION
========================= */
function swapImage(img) {
  if (activeImage.dataset.img === img) return;

  nextImage.style.backgroundImage = `url(${img})`;
  nextImage.dataset.img = img;

  gsap.set(nextImage, {
    opacity: 0,
    scale: 1.15,
    filter: "blur(10px)"
  });

  const imageTL = gsap.timeline({
    defaults: { ease: "expo.out" }
  });

  imageTL
    .to(activeImage, {
      scale: 1.05,
      opacity: 0,
      filter: "blur(14px)",
      duration: 1
    })
    .to(nextImage, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2
    }, 0.25)
    .add(() => {
      activeImage.classList.remove("active");
      nextImage.classList.add("active");

      const temp = activeImage;
      activeImage = nextImage;
      nextImage = temp;
    });
}

/* =========================
   LINK HOVER – MAGNETIC
========================= */
links.forEach(link => {

  link.addEventListener("mouseenter", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    swapImage(link.dataset.img);

    gsap.fromTo(
      link,
      { x: 0 },
      { x: 10, duration: 0.5, ease: "power3.out" }
    );
  });

  link.addEventListener("mouseleave", () => {
    gsap.to(link, {
      x: 0,
      duration: 0.6,
      ease: "expo.out"
    });
  });
});






