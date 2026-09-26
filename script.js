/* ============================================================
   SUDHANSHU SRIVASTAVA — PORTFOLIO SCRIPT (vanilla JS only)
   ============================================================ */
(function(){
  "use strict";

  /* ---- Loader ---- */
  window.addEventListener("load", function(){
    var loader = document.getElementById("loader");
    setTimeout(function(){ loader && loader.classList.add("hidden"); }, 350);
  });

  /* ---- Theme toggle (persists for the session only) ---- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var stored = null;
  try { stored = sessionStorage.getItem("theme"); } catch(e){}
  if(stored){ root.setAttribute("data-theme", stored); }
  else if(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches){
    root.setAttribute("data-theme","light");
  }
  if(toggle){
    toggle.addEventListener("click", function(){
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { sessionStorage.setItem("theme", next); } catch(e){}
    });
  }

  /* ---- Mobile nav burger ---- */
  var burger = document.getElementById("nav-burger");
  var navLinks = document.getElementById("nav-links");
  if(burger && navLinks){
    burger.addEventListener("click", function(){ navLinks.classList.toggle("open"); });
    navLinks.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ navLinks.classList.remove("open"); });
    });
  }

  /* ---- Scroll progress + active nav highlight + back to top ---- */
  var progress = document.getElementById("scroll-progress");
  var backTop = document.getElementById("back-to-top");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function onScroll(){
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = (h.scrollHeight - h.clientHeight) || 1;
    var pct = (scrollTop / scrollHeight) * 100;
    if(progress) progress.style.width = pct + "%";
    if(backTop) backTop.classList.toggle("show", scrollTop > 500);

    var pos = scrollTop + 120;
    var activeId = sections.length ? sections[0].id : null;
    sections.forEach(function(sec){
      if(sec.offsetTop <= pos) activeId = sec.id;
    });
    navAnchors.forEach(function(a){
      a.classList.toggle("active", a.getAttribute("href") === "#" + activeId);
    });
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  if(backTop){
    backTop.addEventListener("click", function(){
      window.scrollTo({ top:0, behavior:"smooth" });
    });
  }

  /* ---- Typing animation in hero ---- */
  var typeEl = document.getElementById("type-line");
  var phrases = [
    "Computational Fluid Dynamics",
    "Aerodynamic Optimization",
    "Fluid–Structure Interaction",
    "CAD & Simulation-Driven Design"
  ];
  if(typeEl){
    var pi = 0, ci = 0, deleting = false;
    function typeTick(){
      var word = phrases[pi];
      if(!deleting){
        ci++;
        typeEl.textContent = word.slice(0, ci);
        if(ci === word.length){ deleting = true; setTimeout(typeTick, 1400); return; }
      } else {
        ci--;
        typeEl.textContent = word.slice(0, ci);
        if(ci === 0){ deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(typeTick, deleting ? 35 : 55);
    }
    typeTick();
  }

  /* ---- Scroll-triggered reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400, start = null;
    function step(ts){
      if(!start) start = ts;
      var progressPct = Math.min((ts - start) / duration, 1);
      var value = Math.floor(progressPct * target);
      el.textContent = value + suffix;
      if(progressPct < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if("IntersectionObserver" in window && counters.length){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ animateCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold:0.4 });
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* ---- Skill gauge fill on scroll ---- */
  var gauges = document.querySelectorAll(".gauge-fill");
  if("IntersectionObserver" in window && gauges.length){
    var gio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var pct = entry.target.getAttribute("data-pct") || "0";
          entry.target.style.width = pct + "%";
          gio.unobserve(entry.target);
        }
      });
    }, { threshold:0.3 });
    gauges.forEach(function(el){ gio.observe(el); });
  }

  /* ---- Lightbox gallery ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  document.querySelectorAll("[data-lightbox]").forEach(function(fig){
    fig.addEventListener("click", function(){
      var img = fig.querySelector("img");
      if(!img || !lightbox || !lightboxImg) return;
      lightboxImg.src = img.getAttribute("src");
      lightboxImg.alt = img.getAttribute("alt") || "";
      lightbox.classList.add("open");
    });
  });
  var lbClose = document.getElementById("lb-close");
  if(lbClose) lbClose.addEventListener("click", function(){ lightbox.classList.remove("open"); });
  if(lightbox){
    lightbox.addEventListener("click", function(e){ if(e.target === lightbox) lightbox.classList.remove("open"); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") lightbox.classList.remove("open"); });
  }

  /* ---- Ripple effect on buttons ---- */
  document.querySelectorAll(".btn").forEach(function(btn){
    btn.addEventListener("click", function(e){
      var rect = btn.getBoundingClientRect();
      var span = document.createElement("span");
      var size = Math.max(rect.width, rect.height);
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - rect.left - size/2) + "px";
      span.style.top = (e.clientY - rect.top - size/2) + "px";
      btn.appendChild(span);
      setTimeout(function(){ span.remove(); }, 620);
    });
  });

  /* ---- Contact form (client-side only, no backend wired) ---- */
  var form = document.getElementById("contact-form");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var note = document.getElementById("form-status");
      var email = form.querySelector('[name="email"]').value.trim();
      var msg = form.querySelector('[name="message"]').value.trim();
      if(!email || !msg){
        if(note){ note.textContent = "Please fill in your email and message before sending."; note.style.color = "var(--danger)"; }
        return;
      }
      if(note){
        note.textContent = "Thanks — this form is a placeholder. Connect it to Formspree, EmailJS or your backend to receive messages.";
        note.style.color = "var(--flow)";
      }
      form.reset();
    });
  }

  /* ---- Lazy loading fallback note (native loading="lazy" used in HTML) ---- */
})();
