# Cafe Canunu website

All source and deployable files belong in `C:\Users\Mishael Jude\Desktop\cafe canunu`.

This is a complete React website in preview mode. The menu, prices, services and generated photos are illustrative. Real business details are intentionally unfilled. No orders, payments or reservations are accepted automatically. Read `LAUNCH-CHECKLIST.md` before publishing.

## Open and edit

This site is a React app (Vite + React Router). Install Node.js 20 or newer, then double-click `Start website.cmd` (installs, builds and opens the site), or in a terminal in this folder run:

```text
npm install        (first time only)
npm run dev        live-reloading development server
npm run build      checks config/menu/images, then builds the site into dist/
npm run preview    serves the built dist/ folder locally
npm test           config checks plus unit and page tests
```

Then open http://127.0.0.1:4173. Edits to `config.json`, `menu.json` or the source reload automatically in `npm run dev`; for the deployable site run `npm run build` again. Do not edit files inside `dist/`.

## Where things live

- `config.json`, `menu.json`: business details and menu, exactly as before.
- `src/`: the React app. `pages/` has one component per page, `components/` the shared header, footer, forms and dialogs, `context.jsx` the cart, toast and message dialog, `lib.js` shared validation and message formatting, `styles.css` the responsive design.
- `public/`: images, favicon, plus the generated `sitemap.xml` and `robots.txt`. Photos live in `public/images/`.
- `validate.mjs`: build-time checks of config, menu and images.
- `tests/`: automated tests.
- `dist/`: the folder to upload to your static host after building.

Page addresses are now clean (`/menu`, `/order`). Old `menu.html`-style links redirect automatically. Your host must serve `index.html` for unknown paths; `vercel.json` does this on Vercel.

## Contacts, maps and services

Replace bracketed values in `config.json`. Use your full international number for `whatsapp`, e.g. country code plus subscriber number, with no leading local zero. Never use a fake number for a public site. `phone` supports international formatting. `email` must be a working mailbox. Set `siteUrl` to the final HTTPS site address; this enables canonical links, share images and sitemap URLs.

Update each branch's name, address, Google Maps link and optional map embed URL. Use the HTTPS `src` URL from Google's embed code, not the entire iframe HTML. The embed loads automatically on the Location and Contact pages; the hostname must be `www.google.com`. Coordinates can stay null until verified. Social and review links must be HTTPS. Unconfigured links display their placeholder without taking visitors to a fabricated destination.

Switch available services on/off under `services`. Delivery is off by default; enabling it adds a required address to checkout. Confirm payment instructions and merchant numbers before setting `payments.confirmed` to true. The website displays instructions only and never processes payments. Do not add secret keys, credentials or payment PINs to config: all config data is public in the generated site.

## Opening hours and reservations

Hours use East Africa Time (Africa/Kampala, UTC+3). Day keys: 0 Sunday, 1 Monday, through 6 Saturday. Use `null` for unconfirmed, `[]` for closed, or intervals:

```json
"1": [{"open":"08:00","close":"12:00"},{"open":"14:00","close":"20:00"}]
```

Use 24-hour times. Opening is inclusive; closing is exclusive. Each interval must finish on the same calendar day, later than it starts. For service crossing midnight, split between the two day entries; the last minute before midnight cannot be booked with this same-day model. Change `hoursLabel` to a human-readable summary after confirmation. The indicator updates every 30 seconds. Null hours show “Hours to be confirmed” and block reservation requests; they do not pretend the restaurant is closed. Reservations must be future times during an open interval, with 1–50 guests. The restaurant must reply to confirm.

## Menu and prices

Edit `menu.json` in a text editor. Keep unique simple IDs and category IDs. Store prices as whole UGX numbers without commas or currency symbols (for example `18000`). Use `featured: true` for up to six home-page dishes. Tags power the dietary filter; remove dietary claims you cannot substantiate. `image` is a file stem without extension. `alt` should describe the real image plainly.

Replace every sample dish, price and description with your approved menu. Then set `sample` to false and replace `menuNotice` in config with an accurate menu note. After replacing the restaurant story, values and team text, set `about.confirmed` to true. After replacing all testimonials with authentic permitted reviews, set `testimonialsConfirmed` to true; otherwise keep the reviews feature off. These flags remove the corresponding placeholder labels. The cart is kept locally in the visitor's browser; customer form details are not stored. Invalid or removed items are discarded. Quantities are capped at 99 per item. The subtotal excludes delivery fees. Opening WhatsApp prepares an encoded request; the visitor must send it and the restaurant must accept it.

## Replace photos

See `IMAGE-INVENTORY.md`. Replace hero images and featured dishes first. Prepare both `.webp` and `.jpg` using the same stems. Menu dimensions: 600×600 and about 100 KB maximum per format; hero: 1280×720 and about 250 KB maximum. Use genuine photos with permission.

Put all replacements in `public/images/real/`, set `imageMode` to `real`, retain `realImageDirectory: "images/real/"`, and update `imageNotice`, all menu alt text and hero alt text. Supply all 15 stems before switching; the build checks both formats and refuses missing files. Alternatively replace the original files in `public/images/`. Remove AI references only when all displayed images are genuine. The gallery and cart use the same image selection as the menu.

## Forms and email signup

Orders and reservations open a reviewable WhatsApp message; reservations also offer an email draft. Contact and feedback can use WhatsApp/email or a form service. No configured destination means an honest “not sent” message and a copyable draft. Email needs the visitor's configured email app. End-to-end receipt must be tested with the owner's real contact details before launch.

To use a form provider, set `forms.endpoint` to an HTTPS endpoint accepting browser POSTs with `Content-Type: application/json` and CORS permission for your site. The payload includes `form`, `name`, `phone`, `email`, `message`, and `rating` where applicable. It must return a non-2xx status on failure. A 2xx response means the service accepted the message, not that the restaurant confirmed a request. Configure recipient routing, spam protection, retention and access in your provider. The client times out after 15 seconds and retains inputs on failure. Do not point this at a provider that expects a different format without adapting `useFormSubmit` in `src/components/forms.jsx`.

Newsletter uses a separate `forms.newsletterEndpoint` with JSON fields `email`, `consent`, `consentAt`. Connect it to an actual mailing list, configure double opt-in/unsubscribe in the provider, and test receipt. The checkbox is required. Without an endpoint it explicitly says the email was not submitted. Disable `features.newsletter` until your list is ready if preferred.

## Optional features

`features` switches control gallery, reservations, reviews, newsletter and dark mode. Loyalty, gift cards, catering enquiry and careers are off by default; enable any to add a “More at Canunu” information page and relevant enquiry form. Complete their copy before enabling. Loyalty and gift cards are information only: accounts, points and purchasing are phase 2. `promotion.enabled` controls the home-page promotion. Branch entries support additional locations. `languageToggle` and `languages` reserve space for future translated copy; translation is not implemented, so leave the toggle false. All main customer flows work in English.

## Publish using a free static hosting plan

1. Complete the launch checklist. Set `previewMode` to false only when ready; this enables indexing. Set the final `siteUrl` and rebuild.
2. Run `npm run build` and `npm test`.
3. Create a Netlify account and choose an eligible Free plan. Check the current [plan limits](https://www.netlify.com/pricing/) before publishing; domain registration and third-party form/email services can have separate costs.
4. Follow [Netlify's manual deploy guide](https://docs.netlify.com/deploy/create-deploys/) and upload **the `dist` folder**, which already contains the built website. Manual deploys do not run your build command. Do not upload a source-only folder or a parent containing `dist`.
5. Set public access deliberately in your hosting dashboard, then test the live HTTPS URL on a real phone. If the assigned URL differs, update `siteUrl`, rebuild, and upload `dist` again.

The included `_headers` sets a restrictive content policy on hosts that support that file (Netlify/Cloudflare); adjust it when adding any new external embeds or assets. There are no external fonts or trackers. Git-based deployment can use `npm run build` as the build command and `dist` as the publish directory. No website has been uploaded or published by this delivery.

## Deploy on Vercel

`vercel.json` already sets the build (`npm run build`, output `dist`), sends every address to `index.html` so `/menu`, `/order` and so on work on refresh and shared links, and applies the security headers. Headers and the rewrite live in `vercel.json` only.

Fastest way, from this folder:

```text
npx vercel          (log in, accept the defaults; gives a preview link)
npx vercel --prod   (makes the final address)
```

Or push the folder to a GitHub repository and import it at vercel.com/new (framework: Vite). Give the project a non-obvious name while it is only a client preview. While `previewMode` is true in `config.json` the site tells search engines not to index it. When you launch for real, set `previewMode` to false, set `siteUrl` to the final address, and add the custom domain in the Vercel project settings.
