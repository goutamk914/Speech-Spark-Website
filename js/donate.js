/* Speech Spark — live donation total + goal progress from the Hack Club HCB API.
   Runs in the visitor's browser and reads the public, transparent finances
   for the speech-spark organization. */

(function () {
    "use strict";

    var API = "https://hcb.hackclub.com/api/v3/organizations/speech-spark";

    /* Fundraising goal, in cents. Update this as goals change. */
    var GOAL_CENTS = 200000; /* $2,000 */

    function usd(cents) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }).format((cents || 0) / 100);
    }

    function byId(id) { return document.getElementById(id); }

    function status(text) {
        var el = byId("hcb-status");
        if (el) el.textContent = text;
    }

    function paint(raisedCents) {
        var raised = byId("stat-raised");
        if (raised) raised.textContent = usd(raisedCents);

        var pct = GOAL_CENTS > 0 ? (raisedCents / GOAL_CENTS) * 100 : 0;
        pct = Math.max(0, Math.min(100, pct));

        var fill = byId("goal-fill");
        if (fill) fill.style.width = pct.toFixed(1) + "%";

        var label = byId("goal-text");
        if (label) label.textContent = usd(raisedCents) + " raised of " + usd(GOAL_CENTS) + " goal";
    }

    fetch(API, { headers: { "Accept": "application/json" } })
        .then(function (r) {
            if (!r.ok) throw new Error("HCB " + r.status);
            return r.json();
        })
        .then(function (org) {
            var b = org.balances || {};
            paint(b.total_raised || 0);
            status("Live from Hack Club HCB · updated just now");
        })
        .catch(function () {
            var label = byId("goal-text");
            if (label) label.textContent = "Goal: " + usd(GOAL_CENTS);
            status("View our live finances on Hack Club HCB →");
        });

    /* ---- recent donations ---- */

    function initials(name) {
        var parts = (name || "").trim().split(/\s+/).filter(Boolean);
        if (!parts.length) return "♥";
        return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
    }

    function timeAgo(dateStr) {
        var t = Date.parse(dateStr);
        if (isNaN(t)) return "";
        var days = Math.floor((Date.now() - t) / 86400000);
        if (days <= 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 30) return days + " days ago";
        if (days < 60) return "Last month";
        return Math.floor(days / 30) + " months ago";
    }

    function renderDonations(list) {
        var el = byId("recent-donations");
        if (!el) return;

        var items = (list || []).filter(function (d) {
            return !d.status || d.status === "succeeded" || d.status === "deposited";
        });

        if (!items.length) {
            el.innerHTML = '<li class="recent-empty">No donations yet — ' +
                '<a href="https://hcb.hackclub.com/donations/start/speech-spark" target="_blank" rel="noopener">be the first to support Speech Spark</a>.</li>';
            return;
        }

        el.innerHTML = "";
        items.slice(0, 6).forEach(function (d) {
            var amount = (typeof d.amount_cents === "number") ? d.amount_cents : (d.amount || 0);
            var name = d.name || d.donor_name || "Anonymous";
            var when = timeAgo(d.created_at || d.donated_at || d.date);

            var li = document.createElement("li");
            li.className = "recent-item";
            li.innerHTML =
                '<span class="avatar" aria-hidden="true">' + initials(d.name || d.donor_name) + '</span>' +
                '<div><div class="who">' + name + '</div>' +
                (when ? '<div class="when">' + when + '</div>' : '') + '</div>' +
                '<div class="amount">' + usd(amount) + '</div>';
            el.appendChild(li);
        });
    }

    fetch(API + "/donations", { headers: { "Accept": "application/json" } })
        .then(function (r) {
            if (!r.ok) throw new Error("HCB donations " + r.status);
            return r.json();
        })
        .then(renderDonations)
        .catch(function () {
            var el = byId("recent-donations");
            if (el) {
                el.innerHTML = '<li class="recent-empty">Recent donations are available on our ' +
                    '<a href="https://hcb.hackclub.com/speech-spark" target="_blank" rel="noopener">HCB page</a>.</li>';
            }
        });

})();
