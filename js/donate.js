/* Speech Spark — live donation stats from the Hack Club HCB API.
   Runs in the visitor's browser and reads the public, transparent
   finances for the speech-spark organization. */

(function () {
    "use strict";

    var API = "https://hcb.hackclub.com/api/v3/organizations/speech-spark";

    function usd(cents) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }).format((cents || 0) / 100);
    }

    function set(id, value) {
        var el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function status(text) {
        var el = document.getElementById("hcb-status");
        if (el) el.textContent = text;
    }

    fetch(API, { headers: { "Accept": "application/json" } })
        .then(function (r) {
            if (!r.ok) throw new Error("HCB " + r.status);
            return r.json();
        })
        .then(function (org) {
            var b = org.balances || {};
            set("stat-raised", usd(b.total_raised));
            set("stat-balance", usd(b.balance_cents));
            set("stat-team", (org.users ? org.users.length : 0).toString());
            var year = org.created_at ? new Date(org.created_at).getFullYear() : "—";
            set("stat-since", year.toString());
            status("Live from Hack Club HCB · updated just now");
        })
        .catch(function () {
            status("View our live finances on Hack Club HCB →");
        });

})();
