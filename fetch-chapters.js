/**
 * fetch-chapters.js
 *
 * Pulls chapter data from the Apps Script Web App (see apps-script-setup.gs)
 * and writes it to data/chapters-data.json, in the exact shape chapters.js
 * expects.
 *
 * USAGE
 *   SHEET_WEBAPP_URL="https://script.google.com/macros/s/XXXXX/exec" node fetch-chapters.js
 *
 * Wire this into package.json, e.g.:
 *   "scripts": { "sync-chapters": "node fetch-chapters.js" }
 * Run it manually whenever chapter data changes, or hook it into a
 * pre-build step / scheduled GitHub Action — see notes at the bottom.
 */

const fs = require("fs");
const path = require("path");

const WEBAPP_URL = process.env.SHEET_WEBAPP_URL;
const OUT_PATH = path.join(__dirname, "data", "chapters-data.json");

const REQUIRED_FIELDS = ["name", "city", "country", "region", "lat", "lng", "logo"];
const HANDLE_RE = /^[A-Za-z0-9._]+$/;

async function main() {
  if (!WEBAPP_URL) {
    console.error(
      "Missing SHEET_WEBAPP_URL. Set it to your deployed Apps Script Web App URL."
    );
    process.exit(1);
  }

  console.log("Fetching chapters from Sheet...");
  const res = await fetch(WEBAPP_URL);
  if (!res.ok) {
    console.error(`Fetch failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const rows = await res.json();
  if (!Array.isArray(rows)) {
    console.error("Unexpected response shape — expected an array. Got:", rows);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];
  const seenNames = new Set();
  const seenHandles = new Map();

  const cleaned = rows.map((row, i) => {
    const rowLabel = `Row ${i + 2} (${row.name || "UNNAMED"})`;

    // required fields present
    REQUIRED_FIELDS.forEach((f) => {
      if (row[f] === undefined || row[f] === null || row[f] === "") {
        errors.push(`${rowLabel}: missing required field "${f}"`);
      }
    });

    // lat/lng are actually numbers
    const lat = Number(row.lat);
    const lng = Number(row.lng);
    if (Number.isNaN(lat)) errors.push(`${rowLabel}: lat is not a number ("${row.lat}")`);
    if (Number.isNaN(lng)) errors.push(`${rowLabel}: lng is not a number ("${row.lng}")`);

    // duplicate chapter name = duplicate map marker key = silent bug
    if (seenNames.has(row.name)) {
      errors.push(`${rowLabel}: duplicate chapter name "${row.name}"`);
    }
    seenNames.add(row.name);

    // IG handle format — should already be caught by Sheet validation,
    // but the Sheet only warns, it doesn't block. Re-check here so a
    // bad handle can never make it into a deploy.
    if (row.ig) {
      if (!HANDLE_RE.test(row.ig)) {
        errors.push(
          `${rowLabel}: Instagram handle "${row.ig}" contains @ / slashes / spaces — ` +
          `fix in the Sheet (should be handle only, e.g. "speechsparksashburn")`
        );
      }
      if (seenHandles.has(row.ig)) {
        warnings.push(
          `${rowLabel}: Instagram handle "${row.ig}" is also used by ` +
          `"${seenHandles.get(row.ig)}" — probably a copy-paste mistake`
        );
      }
      seenHandles.set(row.ig, row.name);
    }

    // basic email sanity check
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`${rowLabel}: email "${row.email}" doesn't look valid`);
    }

    return {
      name: row.name,
      city: row.city,
      state: row.state || "",
      stateName: row.stateName || "",
      country: row.country,
      region: row.region,
      lat,
      lng,
      logo: row.logo,
      ig: row.ig || null,
      email: row.email || null,
    };
  });

  if (warnings.length) {
    console.warn("\nWarnings (not blocking, but check these):");
    warnings.forEach((w) => console.warn("  - " + w));
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s) found — refusing to write output:`);
    errors.forEach((e) => console.error("  - " + e));
    console.error(
      "\nFix these in the Sheet and re-run. No file was written, so your " +
      "last good chapters-data.json is untouched."
    );
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(cleaned, null, 2) + "\n");
  console.log(`\nWrote ${cleaned.length} chapters to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("Unexpected failure:", err);
  process.exit(1);
});

/**
 * NEXT STEP IN YOUR CODEBASE (one-time refactor):
 * In chapters.js, replace the hardcoded `var CHAPTERS = [...]` block with:
 *
 *   import chaptersData from "./data/chapters-data.json";
 *   var CHAPTERS = chaptersData;
 *
 * That's the only code change needed — every field name here (name, city,
 * state, stateName, country, region, lat, lng, logo, ig, email) matches
 * what chapters.js already expects, so nothing else in the file changes.
 *
 * AUTOMATING THE SYNC (optional, do this once the manual flow works):
 * Add a GitHub Action on a schedule (e.g. daily) that runs this script and
 * opens a PR if chapters-data.json changed. That gets you "chapter leads
 * edit the Sheet, a PR shows up for review" without anyone touching code —
 * but you still approve the PR before it goes live, which is the right
 * amount of caution for something that writes to your live site.
 */