/* Speech Spark — site behaviour
   Navigation, scroll reveals, FAQ, counters. */

(function () {
    "use strict";

    var navbar = document.querySelector(".navbar");
    var toggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");

    /* --- shrink navbar on scroll --- */
    function onScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* --- mobile menu --- */
    if (toggle && navLinks) {
        function closeMenu() {
            toggle.classList.remove("open");
            navLinks.classList.remove("open");
            document.body.classList.remove("menu-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }

        toggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("open");
            toggle.classList.toggle("open", open);
            document.body.classList.toggle("menu-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeMenu();
        });
    }

    /* --- highlight the current page in the nav --- */
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
        var target = link.getAttribute("href");
        if (target === here || (here === "index.html" && target === "index.html")) {
            link.classList.add("active");
        }
    });

    /* --- reveal on scroll --- */
    var revealItems = document.querySelectorAll(
        ".reveal, .slide-left, .slide-right, .image-reveal, .stagger"
    );

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

        revealItems.forEach(function (item) { observer.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add("active"); });
    }

    /* --- FAQ accordion --- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
        var q = item.querySelector(".faq-question");
        var a = item.querySelector(".faq-answer");
        if (!q || !a) return;

        q.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");

            item.parentElement.querySelectorAll(".faq-item.open").forEach(function (other) {
                if (other !== item) {
                    other.classList.remove("open");
                    other.querySelector(".faq-answer").style.maxHeight = null;
                    other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
                }
            });

            if (isOpen) {
                item.classList.remove("open");
                a.style.maxHeight = null;
                q.setAttribute("aria-expanded", "false");
            } else {
                item.classList.add("open");
                a.style.maxHeight = a.scrollHeight + "px";
                q.setAttribute("aria-expanded", "true");
            }
        });
    });

    /* --- animated counters --- */
    var counters = document.querySelectorAll("[data-count]");

    function runCounter(el) {
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var start = performance.now();
        var duration = 1600;

        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (counters.length) {
        if ("IntersectionObserver" in window) {
            var countObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        countObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });
            counters.forEach(function (c) { countObserver.observe(c); });
        } else {
            counters.forEach(runCounter);
        }
    }

    /* --- footer year --- */
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

})();
