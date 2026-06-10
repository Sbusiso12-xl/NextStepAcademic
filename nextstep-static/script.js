/* ============================================================
   NextStep Academic Solutions — script.js
   GSAP 3 · ScrollTrigger · scroll + interaction animations
   ============================================================ */

// ── Active nav link ──────────────────────────────────────────
(function () {
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(function (a) {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();
// ── Theme toggle ─────────────────────────────────────────────
(function () {
  var root        = document.documentElement;
  var toggleBtn   = document.getElementById("theme-toggle");
  var iconSun     = document.getElementById("icon-sun");
  var iconMoon    = document.getElementById("icon-moon");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("ns-theme", theme);
    if (iconSun && iconMoon) {
      iconSun.style.display  = theme === "light" ? "block" : "none";
      iconMoon.style.display = theme === "light" ? "none"  : "block";
    }
  }

  // Restore saved preference (or default to dark)
  applyTheme(localStorage.getItem("ns-theme") || "dark");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }
})();

// ── Hamburger / mobile nav ────────────────────────────────────
(function () {
  var navToggle  = document.getElementById("nav-toggle");
  var navMobile  = document.getElementById("nav-mobile");
  var iconMenu   = document.getElementById("icon-menu");
  var iconClose  = document.getElementById("icon-close");

  if (!navToggle || !navMobile) return;

  navToggle.addEventListener("click", function () {
    var isOpen = navMobile.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
    if (iconMenu)  iconMenu.style.display  = isOpen ? "none"  : "block";
    if (iconClose) iconClose.style.display = isOpen ? "block" : "none";
  });

  // Close drawer when a link is tapped
  navMobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navMobile.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      if (iconMenu)  iconMenu.style.display  = "block";
      if (iconClose) iconClose.style.display = "none";
    });
  });
})();
// ── Footer year ──────────────────────────────────────────────
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── GSAP animations ──────────────────────────────────────────
(function () {
  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
  function q(sel)  { return document.querySelector(sel); }
  function qq(sel) { return gsap.utils.toArray(sel); }

  /* ----------------------------------------------------------
     1. HEADER — shrink + blur on scroll
  ---------------------------------------------------------- */
  var header = q(".site-header");
  if (header && window.ScrollTrigger) {
    ScrollTrigger.create({
      start: "top -60",
      onEnter:  function () { header.classList.add("header-scrolled"); },
      onLeaveBack: function () { header.classList.remove("header-scrolled"); }
    });
  }

  /* ----------------------------------------------------------
     2. HERO ENTRANCE — staggered timeline
        Runs via window._gsapHeroReady() called by loader.js.
        Falls back immediately if no loader present.
  ---------------------------------------------------------- */
  function runHeroEntrance() {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (q('[data-anim="fade"]')) {
      tl.from('[data-anim="fade"]', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
      });
    }

    if (q('[data-anim="hero-title"]')) {
      tl.from('[data-anim="hero-title"]', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.3");
    }

    if (q('[data-anim="fade-up"]') && !window.ScrollTrigger) {
      tl.from('[data-anim="fade-up"]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12
      }, "-=0.5");
    }

    var statsEl = q('[data-anim="stats"]');
    if (statsEl) {
      tl.from(statsEl.children, {
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15
      }, "-=0.4");
    }
  }

  /* If loader.js is present it sets this */
  if (document.getElementById("ns-loader")) {
    window._gsapHeroReady = runHeroEntrance;
  } else {
    runHeroEntrance();
  }

  /* ----------------------------------------------------------
     3. HERO — floating math equations
  ---------------------------------------------------------- */
  qq(".hero-equations span").forEach(function (el, i) {
    gsap.to(el, {
      y: "random(-18, 18)",
      x: "random(-10, 10)",
      rotation: "random(-8, 8)",
      duration: gsap.utils.random(4, 7),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.5
    });
  });

  /* ----------------------------------------------------------
     4. HERO BACKGROUND — parallax on scroll
  ---------------------------------------------------------- */
  var heroBg = q(".hero-bg");
  var heroEl = q(".hero");

  if (heroBg && heroEl && window.ScrollTrigger) {
    gsap.to(heroBg, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  /* ----------------------------------------------------------
     5. SCROLL — page heroes & sections
  ---------------------------------------------------------- */
  if (window.ScrollTrigger) {

    qq('[data-anim="fade-up"]').forEach(function (el) {

      if (el.closest(".hero")) return;

      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    /* Card groups */
    var cardParents = new Set();

    qq('[data-anim="card"]').forEach(function (el) {
      cardParents.add(el.parentElement);
    });

    cardParents.forEach(function (parent) {

      var cards = parent.querySelectorAll('[data-anim="card"]');

      if (!cards.length) return;

      gsap.from(cards, {
        scrollTrigger: {
          trigger: parent,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out"
      });
    });

    /* Sections */
    qq('[data-anim="section"]').forEach(function (el) {

      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out"
      });
    });

    /* Pricing groups */
    qq(".pkg-group").forEach(function (group) {

      gsap.from(group.querySelectorAll(".pkg-card"), {
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out"
      });
    });

    /* Testimonial */
    var testimonial = q(".testimonial blockquote");

    if (testimonial) {
      gsap.from(testimonial.children, {
        scrollTrigger: {
          trigger: testimonial,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.18,
        ease: "power2.out"
      });
    }

    /* Stat counters */
    qq(".stats .k").forEach(function (el) {

      var raw = el.textContent.trim();
      var num = parseFloat(raw);
      var suffix = raw.replace(/[\d.]/g, "");

      if (isNaN(num)) return;

      el.textContent = "0" + suffix;

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: function () {

          gsap.to({ val: 0 }, {
            val: num,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent =
                Math.round(this.targets()[0].val) + suffix;
            }
          });
        }
      });
    });

    /* Vision */
    var visionInner = q(".vision-inner");

    if (visionInner) {
      gsap.from(visionInner, {
        scrollTrigger: {
          trigger: visionInner,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        scale: 0.97,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out"
      });
    }

    /* CTA */
    var ctaInner = q(".cta .inner");

    if (ctaInner) {
      gsap.from(ctaInner.children, {
        scrollTrigger: {
          trigger: ctaInner,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 25,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out"
      });
    }

    /* Footer */
    var footer = q(".site-footer");

    if (footer) {
      gsap.from(footer, {
        scrollTrigger: {
          trigger: footer,
          start: "top 95%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power2.out"
      });
    }
  }

  /* ----------------------------------------------------------
     6. INTERACTIVE — hover animations
  ---------------------------------------------------------- */
  function hoverLift(selector, lift) {

    lift = lift || -4;

    document.querySelectorAll(selector).forEach(function (el) {

      el.style.transition = el.style.transition
        .replace(/transform[^,]*(,|$)/g, "")
        .replace(/^,\s*/, "");

      el.addEventListener("mouseenter", function () {
        gsap.to(el, {
          y: lift,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      el.addEventListener("mouseleave", function () {
        gsap.to(el, {
          y: 0,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto"
        });
      });
    });
  }

  hoverLift(".btn", -3);
  hoverLift(".feature-card", -5);
  hoverLift(".service-card", -5);
  hoverLift(".pkg-card", -4);
  hoverLift(".plan", -4);
  hoverLift(".glass", -3);
  hoverLift(".strip-card", -3);

  /* Nav hover */
  document.querySelectorAll(".nav a").forEach(function (a) {

    a.addEventListener("mouseenter", function () {
      gsap.to(a, {
        color: "var(--foreground)",
        duration: 0.2
      });
    });

    a.addEventListener("mouseleave", function () {

      if (!a.classList.contains("active")) {
        gsap.to(a, {
          color: "var(--muted-fg)",
          duration: 0.2
        });
      }
    });
  });

  /* Button pulse */
  document.querySelectorAll(".btn-primary").forEach(function (btn) {

    btn.addEventListener("mousedown", function () {
      gsap.to(btn, {
        scale: 0.96,
        duration: 0.1,
        ease: "power2.in"
      });
    });

    btn.addEventListener("mouseup", function () {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(2)"
      });
    });

    btn.addEventListener("mouseleave", function () {
      gsap.to(btn, {
        scale: 1,
        duration: 0.15
      });
    });
  });

  /* Form fields */
  document.querySelectorAll(
    ".form-row input, .form-row select, .form-row textarea"
  ).forEach(function (field) {

    field.addEventListener("focus", function () {
      gsap.to(field, {
        scale: 1.01,
        duration: 0.2,
        ease: "power2.out"
      });
    });

    field.addEventListener("blur", function () {
      gsap.to(field, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    });
  });

  /* Success animation */
  var successEl = document.getElementById("success");

  if (successEl) {

    window._animateSuccess = function () {

      gsap.fromTo(
        successEl,
        {
          y: 30,
          opacity: 0,
          scale: 0.97
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.4)"
        }
      );
    };
  }

})();

/* ============================================================
   BOOKING FORM → Supabase REST + WhatsApp
   ============================================================ */

var form = document.getElementById("booking-form");

if (form) {

  var SUPABASE_URL =
    "https://cvbyjfzdxpskrhvbohtf.supabase.co";

  var SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YnlqZnpkeHBza3JodmJvaHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzgwOTMsImV4cCI6MjA5NDgxNDA5M30.TwpNIiiq5ybD2hDShPy7a2bG7-mXeaQJidAOEd9wCz0";

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    var btn = form.querySelector("button[type=submit]");
    var btnText = btn.querySelector(".btn-text");
    var btnSpin = btn.querySelector(".spinner");

    btn.disabled = true;
    btnText.textContent = "Sending…";
    btnSpin.classList.remove("hidden");

    var fd = new FormData(form);

    var payload = {
      full_name: (fd.get("full_name") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      session_type: (fd.get("session_type") || "").toString(),
      preferred_date: (fd.get("preferred_date") || "").toString(),
      notes: (fd.get("notes") || "").toString(),
    };

    if (
      !payload.full_name ||
      !payload.email ||
      !payload.phone ||
      !payload.session_type
    ) {
      alert("Please fill in all required fields.");
      reset();
      return;
    }

    try {

      var res = await fetch(
        SUPABASE_URL + "/rest/v1/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY,
            Prefer: "return=minimal"
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      /* SUCCESS UI */
      form.classList.add("hidden");

      var s = document.getElementById("success");

      s.classList.remove("hidden");

      if (window._animateSuccess) {
        window._animateSuccess();
      }

      /* ───────────────────────────────
         WHATSAPP INTEGRATION
      ─────────────────────────────── */

      var whatsappMessage =
        "Hello NextStep Academic Solutions,\n\n" +
        "I would like to book a session:\n\n" +
        "Name: " + payload.full_name + "\n" +
        "Phone: " + payload.phone + "\n" +
        "Email: " + payload.email + "\n" +
        "Session: " + payload.session_type + "\n" +
        "Preferred Date: " +
        (payload.preferred_date || "Not specified") + "\n" +
        "Notes: " +
        (payload.notes || "None") + "\n\n" +
        "Please confirm availability.";

      var whatsappURL =
        "https://wa.me/27717010398?text=" +
        encodeURIComponent(whatsappMessage);

      setTimeout(function () {
        window.open(whatsappURL, "_blank");
      }, 800);

    } catch (err) {

      alert(
        "Could not submit your booking. Please WhatsApp 071 701 0398."
      );

      reset();
    }

    function reset() {
      btn.disabled = false;
      btnText.textContent = "Send booking request";
      btnSpin.classList.add("hidden");
    }
  });
}