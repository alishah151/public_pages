# public_pages

Public hub for static sites built from **private** repositories. Source stays private; only built HTML/CSS/JS is pushed here and served by **GitHub Pages**.

## Live URLs

| What | URL |
| --- | --- |
| Hub | https://alishah151.github.io/public_pages/ |
| Site example | https://alishah151.github.io/public_pages/`SITE_FOLDER`/ |
| Repo | https://github.com/alishah151/public_pages |

Replace `SITE_FOLDER` with the folder name your private repo deploys to (e.g. `static1`).

## How a private repo publishes here

### 1. One-time: create a token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate**.
2. Resource owner: your user (`alishah151`).
3. Repository access: **Only select repositories** → `public_pages`.
4. Permissions → Repository → **Contents**: **Read and write**.
5. Generate and copy the token.

In **each private repo**: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

- Name: `PUBLIC_PAGES_TOKEN`
- Value: the token

### 2. Set the bundler base path

GitHub project Pages are served under `/public_pages/`, so assets must use that prefix plus your site folder.

**Vite** (`vite.config.ts`):

```ts
export default defineConfig({
  base: "/public_pages/static1/",
});
```

Use your real folder name instead of `static1`. Rebuild after changing `base`.

### 3. Add a GitHub Action in the private repo

Create `.github/workflows/publish-public-pages.yml`:

```yaml
name: Publish to public_pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm

      - run: npm ci
      - run: npm run build

      # Change destination_dir to this app's unique folder name.
      - name: Deploy to public_pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          personal_token: ${{ secrets.PUBLIC_PAGES_TOKEN }}
          external_repository: alishah151/public_pages
          publish_dir: ./dist
          destination_dir: static1
          keep_files: true
          publish_branch: main
          commit_message: "deploy: update static1"
```

Adjust:

| Field | Meaning |
| --- | --- |
| `publish_dir` | Your build output (`./dist`, `./out`, `./build`, …) |
| `destination_dir` | Folder under this repo → live path `/public_pages/<folder>/` |
| `keep_files: true` | **Required** so publishing one site does not delete others |

### 4. After the Action succeeds

- Files appear under `https://github.com/alishah151/public_pages/tree/main/static1`
- Site is live at `https://alishah151.github.io/public_pages/static1/`

Optional: add a link on the hub [`index.html`](index.html).

## Rules

- Push **only** built static files — never private source or `.env`.
- One unique `destination_dir` per app.
- No API secrets in client JS. Button-click `fetch` is fine against public or user-authenticated APIs.
- Scope the PAT to `public_pages` only; rotate it if it leaks.

## Pages settings

This repo is configured for GitHub Pages from branch **`main`** / folder **`/` (root)**.
