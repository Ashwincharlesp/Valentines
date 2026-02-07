# Valentines

Valentines playful — memory card game + proposal.

**Live app:** [https://pcharles.github.io/Valentines/](https://pcharles.github.io/Valentines/)

---

## Repo structure

- **valentines-app/** — the Next.js app (game + proposal). This is what gets built and deployed.
- **valentines-main-sample/** — original sample (reference only).

---

## What to do (get the app live)

1. **Push this whole folder to GitHub**
   - Repo name must be **Valentines** (so the URL is `https://pcharles.github.io/Valentines/`).
   - From the `Valentines` folder:
   ```bash
   git add .
   git commit -m "Deploy Valentines app"
   git push origin main
   ```

2. **Turn on GitHub Pages**
   - On GitHub: open **pcharles/Valentines** → **Settings** → **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.

3. **Deploy**
   - Every push to `main` runs the workflow and updates the site.
   - Or: go to the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

4. **Open the app**
   - [https://pcharles.github.io/Valentines/](https://pcharles.github.io/Valentines/)

---

To change the app (photos, text, colors), edit files inside **valentines-app/** and push to `main`.
