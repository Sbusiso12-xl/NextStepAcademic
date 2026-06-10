/* ============================================================
   NextStep Academic Solutions — loader.js (UPDATED)
   Based on Khumo Phala animation system
   ============================================================ */

(function () {

  /* ─────────────────────────────────────────────
     1. GUARD (run once per session)
  ───────────────────────────────────────────── */
  if (sessionStorage.getItem("ns-intro-seen")) return;
  sessionStorage.setItem("ns-intro-seen", "1");

  /* ─────────────────────────────────────────────
     2. BUILD OVERLAY
  ───────────────────────────────────────────── */
  var overlay = document.createElement("div");
  overlay.id = "ns-loader";

  overlay.innerHTML = [
    '<canvas id="ns-canvas"></canvas>',
    '<div id="ns-center">',
    '  <div id="ns-title">',
    '     <span class="ns-main">NextStep</span>',
    '     <span class="ns-sub">Academic Solutions</span>',
    '  </div>',
    '</div>'
  ].join("");

  var style = document.createElement("style");
  style.textContent = `
    #ns-loader{
      position:fixed;inset:0;z-index:99999;
      background:#07070c;
      overflow:hidden;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    #ns-canvas{
      position:absolute;inset:0;width:100%;height:100%;
    }

    /* center title */
    #ns-center{
      position:relative;
      z-index:2;
      text-align:center;
      opacity:0;
      transform:translateY(20px);
      animation:ns-rise 0.9s cubic-bezier(.22,1,.36,1) 1.4s forwards;
    }

    @keyframes ns-rise{
      to{opacity:1;transform:translateY(0);}
    }

    /* MAIN TITLE */
    .ns-main{
      display:block;
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(2.5rem,6vw,5rem);
      font-weight:700;
      letter-spacing:0.04em;

      background:linear-gradient(135deg,#ffffff,#f5d97a,#c8922a);
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;

      filter:drop-shadow(0 0 18px rgba(245,217,122,0.25));
    }

    /* SUB TITLE (SHORTER + CLEAN) */
    .ns-sub{
      display:block;
      margin-top:6px;
      font-size:0.75rem;
      letter-spacing:0.35em;
      text-transform:uppercase;
      color:rgba(255,255,255,0.65);
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  /* ─────────────────────────────────────────────
     3. CANVAS SETUP
  ───────────────────────────────────────────── */
  var canvas = document.getElementById("ns-canvas");
  var ctx = canvas.getContext("2d");
  var W, H;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  /* ─────────────────────────────────────────────
     4. FORMULAS (CLEAR + LESS BLUR + BALANCED GOLD/WHITE)
  ───────────────────────────────────────────── */

  var FORMULAE = [
    "E = mc²","F = ma","PV = nRT","a² + b² = c²",
    "∫f(x)dx","d/dx","lim x→∞","y = mx + c",
    "sin²θ + cos²θ = 1","GDP = C + I + G",
    "μ = Σx/n","σ² = Σ(x-μ)²/n","ROI","IRR",
    "∑","π","Δ","λ","θ","∞"
  ];

  function Particle(){
    this.reset(true);
  }

  Particle.prototype.reset = function(first){
    this.text = FORMULAE[Math.floor(Math.random()*FORMULAE.length)];

    this.x = Math.random()*W;
    this.y = first ? Math.random()*H : -20;

    this.vx = (Math.random()-0.5)*0.2;
    this.vy = 0.25 + Math.random()*0.35;

    this.size = 14 + Math.random()*10;

    /* IMPORTANT: LESS BLUR */
    this.alpha = 0.18 + Math.random()*0.25;

    /* white + soft gold mix */
    this.color = Math.random() > 0.5
      ? "rgba(255,255,255,"
      : "rgba(245,217,122,";

    this.rot = (Math.random()-0.5)*0.3;
  };

  Particle.prototype.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    this.rot += 0.002;

    if(this.y > H+40) this.reset(false);
  };

  Particle.prototype.draw = function(){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rot);

    ctx.font = this.size + "px 'Space Grotesk', sans-serif";

    ctx.fillStyle = this.color + this.alpha + ")";
    ctx.fillText(this.text,0,0);

    ctx.restore();
  };

  var particles = [];
  for(var i=0;i<140;i++){
    particles.push(new Particle());
  }

  /* ─────────────────────────────────────────────
     5. ANIMATION LOOP
  ───────────────────────────────────────────── */
  function animate(){
    ctx.clearRect(0,0,W,H);

    /* soft dark glow background */
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,W,H);

    for(var i=0;i<particles.length;i++){
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();

  /* ─────────────────────────────────────────────
     6. DISMISS TIMING (formulas first → title → exit)
  ───────────────────────────────────────────── */
  setTimeout(function(){
    overlay.style.transition = "opacity 0.7s ease";
    overlay.style.opacity = "0";

    document.body.style.overflow = "";

    setTimeout(function(){
      if(overlay.parentNode) overlay.remove();
      if(style.parentNode) style.remove();

      /* trigger GSAP entrance AFTER loader */
      if(window._gsapHeroReady){
        window._gsapHeroReady();
      }
    },700);

  }, 3600);

})();