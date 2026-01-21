
const lenis = new Lenis({
  duration: 1.4,              // ⏳ smoothness (increase = slower)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium easing
  smoothWheel: true,
  smoothTouch: false
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);








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
