/* Speech Spark — chapters map and directory */

import chaptersData from "./data/chapters-data.json";
var CHAPTERS = chaptersData;

(function () {
    "use strict";

    var ORG_IG = "speechsparksinitiative";
    var ORG_EMAIL = "speechsparksinitiative@gmail.com";

    /* Per-chapter ig/email left null where not provided; the panel then shows
       the main organization's handle marked "(NOT GIVEN)". Fill these in as
       chapters share their own accounts. */
    var MAP = window.SPEECH_SPARK_US_MAP || { w: 960, h: 600, states: [], markers: {} };
    var SVGNS = "http://www.w3.org/2000/svg";

    function locationLabel(ch) {
        return ch.country === "United States" ? ch.city + ", " + ch.state : ch.city + ", " + ch.country;
    }

    function describe(ch) {
        var where = ch.country === "United States" ? ch.region : ch.country;
        return "Part of the " + ch.region + " network, the " + ch.name + " chapter runs Speech Spark's " +
            "core program locally — beginner-friendly camps and workshops in debate, speech, Model UN, " +
            "and communication, led by student instructors in and around " + ch.city + ".";
    }

    var detail = document.getElementById("chapter-detail");
    var mapPanel = document.getElementById("map-panel");
    var mapChapters = CHAPTERS.filter(function (c) { return MAP.markers && MAP.markers[c.name]; });

    function contactBlock(ch) {
        var igHandle = ch.ig || ORG_IG;
        var email = ch.email || ORG_EMAIL;
        var igTag = ch.ig ? "" : " <span class=\"cd-flag\">(NOT GIVEN)</span>";
        var emTag = ch.email ? "" : " <span class=\"cd-flag\">(NOT GIVEN)</span>";
        return '<div class="cd-contact">' +
            '<div class="cd-row"><span>Instagram</span><a href="https://www.instagram.com/' + igHandle + '/" target="_blank" rel="noopener">@' + igHandle + '</a>' + igTag + '</div>' +
            '<div class="cd-row"><span>Email</span><a href="mailto:' + email + '">' + email + '</a>' + emTag + '</div>' +
            '</div>';
    }

    function renderDetail(ch) {
        if (!detail) return;
        detail.classList.add("filled");
        detail.innerHTML =
            '<div class="cd-head">' +
                '<img class="cd-logo" src="' + ch.logo + '" alt="' + ch.name + ' chapter logo">' +
                '<div><h3>' + ch.name + '</h3>' +
                '<p class="cd-loc">' + locationLabel(ch) + '</p></div>' +
            '</div>' +
            '<p class="cd-desc">' + describe(ch) + '</p>' +
            contactBlock(ch);
    }

    /* ---------------- MAP with zoom + pan ---------------- */

    var zoomLayer, svg;
    var scale = 1, tx = 0, ty = 0;
    var MIN = 1, MAX = 9, BASE_R = 6;

    function clampT() {
        var minX = (1 - scale) * MAP.w, minY = (1 - scale) * MAP.h;
        if (tx > 0) tx = 0; if (tx < minX) tx = minX;
        if (ty > 0) ty = 0; if (ty < minY) ty = minY;
    }

    function apply() {
        clampT();
        zoomLayer.setAttribute("transform", "translate(" + tx.toFixed(2) + " " + ty.toFixed(2) + ") scale(" + scale.toFixed(3) + ")");
        var r = (BASE_R / scale).toFixed(2);
        zoomLayer.querySelectorAll(".pin, .pulse").forEach(function (c) { c.setAttribute("r", r); });
    }

    function pointerViewBox(evt) {
        var p = svg.createSVGPoint();
        p.x = evt.clientX; p.y = evt.clientY;
        return p.matrixTransform(svg.getScreenCTM().inverse());
    }

    function zoomAt(px, py, k) {
        k = Math.max(MIN, Math.min(MAX, k));
        tx = px - (k / scale) * (px - tx);
        ty = py - (k / scale) * (py - ty);
        scale = k;
        apply();
    }

    function zoomTo(cx, cy, k) {
        scale = Math.max(MIN, Math.min(MAX, k));
        tx = MAP.w / 2 - scale * cx;
        ty = MAP.h / 2 - scale * cy;
        apply();
    }

    function buildMap() {
        if (!mapPanel) return;

        svg = document.createElementNS(SVGNS, "svg");
        svg.setAttribute("viewBox", "0 0 " + MAP.w + " " + MAP.h);
        svg.setAttribute("class", "us-map");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "World map of Speech Spark chapters across the United States and internationally. Scroll to zoom, drag to pan.");

        zoomLayer = document.createElementNS(SVGNS, "g");

        var states = document.createElementNS(SVGNS, "g");
        states.setAttribute("class", "us-states");
        MAP.states.forEach(function (d) {
            var p = document.createElementNS(SVGNS, "path");
            p.setAttribute("d", d);
            p.setAttribute("vector-effect", "non-scaling-stroke");
            states.appendChild(p);
        });
        zoomLayer.appendChild(states);

        if (MAP.subdivisions && MAP.subdivisions.length) {
            var subs = document.createElementNS(SVGNS, "g");
            subs.setAttribute("class", "us-subs");
            MAP.subdivisions.forEach(function (d) {
                var p = document.createElementNS(SVGNS, "path");
                p.setAttribute("d", d);
                p.setAttribute("vector-effect", "non-scaling-stroke");
                subs.appendChild(p);
            });
            zoomLayer.appendChild(subs);
        }

        mapChapters.forEach(function (ch) {
            var xy = MAP.markers[ch.name] || [0, 0];
            var g = document.createElementNS(SVGNS, "g");
            g.setAttribute("class", "map-marker");
            g.setAttribute("tabindex", "0");
            g.setAttribute("role", "button");
            g.setAttribute("aria-label", ch.name + " chapter, " + locationLabel(ch));
            g.dataset.name = ch.name;
            g.dataset.cx = xy[0];
            g.dataset.cy = xy[1];

            var pulse = document.createElementNS(SVGNS, "circle");
            pulse.setAttribute("class", "pulse");
            pulse.setAttribute("cx", xy[0]); pulse.setAttribute("cy", xy[1]); pulse.setAttribute("r", BASE_R);

            var pin = document.createElementNS(SVGNS, "circle");
            pin.setAttribute("class", "pin");
            pin.setAttribute("cx", xy[0]); pin.setAttribute("cy", xy[1]); pin.setAttribute("r", BASE_R);
            pin.setAttribute("vector-effect", "non-scaling-stroke");

            var title = document.createElementNS(SVGNS, "title");
            title.textContent = ch.name + " — " + locationLabel(ch);

            g.appendChild(pulse); g.appendChild(pin); g.appendChild(title);

            g.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(ch, true); }
            });

            zoomLayer.appendChild(g);
        });

        svg.appendChild(zoomLayer);
        mapPanel.insertBefore(svg, mapPanel.firstChild);
        addControls();
        bindGestures();
        fitMarkers();
    }

    /* frame all chapter markers as the default view */
    function fitMarkers() {
        var xs = [], ys = [];
        mapChapters.forEach(function (ch) {
            var xy = MAP.markers[ch.name];
            if (xy) { xs.push(xy[0]); ys.push(xy[1]); }
        });
        if (!xs.length) { scale = 1; tx = 0; ty = 0; apply(); return; }
        var pad = 70;
        var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
        var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
        var k = Math.min(MAP.w / (maxX - minX + pad * 2), MAP.h / (maxY - minY + pad * 2));
        k = Math.max(1, Math.min(2.6, k));
        zoomTo((minX + maxX) / 2, (minY + maxY) / 2, k);
    }

    function select(ch, doZoom) {
        mapPanel.querySelectorAll(".map-marker.selected").forEach(function (m) { m.classList.remove("selected"); });
        var m = mapPanel.querySelector('.map-marker[data-name="' + ch.name + '"]');
        if (m) m.classList.add("selected");
        renderDetail(ch);
        if (doZoom && m) zoomTo(+m.dataset.cx, +m.dataset.cy, 7);
    }

    function addControls() {
        var ctr = document.createElement("div");
        ctr.className = "map-controls";
        ctr.innerHTML =
            '<button type="button" aria-label="Zoom in" data-act="in">+</button>' +
            '<button type="button" aria-label="Zoom out" data-act="out">&minus;</button>' +
            '<button type="button" aria-label="Reset map" data-act="reset">&#8634;</button>';
        ctr.addEventListener("click", function (e) {
            var b = e.target.closest("button"); if (!b) return;
            var act = b.dataset.act;
            if (act === "in") zoomAt(MAP.w / 2, MAP.h / 2, scale * 1.6);
            else if (act === "out") zoomAt(MAP.w / 2, MAP.h / 2, scale / 1.6);
            else { fitMarkers(); }
        });
        mapPanel.appendChild(ctr);
    }

    function markerFrom(target) {
        return target && target.closest ? target.closest(".map-marker") : null;
    }

    function chapterByName(name) {
        for (var i = 0; i < CHAPTERS.length; i++) {
            if (CHAPTERS[i].name === name) return CHAPTERS[i];
        }
        return null;
    }

    function bindGestures() {
        svg.addEventListener("wheel", function (e) {
            e.preventDefault();
            var p = pointerViewBox(e);
            var factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
            zoomAt(p.x, p.y, scale * factor);
        }, { passive: false });

        var down = false, panning = false, pid = null;
        var startX = 0, startY = 0, lastX = 0, lastY = 0;

        svg.addEventListener("pointerdown", function (e) {
            down = true;
            panning = false;
            pid = e.pointerId;
            startX = lastX = e.clientX;
            startY = lastY = e.clientY;
        });

        svg.addEventListener("pointermove", function (e) {
            if (!down) return;
            /* only start panning (and capture the pointer) once the pointer
               has actually moved — otherwise a tap is stolen from the pins */
            if (!panning && Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
                panning = true;
                svg.classList.add("grabbing");
                try { svg.setPointerCapture(pid); } catch (err) {}
            }
            if (panning) {
                var rect = svg.getBoundingClientRect();
                tx += (e.clientX - lastX) * (MAP.w / rect.width);
                ty += (e.clientY - lastY) * (MAP.h / rect.height);
                lastX = e.clientX;
                lastY = e.clientY;
                apply();
            }
        });

        function finish(e) {
            if (down && !panning) {
                var marker = markerFrom(e.target);
                if (marker) {
                    var ch = chapterByName(marker.dataset.name);
                    if (ch) select(ch, true);
                }
            }
            down = false;
            panning = false;
            svg.classList.remove("grabbing");
            try { if (pid !== null && svg.hasPointerCapture && svg.hasPointerCapture(pid)) svg.releasePointerCapture(pid); } catch (err) {}
            pid = null;
        }
        svg.addEventListener("pointerup", finish);
        svg.addEventListener("pointercancel", finish);
    }

    /* ---------------- DIRECTORY ---------------- */

    var directory = document.getElementById("chapter-directory");
    var search = document.getElementById("chapter-search");
    var filterWrap = document.getElementById("chapter-filter");
    var sortGroup = document.getElementById("chapter-sort");
    var countEl = document.getElementById("chapter-count");

    var currentFilter = "";
    var currentSort = "az";

    function groupKey(c) { return c.country === "United States" ? "USA" : "International"; }

    function populateFilter() {
        if (!filterWrap) return;
        var seen = {}, groups = [];
        CHAPTERS.forEach(function (c) { var k = groupKey(c); if (!seen[k]) { seen[k] = true; groups.push(k); } });
        groups.sort(function (a, b) {
            if (a === "International") return 1;
            if (b === "International") return -1;
            return a.localeCompare(b);
        });
        groups.unshift("");

        groups.forEach(function (g) {
            var b = document.createElement("button");
            b.type = "button";
            b.textContent = g === "" ? "All chapters" : g;
            b.dataset.filter = g;
            if (g === currentFilter) b.classList.add("active");
            b.addEventListener("click", function () {
                currentFilter = g;
                filterWrap.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
                b.classList.add("active");
                render();
            });
            filterWrap.appendChild(b);
        });
    }

    function bindSort() {
        if (!sortGroup) return;
        sortGroup.addEventListener("click", function (e) {
            var b = e.target.closest("button");
            if (!b) return;
            currentSort = b.dataset.sort;
            sortGroup.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
            b.classList.add("active");
            render();
        });
    }

    function render() {
        if (!directory) return;
        var term = (search && search.value || "").trim().toLowerCase();
        var filter = currentFilter;
        var sort = currentSort;

        var list = CHAPTERS.filter(function (c) {
            var okFilter = !filter || groupKey(c) === filter;
            var hay = (c.name + " " + c.city + " " + c.state + " " + c.stateName + " " + c.country).toLowerCase();
            return okFilter && (!term || hay.indexOf(term) !== -1);
        });
        list.sort(function (a, b) {
            if (sort === "za") return b.name.localeCompare(a.name);
            if (sort === "state") { var sa = a.state || a.country, sb = b.state || b.country; return sa.localeCompare(sb) || a.name.localeCompare(b.name); }
            return a.name.localeCompare(b.name);
        });

        directory.innerHTML = "";
        if (!list.length) {
            directory.innerHTML = '<p class="directory-empty">No chapters match your search yet. Try a different city or state.</p>';
        } else {
            list.forEach(function (c) {
                var card = document.createElement("button");
                card.className = "directory-card"; card.type = "button";
                card.setAttribute("aria-label", "View " + c.name + " chapter");
                card.innerHTML =
                    '<img class="dc-logo" src="' + c.logo + '" alt="' + c.name + ' chapter logo" loading="lazy">' +
                    '<div><h4>' + c.name + '</h4><span class="dc-loc">' + locationLabel(c) + '</span></div>';
                card.addEventListener("click", function () {
                    if (MAP.markers && MAP.markers[c.name]) {
                        select(c, true);
                    } else {
                        renderDetail(c);
                    }
                    if (mapPanel && mapPanel.scrollIntoView) mapPanel.scrollIntoView({ behavior: "smooth", block: "center" });
                });
                directory.appendChild(card);
            });
        }
        if (countEl) countEl.textContent = list.length + " of " + CHAPTERS.length + " chapters";
    }

    buildMap();
    populateFilter();
    bindSort();
    render();
    if (search) search.addEventListener("input", render);

})();
