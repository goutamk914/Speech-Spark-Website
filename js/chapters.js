/* Speech Spark — chapters map and directory */

(function () {
    "use strict";

    var ORG_IG = "speechsparksinitiative";
    var ORG_EMAIL = "speechsparksinitiative@gmail.com";

    /* Per-chapter ig/email left null where not provided; the panel then shows
       the main organization's handle marked "(NOT GIVEN)". Fill these in as
       chapters share their own accounts. */
    var CHAPTERS = [
        { name: "Ashburn",       city: "Ashburn",       state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 39.043, lng: -77.487, logo: "assets/logos/Ashburn.PNG", ig: null, email: null },
        { name: "Chantilly",     city: "Chantilly",     state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.894, lng: -77.431, logo: "assets/logos/Chantilly.PNG", ig: null, email: null },
        { name: "Haymarket",     city: "Haymarket",     state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.812, lng: -77.636, logo: "assets/logos/Haymarket.PNG", ig: null, email: null },
        { name: "Manassas",      city: "Manassas",      state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.751, lng: -77.475, logo: "assets/logos/Manassas.PNG", ig: null, email: null },
        { name: "McLean",        city: "McLean",        state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.934, lng: -77.178, logo: "assets/logos/Mclean.PNG", ig: null, email: null },
        { name: "South Riding",  city: "South Riding",  state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.920, lng: -77.513, logo: "assets/logos/SouthRiding.PNG", ig: null, email: null },
        { name: "Sterling",      city: "Sterling",      state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 39.006, lng: -77.429, logo: "assets/logos/Sterling.PNG", ig: null, email: null },
        { name: "Woodbridge",    city: "Woodbridge",    state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.658, lng: -77.250, logo: "assets/logos/Woodbridge.PNG", ig: null, email: null },
        { name: "Princeton",     city: "Princeton",     state: "NJ", stateName: "New Jersey",    country: "United States", region: "Northeast",         lat: 40.357, lng: -74.667, logo: "assets/logos/Princeton.PNG", ig: null, email: null },
        { name: "Brookfield",    city: "Brookfield",    state: "WI", stateName: "Wisconsin",     country: "United States", region: "Midwest",           lat: 43.061, lng: -88.107, logo: "assets/logos/Brookfield.PNG", ig: null, email: null },
        { name: "Orlando",       city: "Orlando",       state: "FL", stateName: "Florida",       country: "United States", region: "Southeast",         lat: 28.538, lng: -81.379, logo: "assets/logos/Orlando.PNG", ig: null, email: null },
        { name: "South Florida", city: "South Florida", state: "FL", stateName: "Florida",       country: "United States", region: "Southeast",         lat: 25.995, lng: -80.239, logo: "assets/logos/SouthFlorida.PNG", ig: null, email: null },
        { name: "Diamond Bar",   city: "Diamond Bar",   state: "CA", stateName: "California",    country: "United States", region: "West Coast",        lat: 34.029, lng: -117.810, logo: "assets/logos/DiamondBar.PNG", ig: null, email: null },
        { name: "Saratoga",      city: "Saratoga",      state: "CA", stateName: "California",    country: "United States", region: "West Coast",        lat: 37.264, lng: -122.023, logo: "assets/logos/Saratoga.PNG", ig: null, email: null },
        { name: "Seattle",       city: "Seattle",       state: "WA", stateName: "Washington",    country: "United States", region: "Pacific Northwest", lat: 47.606, lng: -122.332, logo: "assets/logos/Seattle.PNG", ig: null, email: null },
        { name: "Spokane",       city: "Spokane",       state: "WA", stateName: "Washington",    country: "United States", region: "Pacific Northwest", lat: 47.659, lng: -117.426, logo: "assets/logos/Spokane.PNG", ig: null, email: null },
        { name: "Chandigarh",    city: "Chandigarh",    state: "",   stateName: "Chandigarh",    country: "India",  region: "International", lat: 30.733, lng: 76.779, logo: "assets/logos/Chandigarh.PNG", ig: null, email: null },
        { name: "Lucknow",       city: "Lucknow",       state: "",   stateName: "Uttar Pradesh", country: "India",  region: "International", lat: 26.847, lng: 80.947, logo: "assets/logos/Lucknow.PNG", ig: null, email: null },
        { name: "Nepal",         city: "Kathmandu",     state: "",   stateName: "Bagmati",       country: "Nepal",  region: "International", lat: 27.717, lng: 85.324, logo: "assets/logos/Nepal.PNG", ig: null, email: null }
    ];

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
    var usChapters = CHAPTERS.filter(function (c) { return c.country === "United States"; });

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
                '<p class="cd-loc">' + locationLabel(ch) + (ch.country !== "United States" ? " · " + ch.country : "") + '</p></div>' +
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
        svg.setAttribute("aria-label", "Map of Speech Spark chapters in the United States. Scroll to zoom, drag to pan.");

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

        usChapters.forEach(function (ch) {
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
        apply();
    }

    function select(ch, doZoom) {
        mapPanel.querySelectorAll(".map-marker.selected").forEach(function (m) { m.classList.remove("selected"); });
        var m = mapPanel.querySelector('.map-marker[data-name="' + ch.name + '"]');
        if (m) m.classList.add("selected");
        renderDetail(ch);
        if (doZoom && m) zoomTo(+m.dataset.cx, +m.dataset.cy, 5);
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
            else { scale = 1; tx = 0; ty = 0; apply(); }
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
    var stateSelect = document.getElementById("chapter-state");
    var sortSelect = document.getElementById("chapter-sort");
    var countEl = document.getElementById("chapter-count");

    function groupKey(c) { return c.country === "United States" ? c.stateName : "International"; }

    function populateFilter() {
        if (!stateSelect) return;
        var seen = {}, groups = [];
        CHAPTERS.forEach(function (c) { var k = groupKey(c); if (!seen[k]) { seen[k] = true; groups.push(k); } });
        groups.sort(function (a, b) {
            if (a === "International") return 1;
            if (b === "International") return -1;
            return a.localeCompare(b);
        });
        groups.forEach(function (g) {
            var o = document.createElement("option"); o.value = g; o.textContent = g; stateSelect.appendChild(o);
        });
    }

    function render() {
        if (!directory) return;
        var term = (search && search.value || "").trim().toLowerCase();
        var filter = stateSelect && stateSelect.value || "";
        var sort = sortSelect && sortSelect.value || "az";

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
                    renderDetail(c);
                    if (c.country === "United States") select(c, true);
                    if (mapPanel && mapPanel.scrollIntoView) mapPanel.scrollIntoView({ behavior: "smooth", block: "center" });
                });
                directory.appendChild(card);
            });
        }
        if (countEl) countEl.textContent = list.length + " of " + CHAPTERS.length + " chapters";
    }

    buildMap();
    populateFilter();
    render();
    if (search) search.addEventListener("input", render);
    if (stateSelect) stateSelect.addEventListener("change", render);
    if (sortSelect) sortSelect.addEventListener("change", render);

})();
