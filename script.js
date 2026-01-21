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
