# Md Zainul Ali — Portfolio

This is your personal research portfolio. It lives at **i-am-zain.netlify.app** and is powered entirely by one file: **`data.json`**.

If you want to update something on the site — your summary, a new publication, a new project, an image — you edit `data.json`, save, and push to GitHub. Netlify notices the change and redeploys in about a minute. No code changes needed for content updates.

## Updating content — the 3 most common edits

### 1. Change my "Now" blurb (what I'm currently working on)

Open `data.json`, find the `"now"` block near the top, edit the text and date:

```json
"now": {
  "text": "Currently investigating multimodal biomarkers for early Parkinson's detection.",
  "asOf": "2026-04-20"
}
```

Save, commit, push.

### 2. Add a new publication

Open `data.json`, find `"articles"`, and add an entry to the array. Copy an existing entry so you don't have to type the whole shape:

```json
{
  "id": "art-6",
  "type": "research",   // or "review", "bookChapter", "abstract"
  "title": "Your new paper title",
  "summary": "One-paragraph description.",
  "year": "2026",
  "url": "https://doi.org/...",
  "venue": "Journal name",
  "authorship": "1st author",
  "publicationDate": "2026-03-15",
  "image": {
    "src": "/images/articles/new-paper.jpg",
    "alt": "Brief description of the image",
    "width": 1200,
    "height": 800
  }
}
```

If the paper has an image, drop the image into `images/articles/` and use that filename in `src`. If it doesn't, remove the whole `"image": {...}` line.

Save, commit, push.

### 3. Add a new project

Find `"projects"` in `data.json`, copy an existing entry, and edit the fields. Same pattern: images go in `images/projects/`, and you reference them in the `"image"` field.

## How section visibility works

In `data.json`, the `"sections"` block controls what shows on the page:

```json
"sections": {
  "order":  ["hero", "about", "milestones", "experience", "projects", ...],
  "hidden": ["testimonials"]
}
```

- **`order`** — the sections appear in the order you list them. Rearrange to change the page order.
- **`hidden`** — add a section name here to hide it entirely.

Also, any section whose data is empty (e.g. `"testimonials": []`) auto-hides. So if you haven't written testimonials yet, the section just doesn't appear — no empty placeholder.

## Naming a section differently

If you want "Articles" to appear as "Publications" on the site, use `"sectionOverrides"`:

```json
"sectionOverrides": {
  "articles": { "title": "Publications" }
}
```

This doesn't rename anything in the JSON, just the heading visitors see.

## Where to put images

- **Profile photos** → `images/profile/`
- **Project screenshots** → `images/projects/`
- **Conference photos** → `images/conferences/`
- **Workshop photos** → `images/workshops/`
- **Article covers** → `images/articles/`
- **Testimonial avatars** → `images/testimonials/`

In `data.json`, always use the path starting with `/`:

```
✅  "/images/projects/my-new-project.jpg"
❌  "./images/projects/my-new-project.jpg"
❌  "images/projects/my-new-project.jpg"
```

## Your resume

Put your resume PDF at `documents/zain-resume.pdf`. The site links to it automatically from the hero CTA and from `https://i-am-zain.netlify.app/resume`. To update it, just replace the file and push.

## Running the site on your computer

Most of the time you won't need to — you can edit `data.json` directly in GitHub's web editor and let Netlify rebuild. But if you do want to preview changes locally:

```
npm install         # one time
npm run dev         # starts a local preview at http://localhost:3000
```

Press `Ctrl+C` to stop.

## Dark mode / light mode

The site respects the visitor's system setting by default, and has a toggle in the nav bar. Your default mode (the one used if a new visitor hasn't chosen anything) is set in `data.json`:

```json
"theme": {
  "defaultMode": "dark"
}
```

Change to `"light"` if you prefer.

## Who to ask

- Content questions ("what should I say in the bio?") — your call.
- Technical questions ("how do I fix a broken image?") — send a new developer to `AI_CONTEXT.md` first. That file has everything they need.
- Site is down? — check https://app.netlify.com for deploy logs. If a push failed to deploy, the latest version is still live.

## Technology choice, briefly

This site is plain HTML + CSS + JavaScript, no framework. That choice was deliberate: it means the site will keep working as browsers evolve, without forcing you to migrate every few years. There is no build pipeline to break, no dependency to update. Your content and your design tokens are the only moving parts.

---

**Questions, or want to make a bigger change?** See `AI_CONTEXT.md` for the technical architecture and design-system documentation.
