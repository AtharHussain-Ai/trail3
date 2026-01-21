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
gsap.set(".menu-right", { y: 40, opacity: 0 });
gsap.set(".menu-left", { scale: 1.05, opacity: 0 });
gsap.set(links, { y: 40, opacity: 0 });

/* DEFAULT IMAGE */
activeImage.style.backgroundImage = `url(${links[0].dataset.img})`;
links[0].classList.add("active");

/* =========================
   MASTER TIMELINE (OPEN)
========================= */
const tl = gsap.timeline({
  paused: true,
  defaults: {
    ease: "expo.out",
    duration: 1
  }
});

tl
  .set(menuOverlay, { pointerEvents: "auto" })
  .to(menuOverlay, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out"
  })
  .to(".menu-left", {
    opacity: 1,
    scale: 1,
    duration: 1.4
  }, 0)
  .to(".menu-right", {
    y: 0,
    opacity: 1,
    duration: 1.2
  }, 0.1)
  .to(links, {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 1.1
  }, 0.3);

/* =========================
   OPEN
========================= */
menuBtn.addEventListener("click", () => {
  tl.timeScale(1).play(0);
});

/* =========================
   CLOSE (SOFT)
========================= */
closeBtn.addEventListener("click", () => {
  tl.timeScale(1.3).reverse();
});

/* =========================
   IMAGE TRANSITION (CINEMATIC)
========================= */
function swapImage(img) {
  if (activeImage.dataset.img === img) return;

  nextImage.style.backgroundImage = `url(${img})`;

  gsap.set(nextImage, {
    opacity: 0,
    scale: 1.08
  });

  const imageTL = gsap.timeline();

  imageTL
    .to(activeImage, {
      scale: 1.02,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out"
    })
    .to(nextImage, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "expo.out"
    }, 0.2)
    .add(() => {
      activeImage.classList.remove("active");
      nextImage.classList.add("active");

      const temp = activeImage;
      activeImage = nextImage;
      nextImage = temp;
    });
}

/* =========================
   LINK HOVER (POLISHED)
========================= */
links.forEach(link => {
  link.addEventListener("mouseenter", () => {

    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    swapImage(link.dataset.img);

    gsap.fromTo(
      link,
      { x: 0 },
      { x: 6, duration: 0.4, ease: "power2.out" }
    );
  });
});
