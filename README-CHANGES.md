# Updated Files – Copy these into your project

Replace the corresponding files in your original project with the ones in this folder.

## Files changed

| New path (relative to project root) | What changed |
|-------------------------------------|--------------|
| `src/app/admin/add-vehicle/page.tsx` | **Image upload with delete** – selected photos now show as thumbnails. Click the red X to remove any photo before publishing. |
| `src/app/page.tsx` | **Brand logos** on homepage “Start with a name you know” cards. Uses free SVG logos from jsDelivr. Falls back to initials if a brand has no logo. |
| `src/app/inventory/[slug]/page.tsx` | **Vehicle detail page** restyled to match the clean look of your screenshots: larger gallery, status badges, specs card, “Why buy with us” section + FAQ accordion. |
| `src/components/VehicleGallery.tsx` | Improved gallery: main image, 3 thumbnails, “Show more photos” button, simple lightbox. |
| `next.config.js` | Added `cdn.jsdelivr.net` so the brand logos load correctly. |
| `src/components/FinancingCalculator.tsx` | **New** – interactive financing calculator (price, down payment slider, term buttons, interest rate → monthly payment + totals). |
| `src/app/inventory/[slug]/page.tsx` | Now also embeds the financing calculator (pre-filled with the vehicle’s price). |


| `src/components/InquiryForm.tsx` | **Inquiry is now a button** – clicking it opens a clean popup modal form. Submits the same way. |
| `src/app/page.tsx` | Many more brand logos on homepage (24+ popular makes). FAQ section added to homepage. “Why buy with us” restyled. |
| `src/app/inventory/[slug]/page.tsx` | Uses the new modal inquiry button instead of the always-visible form. |

## How to apply

1. Copy each file into the matching location in your project (overwrite the old one).
2. Restart the dev server (`npm run dev`).
3. Optional: place a wide hero image at `public/hero.jpg` if you later want a background photo on the homepage (the code already has a dark gradient ready).

## Notes

- Brand logos are loaded from a public free CDN. If a make is missing you can add it to the `BRAND_LOGOS` map in `src/app/page.tsx`.
- The image delete feature only affects the selection before upload – it does not delete already-published images.
- No database or API changes were required.
