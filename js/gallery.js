/* Speech Spark — gallery lightbox */

(function () {
    "use strict";

    var grid = document.getElementById("gallery-grid");
    if (!grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll(".gallery-item"));
    if (!items.length) return;

    var current = 0;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
        '<button class="lb-close" aria-label="Close">&times;</button>' +
        '<button class="lb-prev" aria-label="Previous photo">&#8249;</button>' +
        '<button class="lb-next" aria-label="Next photo">&#8250;</button>' +
        '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);

    var lbImg = box.querySelector("img");
    var lbCap = box.querySelector("figcaption");
    var lastFocus = null;

    function show(index) {
        current = (index + items.length) % items.length;
        var item = items[current];
        var full = item.getAttribute("data-full") || item.querySelector("img").src;
        var caption = item.querySelector("figcaption");
        lbImg.src = full;
        lbImg.alt = item.querySelector("img").alt;
        lbCap.textContent = caption ? caption.textContent : "";
    }

    function open(index) {
        lastFocus = document.activeElement;
        show(index);
        box.classList.add("open");
        document.body.style.overflow = "hidden";
        box.querySelector(".lb-close").focus();
    }

    function close() {
        box.classList.remove("open");
        document.body.style.overflow = "";
        if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (item, i) {
        item.setAttribute("tabindex", "0");
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", "View photo");
        item.addEventListener("click", function () { open(i); });
        item.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(i);
            }
        });
    });

    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) {
        if (e.target === box) close();
    });

    document.addEventListener("keydown", function (e) {
        if (!box.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });

})();
