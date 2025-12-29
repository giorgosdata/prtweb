// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// -----------------------------
// Horizontal scroll section
// -----------------------------
function initHorizontal() {
  const scroller   = document.querySelector(".horizontal-scroller");
  const wrapper    = document.querySelector(".horizontal-wrapper");
  const container  = document.querySelector(".horizontal-container");
  if (!scroller || !wrapper || !container) return;

  const imgs = scroller.querySelectorAll("img");
  let loaded = 0;
  const done = () => {
    ScrollTrigger.refresh();
  };

  if (imgs.length) {
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length) done();
      } else {
        img.addEventListener(
          "load",
          () => {
            loaded++;
            if (loaded === imgs.length) done();
          },
          { once: true }
        );
      }
    });
  }

  const getDistance = () =>
    scroller.scrollWidth - document.documentElement.clientWidth;

  // kill old trigger if exists (hot reload safety)
  ScrollTrigger.getAll().forEach((t) => {
    if (t.vars && t.vars.id === "horizontalPRT") t.kill();
  });

  const tween = gsap.to(scroller, {
    x: () => -getDistance(),
    ease: "none",
    overwrite: true,
  });

  ScrollTrigger.create({
    id: "horizontalPRT",
    animation: tween,
    trigger: wrapper,
    start: "top top",
    end: () => "+=" + getDistance() * 0.6,
    scrub: 1.1,
    pin: container,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  window.addEventListener("resize", () => ScrollTrigger.refresh());
}

window.addEventListener("load", () => {
  initHorizontal();
  ScrollTrigger.refresh();
});

gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({ ignoreMobileResize: true });

// -----------------------------
// Cards + images scroll section
// -----------------------------
(function () {
  const cardsWrap = document.querySelector(".cards");
  const cardTexts = document.querySelectorAll(".cards-text");
  const images = document.querySelectorAll(".cards-image");
  const cta = document.querySelector(".cards-cta");

  if (!cardsWrap || !cardTexts.length || !images.length) return;

  window.addEventListener(
    "scroll",
    () => {
      const rect = cardsWrap.getBoundingClientRect();
      const winH = window.innerHeight;

      const inside = rect.top <= 0 && rect.bottom >= winH;

      images.forEach((img) => img.classList.toggle("fixed", inside));
      if (cta) cta.classList.toggle("fixed", inside);

      cardTexts.forEach((txt, i) => {
        const top = txt.getBoundingClientRect().top;
        const visible = top <= winH / 2 || i === 0;
        gsap.to(images[i], {
          autoAlpha: visible ? 1 : 0,
          duration: 0.3,
          overwrite: true,
        });
      });
    },
    { passive: true }
  );
})();

// -----------------------------
// Custom cursor (no delay)
// -----------------------------
(function () {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  const OFFSET = 14; // 28px cursor => 14px offset για κέντρο

  document.addEventListener(
    "mousemove",
    (e) => {
      const x = e.clientX - OFFSET;
      const y = e.clientY - OFFSET;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    { passive: true }
  );
})();

// -----------------------------
// Typing text για το PRT box
// -----------------------------
const prtTypingEl = document.getElementById("prtTyping");

const prtText =
  "Το Pain Reprocessing Therapy (PRT) είναι μια σύγχρονη προσέγγιση που βασίζεται στη νευροεπιστήμη και βοηθά τον εγκέφαλο να “ξεμάθει” τον χρόνιο πόνο όταν αυτός δεν οφείλεται σε ενεργό σωματική βλάβη.";

function typeOnce(el, text, speed = 18) {
  if (!el || el.dataset.done === "1") return;
  el.dataset.done = "1";
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text.charAt(i++);
    if (i >= text.length) clearInterval(t);
  }, speed);
}

if (prtTypingEl && window.ScrollTrigger) {
  ScrollTrigger.create({
    trigger: ".horizontal-container",
    start: "top 70%",
    once: true,
    onEnter: () => typeOnce(prtTypingEl, prtText, 50),
  });
} else if (prtTypingEl) {
  setTimeout(() => typeOnce(prtTypingEl, prtText, 18), 400);
}

// -----------------------------
// Highlight active nav link
// -----------------------------
(function () {
  const links = document.querySelectorAll("nav .nav-link");
  if (!links.length) return;

  let path = window.location.pathname.split("/").pop();

  if (path === "" || path === "/") {
    path = "index.html";
  }

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("nav-link--active");
    }
  });
})();

// -----------------------------
// Slider "Σε ποιους απευθύνομαι"
// -----------------------------
(function(){
  const $slider  = $(".slider");
  if (!$slider.length) return;

  const $slides  = $slider.find(".slide");
  const $bulletsContainer = $(".bullets");

  function calculateHeight() {
    const $active = $slides.filter(".active");
    if ($active.length) {
      $slider.height($active.outerHeight());
    }
  }

  function resetSlides() {
    $slides
      .removeClass("inactiveRight")
      .removeClass("inactiveLeft");
  }

  function gotoSlide($activeSlide, $slide, className) {
    $activeSlide.removeClass("active").addClass("inactive " + className);
    $slide.removeClass("inactive").addClass("active");
    calculateHeight();
    resetBullets();
    setTimeout(resetSlides, 300);
  }

  // arrows
  $(".next").on("click", function(e){
    e.preventDefault(); // 👈 σταματάμε το href="#" να σε στέλνει στην κορυφή
    const $activeSlide = $slides.filter(".active");
    const $nextSlide   = $activeSlide.next(".slide").length
      ? $activeSlide.next(".slide")
      : $slides.first();
    gotoSlide($activeSlide, $nextSlide, "inactiveLeft");
  });

  $(".previous").on("click", function(e){
    e.preventDefault(); // 👈 επίσης εδώ
    const $activeSlide = $slides.filter(".active");
    const $prevSlide   = $activeSlide.prev(".slide").length
      ? $activeSlide.prev(".slide")
      : $slides.last();
    gotoSlide($activeSlide, $prevSlide, "inactiveRight");
  });

  // bullets
  function addBullets(){
    const totalSlides = $slides.length;
    for (let i = 0; i < totalSlides; i++) {
      const $bullet = $("<span class='bullet'></span>");
      if (i === 0) $bullet.addClass("active");
      $bulletsContainer.append($bullet);
    }
  }

  function resetBullets(){
    $(".bullet.active").removeClass("active");
    const index = $slides.filter(".active").index() + 1;
    $(".bullet:nth-child(" + index + ")").addClass("active");
  }

  $(document).on("click", ".bullet", function(e){
    e.preventDefault();
    const $this = $(this);
    if ($this.hasClass("active")) return;
    const $activeSlide = $slides.filter(".active");
    const currentIndex = $activeSlide.index();
    const targetIndex  = $this.index();
    const $targetSlide = $slides.eq(targetIndex);

    gotoSlide(
      $activeSlide,
      $targetSlide,
      currentIndex > targetIndex ? "inactiveRight" : "inactiveLeft"
    );
  });

  // init
  addBullets();
  calculateHeight();

  $(window).on("resize", function(){
    calculateHeight();
  });
})();
