import { readdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skip = new Set([".git", ".github", "scripts", "node_modules"]);

const sites = readdirSync(root)
  .filter((name) => {
    if (skip.has(name) || name.startsWith(".")) return false;
    try {
      return statSync(join(root, name)).isDirectory();
    } catch {
      return false;
    }
  })
  .sort((a, b) => a.localeCompare(b));

const listHtml =
  sites.length === 0
    ? `        <li class="empty">No sites published yet.</li>`
    : sites
        .map(
          (name) =>
            `        <li><a href="./${name}/">${name}</a></li>`
        )
        .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Public Pages</title>
    <style>
      :root {
        --bg: #0f1419;
        --fg: #e7ecf1;
        --muted: #9aa7b5;
        --accent: #3d9cf0;
        --line: #243041;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Segoe UI", system-ui, sans-serif;
        color: var(--fg);
        background:
          radial-gradient(1200px 600px at 10% -10%, #1a2a3d 0%, transparent 55%),
          radial-gradient(900px 500px at 100% 0%, #152433 0%, transparent 50%),
          var(--bg);
      }
      main {
        max-width: 40rem;
        margin: 0 auto;
        padding: 4rem 1.5rem 3rem;
      }
      h1 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
        letter-spacing: -0.02em;
      }
      p {
        margin: 0 0 1.75rem;
        color: var(--muted);
        line-height: 1.5;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        border-top: 1px solid var(--line);
      }
      li {
        border-bottom: 1px solid var(--line);
      }
      a {
        display: block;
        padding: 0.9rem 0;
        color: var(--accent);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .empty {
        color: var(--muted);
        font-size: 0.95rem;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Public Pages</h1>
      <p>
        Static sites published from private repositories into this public hub.
        Each site lives in its own folder under this repo.
      </p>
      <ul>
${listHtml}
      </ul>
    </main>
  </body>
</html>
`;

writeFileSync(join(root, "index.html"), html);
console.log(
  sites.length === 0
    ? "Hub index: no sites yet"
    : `Hub index: ${sites.join(", ")}`
);
