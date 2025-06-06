# ByteShrink.dev

Frontend bundle optimization, now with AI.

This is the official UI wrapper for the [ByteShrink AI API](https://github.com/denodell/byteshrink-api) project. Upload a `package.json` file to get instant AI-powered insights into bundle size bloat, outdated packages, and lighter alternatives.

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Static Export (`next export`) for GitHub Pages

---

## 🚀 Getting Started

```bash
git clone https://github.com/byteshrink/byteshrink.dev.git
cd byteshrink.dev
npm install
npm run dev
```

---

## 🧱 Building for Deployment

To generate the static site (for GitHub Pages or other static hosting):

```bash
npm run build
npm run export
```

This will create a static `out/` directory you can deploy anywhere.

If deploying to GitHub Pages, make sure to:

1. Set the `GITHUB_PAGES=true` environment variable.
2. Push the contents of `out/` to the `gh-pages` branch.
3. Set the GitHub Pages source to `gh-pages` in repo settings.

---

## 📦 API

The site talks to the ByteShrink API at:

```
https://api.byteshrink.dev/analyze
```

You can test this manually with:

```bash
curl -X POST https://api.byteshrink.dev/analyze \
  -H "Content-Type: application/json" \
  -H "X-Model: deepseek/deepseek-r1:free" \
  -d '{"dependencies": {"react": "^18.2.0"}}'
```

---

## 🧪 Local Testing

To mock or point to a local API version during development, you can update the fetch URL in `app/actions/analyze.ts`.

---

## 📄 License

MIT — see `LICENSE`

---

Made with ❤️ by [Den Odell](https://denodell.com)
