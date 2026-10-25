# Before Cafe Canunu goes live

Keep `previewMode: true` until these checks are complete. All bracketed business facts live in `config.json`; sample food and prices live in `menu.json`. Generated HTML repeats these values by design and must be rebuilt after edits.

- [ ] Replace `[PHONE]`, `[WHATSAPP_NUMBER]`, `[EMAIL]`; test actual WhatsApp and email receipt and the call button.
- [ ] Replace `[ADDRESS]`, `[GOOGLE_MAPS_LINK]`, `[GOOGLE_MAPS_EMBED_URL]`; verify the map pin and optional coordinates.
- [ ] Fill every day's `hours` and replace `[OPENING HOURS]`. Test a valid future reservation, a past time, and a closed interval in EAT.
- [ ] Replace `[SITE_URL]` with the final HTTPS domain. Confirm canonical links, share image, robots and sitemap after rebuilding.
- [ ] Confirm every enabled service; replace the preview services note. Confirm delivery areas/fees and order handling with the team.
- [ ] Replace all sample menu items, prices, descriptions and tags with the approved real menu; set `menu.json` sample to false and update `menuNotice`.
- [ ] Replace or approve generated photographs; prioritize all three heroes and the four featured dishes. See the complete 15-image inventory. Update alt text, photo mode and photo disclosure honestly.
- [ ] Replace `[MTN_MERCHANT_NUMBER]`, `[AIRTEL_MONEY_NUMBER]`; verify payee identity and payment methods before `payments.confirmed: true`.
- [ ] Replace restaurant story, values and chef/team introduction placeholders with approved facts; set `about.confirmed` true.
- [ ] Replace three sample testimonials and customer-name placeholders with authentic permitted reviews, and set `testimonialsConfirmed` true, or disable `features.reviews`. Replace `[GOOGLE_REVIEWS_URL]`.
- [ ] Replace Facebook, Instagram, TikTok and WhatsApp social URLs; remove unused entries from the socials object.
- [ ] Connect `[FORM_SERVICE_ENDPOINT]` and `[NEWSLETTER_ENDPOINT]`, or disable newsletter and use verified WhatsApp/email. Confirm CORS, service response, recipients, mailing-list signup, unsubscribe and failure handling.
- [ ] Replace `[PRIVACY POLICY]` and `[TERMS OF USE]` text with the restaurant's approved policies, including third-party processing, retention, order acceptance, cancellations/refunds and contact details.
- [ ] Keep promotion disabled until `[PROMOTION_TITLE]` and `[PROMOTION_DETAILS]` are approved.
- [ ] Keep optional loyalty, gift cards and careers off until their bracketed details are replaced. Configure catering enquiry handling before enabling. Bilingual translation remains phase 2.
- [ ] Run build and tests, check keyboard navigation and dialogs, and inspect a real phone on mobile data. Check all 15 photos and all form destinations on the public host.
- [ ] Set `previewMode` false, rebuild, upload only `dist/`, and verify there are no bracketed placeholders or sample-price claims left in the live pages.

The website does not process payment, keep customer accounts, confirm availability, send messages automatically or run a mailing list by itself. The restaurant and configured providers handle those steps.
