/* Speech Spark — chapters map and directory */

(function () {
    "use strict";

    var CHAPTERS = [
        { name: "Ashburn",       city: "Ashburn",       state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 39.043, lng: -77.487, logo: "assets/logos/Ashburn.PNG" },
        { name: "Chantilly",     city: "Chantilly",     state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.894, lng: -77.431, logo: "assets/logos/Chantilly.PNG" },
        { name: "Haymarket",     city: "Haymarket",     state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.812, lng: -77.636, logo: "assets/logos/Haymarket.PNG" },
        { name: "Manassas",      city: "Manassas",      state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.751, lng: -77.475, logo: "assets/logos/Manassas.PNG" },
        { name: "McLean",        city: "McLean",        state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.934, lng: -77.178, logo: "assets/logos/Mclean.PNG" },
        { name: "South Riding",  city: "South Riding",  state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.920, lng: -77.513, logo: "assets/logos/SouthRiding.PNG" },
        { name: "Sterling",      city: "Sterling",      state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 39.006, lng: -77.429, logo: "assets/logos/Sterling.PNG" },
        { name: "Woodbridge",    city: "Woodbridge",    state: "VA", stateName: "Virginia",      country: "United States", region: "Northern Virginia", lat: 38.658, lng: -77.250, logo: "assets/logos/Woodbridge.PNG" },
        { name: "Princeton",     city: "Princeton",     state: "NJ", stateName: "New Jersey",    country: "United States", region: "Northeast",         lat: 40.357, lng: -74.667, logo: "assets/logos/Princeton.PNG" },
        { name: "Brookfield",    city: "Brookfield",    state: "WI", stateName: "Wisconsin",     country: "United States", region: "Midwest",           lat: 43.061, lng: -88.107, logo: "assets/logos/Brookfield.PNG" },
        { name: "Orlando",       city: "Orlando",       state: "FL", stateName: "Florida",       country: "United States", region: "Southeast",         lat: 28.538, lng: -81.379, logo: "assets/logos/Orlando.PNG" },
        { name: "South Florida", city: "South Florida", state: "FL", stateName: "Florida",       country: "United States", region: "Southeast",         lat: 25.995, lng: -80.239, logo: "assets/logos/SouthFlorida.PNG" },
        { name: "Diamond Bar",   city: "Diamond Bar",   state: "CA", stateName: "California",    country: "United States", region: "West Coast",        lat: 34.029, lng: -117.810, logo: "assets/logos/DiamondBar.PNG" },
        { name: "Saratoga",      city: "Saratoga",      state: "CA", stateName: "California",    country: "United States", region: "West Coast",        lat: 37.264, lng: -122.023, logo: "assets/logos/Saratoga.PNG" },
        { name: "Seattle",       city: "Seattle",       state: "WA", stateName: "Washington",    country: "United States", region: "Pacific Northwest", lat: 47.606, lng: -122.332, logo: "assets/logos/Seattle.PNG" },
        { name: "Spokane",       city: "Spokane",       state: "WA", stateName: "Washington",    country: "United States", region: "Pacific Northwest", lat: 47.659, lng: -117.426, logo: "assets/logos/Spokane.PNG" },
        { name: "Chandigarh",    city: "Chandigarh",    state: "",   stateName: "Chandigarh",    country: "India",  region: "International", lat: 30.733, lng: 76.779, logo: "assets/logos/Chandigarh.PNG" },
        { name: "Lucknow",       city: "Lucknow",       state: "",   stateName: "Uttar Pradesh", country: "India",  region: "International", lat: 26.847, lng: 80.947, logo: "assets/logos/Lucknow.PNG" },
        { name: "Nepal",         city: "Kathmandu",     state: "",   stateName: "Bagmati",       country: "Nepal",  region: "International", lat: 27.717, lng: 85.324, logo: "assets/logos/Nepal.PNG" }
    ];

    /* Accurate US state geometry (Albers USA projection) is prebuilt in
       js/us-map-data.js so the map stays self-contained with no map library. */
    var MAP = window.SPEECH_SPARK_US_MAP || { w: 960, h: 600, states: [], markers: {} };

    function describe(ch) {
        return "The " + ch.name + " chapter brings Speech Spark's core program to " +
            ch.city + " — beginner-friendly camps and workshops in debate, speech, Model UN, " +
            "and communication, led by local student volunteers.";
    }

    function locationLabel(ch) {
        if (ch.country === "United States") return ch.city + ", " + ch.state;
        return ch.city + ", " + ch.country;
    }

    /* ---------------- MAP ---------------- */

    var mapPanel = document.getElementById("map-panel");
    var detail = document.getElementById("chapter-detail");
    var usChapters = CHAPTERS.filter(function (c) { return c.country === "United States"; });

    function renderDetail(ch) {
        if (!detail) return;
        detail.innerHTML =
            '<div class="cd-logo"><img src="' + ch.logo + '" alt="' + ch.name + ' chapter logo"></div>' +
            '<h3>' + ch.name + '</h3>' +
            '<p class="cd-loc">' + locationLabel(ch) + (ch.country !== "United States" ? " · " + ch.country : "") + '</p>' +
            '<p class="cd-desc">' + describe(ch) + '</p>' +
            '<div class="cd-contact">Chapter inquiries are coordinated through Speech Spark.<br>' +
            '<a href="mailto:speechsparksinitiative@gmail.com">speechsparksinitiative@gmail.com</a></div>';
    }

    function buildMap() {
        if (!mapPanel) return;

        var svgNS = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 " + MAP.w + " " + MAP.h);
        svg.setAttribute("class", "us-map");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "Map of Speech Spark chapters in the United States");

        var states = document.createElementNS(svgNS, "g");
        states.setAttribute("class", "us-states");
        MAP.states.forEach(function (d) {
            var p = document.createElementNS(svgNS, "path");
            p.setAttribute("d", d);
            states.appendChild(p);
        });
        svg.appendChild(states);

        /* place pins from prebuilt coordinates, then spread the
           overlapping Northern Virginia cluster so each stays clickable */
        usChapters.forEach(function (ch) {
            var xy = MAP.markers[ch.name] || [0, 0];
            ch._x = xy[0];
            ch._y = xy[1];
        });

        var clusters = [];
        usChapters.forEach(function (ch) {
            var found = null;
            for (var i = 0; i < clusters.length; i++) {
                var c = clusters[i];
                if (Math.hypot(ch._x - c.x, ch._y - c.y) < 22) { found = c; break; }
            }
            if (found) { found.members.push(ch); }
            else { clusters.push({ x: ch._x, y: ch._y, members: [ch] }); }
        });

        clusters.forEach(function (c) {
            if (c.members.length === 1) return;
            var radius = 14 + c.members.length * 2.4;
            c.members.forEach(function (ch, i) {
                var angle = (i / c.members.length) * Math.PI * 2 - Math.PI / 2;
                ch._x = c.x + Math.cos(angle) * radius;
                ch._y = c.y + Math.sin(angle) * radius;
            });
        });

        usChapters.forEach(function (ch) {
            var g = document.createElementNS(svgNS, "g");
            g.setAttribute("class", "map-marker");
            g.setAttribute("tabindex", "0");
            g.setAttribute("role", "button");
            g.setAttribute("aria-label", ch.name + " chapter, " + locationLabel(ch));
            g.dataset.name = ch.name;

            var pulse = document.createElementNS(svgNS, "circle");
            pulse.setAttribute("class", "pulse");
            pulse.setAttribute("cx", ch._x);
            pulse.setAttribute("cy", ch._y);
            pulse.setAttribute("r", 6);

            var pin = document.createElementNS(svgNS, "circle");
            pin.setAttribute("class", "pin");
            pin.setAttribute("cx", ch._x);
            pin.setAttribute("cy", ch._y);
            pin.setAttribute("r", 6);

            var title = document.createElementNS(svgNS, "title");
            title.textContent = ch.name + " — " + locationLabel(ch);

            g.appendChild(pulse);
            g.appendChild(pin);
            g.appendChild(title);

            function select() {
                svg.querySelectorAll(".map-marker.selected").forEach(function (m) {
                    m.classList.remove("selected");
                });
                g.classList.add("selected");
                renderDetail(ch);
            }

            g.addEventListener("click", select);
            g.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
            });

            svg.appendChild(g);
        });

        mapPanel.insertBefore(svg, mapPanel.firstChild);
    }

    function selectByName(name) {
        if (!mapPanel) return;
        var marker = mapPanel.querySelector('.map-marker[data-name="' + name + '"]');
        var ch = CHAPTERS.filter(function (c) { return c.name === name; })[0];
        if (ch) renderDetail(ch);
        if (marker) {
            mapPanel.querySelectorAll(".map-marker.selected").forEach(function (m) {
                m.classList.remove("selected");
            });
            marker.classList.add("selected");
        }
        if (mapPanel.scrollIntoView) {
            mapPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    /* ---------------- DIRECTORY ---------------- */

    var directory = document.getElementById("chapter-directory");
    var search = document.getElementById("chapter-search");
    var stateSelect = document.getElementById("chapter-state");
    var sortSelect = document.getElementById("chapter-sort");
    var countEl = document.getElementById("chapter-count");

    function populateFilter() {
        if (!stateSelect) return;
        var seen = {};
        var groups = [];
        CHAPTERS.forEach(function (c) {
            var key = c.country === "United States" ? c.stateName : "International";
            if (!seen[key]) { seen[key] = true; groups.push(key); }
        });
        groups.sort(function (a, b) {
            if (a === "International") return 1;
            if (b === "International") return -1;
            return a.localeCompare(b);
        });
        groups.forEach(function (g) {
            var opt = document.createElement("option");
            opt.value = g;
            opt.textContent = g;
            stateSelect.appendChild(opt);
        });
    }

    function render() {
        if (!directory) return;

        var term = (search && search.value || "").trim().toLowerCase();
        var filter = stateSelect && stateSelect.value || "";
        var sort = sortSelect && sortSelect.value || "az";

        var list = CHAPTERS.filter(function (c) {
            var groupKey = c.country === "United States" ? c.stateName : "International";
            var matchesFilter = !filter || groupKey === filter;
            var haystack = (c.name + " " + c.city + " " + c.state + " " + c.stateName + " " + c.country).toLowerCase();
            var matchesTerm = !term || haystack.indexOf(term) !== -1;
            return matchesFilter && matchesTerm;
        });

        list.sort(function (a, b) {
            if (sort === "za") return b.name.localeCompare(a.name);
            if (sort === "state") {
                var sa = a.state || a.country, sb = b.state || b.country;
                return sa.localeCompare(sb) || a.name.localeCompare(b.name);
            }
            return a.name.localeCompare(b.name);
        });

        directory.innerHTML = "";

        if (!list.length) {
            directory.innerHTML = '<p class="directory-empty">No chapters match your search yet. Try a different city or state.</p>';
        } else {
            list.forEach(function (c) {
                var card = document.createElement("button");
                card.className = "directory-card";
                card.type = "button";
                card.setAttribute("aria-label", "View " + c.name + " chapter");
                card.innerHTML =
                    '<div class="dc-logo"><img src="' + c.logo + '" alt="' + c.name + ' chapter logo" loading="lazy"></div>' +
                    '<h4>' + c.name + '</h4>' +
                    '<span class="dc-loc">' + locationLabel(c) + '</span>';
                card.addEventListener("click", function () {
                    if (c.country === "United States") {
                        selectByName(c.name);
                    } else {
                        renderDetail(c);
                        if (mapPanel && mapPanel.scrollIntoView) {
                            mapPanel.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }
                });
                directory.appendChild(card);
            });
        }

        if (countEl) {
            countEl.textContent = list.length + " of " + CHAPTERS.length + " chapters";
        }
    }

    buildMap();
    populateFilter();
    render();

    if (search) search.addEventListener("input", render);
    if (stateSelect) stateSelect.addEventListener("change", render);
    if (sortSelect) sortSelect.addEventListener("change", render);

})();
