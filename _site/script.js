/* Full Kit Marketing — minimal progressive enhancement */
(function () {
  "use strict";

  /* Current year in footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    /* Close menu after tapping a link */
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    /* Close on Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* Scroll-reveal — respects reduced-motion */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Contact form — submits to Web3Forms via fetch, no page reload */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');
    var accessKey = (form.querySelector('input[name="access_key"]') || {}).value || "";
    var configured = accessKey && accessKey.indexOf("YOUR_WEB3FORMS") !== 0;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Until a real Web3Forms key is set, fall back to email so the form is never a dead end. */
      if (!configured) {
        if (status) {
          status.className = "form-status err";
          status.innerHTML = "The contact form isn't live yet. Please email " +
            '<a href="mailto:rachel@fullkitmarketing.com">rachel@fullkitmarketing.com</a> directly.';
        }
        return;
      }

      if (status) { status.className = "form-status"; status.textContent = "Sending…"; }
      if (btn) btn.disabled = true;

      var data = Object.fromEntries(new FormData(form).entries());

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
        .then(function (r) {
          if (r.ok && r.j && r.j.success) {
            var done = document.createElement("div");
            done.className = "contact-done";
            done.setAttribute("role", "status");
            done.innerHTML = "<strong>Thanks — your message is on its way.</strong> We'll be in touch soon.";
            form.replaceWith(done);
          } else {
            throw new Error((r.j && r.j.message) || "Submit failed");
          }
        })
        .catch(function (err) {
          if (window.console && console.error) {
            console.error("Contact form submission failed:", (err && err.message) || err);
          }
          if (status) {
            status.className = "form-status err";
            status.innerHTML = "Something went wrong. Please email " +
              '<a href="mailto:rachel@fullkitmarketing.com">rachel@fullkitmarketing.com</a> directly.';
          }
        })
        .finally(function () { if (btn) btn.disabled = false; });
    });

    /* Cloudflare Turnstile — live site only, once a real site key is set below.
       The site key is domain-scoped, so the widget can't connect from localhost; skip it in dev. */
    var TURNSTILE_SITEKEY = "YOUR_TURNSTILE_SITEKEY"; // Cloudflare Turnstile site key (public)
    var host = location.hostname;
    var isLocal = host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" ||
      host === "::1" || host === "" || /\.local$/.test(host);
    if (!isLocal && TURNSTILE_SITEKEY.indexOf("YOUR_TURNSTILE") !== 0) {
      window.__cfTurnstileReady = function () {
        var box = document.getElementById("cf-turnstile-container");
        if (box && window.turnstile) window.turnstile.render(box, { sitekey: TURNSTILE_SITEKEY });
      };
      var ts = document.createElement("script");
      ts.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__cfTurnstileReady";
      ts.async = true; ts.defer = true;
      document.head.appendChild(ts);
    }
  }
})();
