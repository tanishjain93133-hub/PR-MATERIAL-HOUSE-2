# CMS Transformation & Domain Separation Walkthrough - PR Material House

We have successfully implemented the dynamic database-driven **CMS Transformation** and **Frontend/Backend Separation** architecture. The website is now 100% manageable via the Admin Panel, and the domains partition public website routing from admin interfaces.

---

## 🛠️ Key Architectural Implementations

### 1. Unified Domain Separation Routing
- **The Solution**: Implemented a dynamic domain/port routing engine in [App.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/App.jsx).
  * **Frontend Domain Check**: Detects if the current domain runs the public client space.
    * Serves client-facing public pages exclusively (`/`, `/about`, `/products`, `/brands`, `/gallery`, `/contact`).
    * Disables all `/admin/*` routes, redirecting admin navigation attempts instantly back to the public homepage `/`.
  * **Backend Domain Check**: Detects if the current domain is dedicated to API servers or backend admins (e.g. localhost:5000 or backend-pr.vercel.app).
    * Restricts access to public website pages completely.
    * Automatically intercepts and redirects `/`, `/about`, `/products`, etc. to the Admin Login interface (`/admin/login`).
    * Safeguards all administrative dashboard paths behind session verification guards.

### 2. Dynamic styling engine & Custom Themes
- **The Solution**:
  * Set up a dynamic CSS property injector inside the boot lifecycle of [App.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/App.jsx). It fetches website configurations from the database and inserts colors (`primary`, `accent`, `background`), favicons, and meta tags directly into the Document Head and root styles.
  * Mapped CSS variables directly to Tailwind v4 custom theme tokens in [index.css](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/index.css#L4-L20).
  * **Result**: Changing primary/accent colors in the Admin Portal instantly updates all headers, buttons, text accents, hovers, and background cards across the entire website without rebuilding!

---

## 🏗️ CMS Dashboards & Admin Panels

We upgraded the administration portal to become a full-scale website CMS:

### 1. Collapsible Homepage CMS Editor ([AdminSettings.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/admin/AdminSettings.jsx))
- Configured a tabbed editor separating landing sections:
  * **Hero Banner**: Supports text, action links, layout animations, background canvases (solid colors vs background image uploads vs ambient loop videos).
  * **About Section**: Manage biography copy, designations, and upload/crop company banners.
  * **Why Choose Us**: Direct inline fields to edit features cards, titles, descriptions, and assign Lucide Icon classes.
  * **Statistics**: Grid form fields to manage count metrics (e.g., "15+", "Years Experience").
  * **CTA Banner**: Customize the bottom banner text, buttons, and upload CTA background covers.
  * **SEO Metadata**: Directly modify homepage page titles and crawler descriptions.

### 2. Google Analytics & Facebook Pixel ([AdminWebsiteConfig.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/admin/AdminWebsiteConfig.jsx))
- Extended Mongoose models and the website settings config dashboard to support entering Google Analytics measurement IDs (`G-XXXXXXXXXX`) and Facebook Pixel IDs. Values are saved to database configs and injected on client boot.

### 3. Customer Enquiries vs Product Quote Requests ([AdminEnquiries.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/admin/AdminEnquiries.jsx))
- Partitioned inbox queries into a clean tabbed panel:
  * **Direct Product Quotes**: Lists orders bound to specific catalog items or steel categories.
  * **General Contact Messages**: Separates general queries and suggestions.
  * Administrators can change status (Pending/Contacted/Completed) or review detailed client forms.

### 4. Registered Users & Administrative Staff ([AdminUsers.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/admin/AdminUsers.jsx))
- Split user management into B2B Customer lists and Administrative Staff.
- Admin dashboard allows creating/editing managers and editors, assigning specific roles, choosing granular checkbox permissions (such as Manage Products or Manage Media Gallery), and updating staff passwords.

### 5. Media Gallery Images & Videos ([AdminGallery.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/admin/AdminGallery.jsx))
- Exposes type selections (`image` vs `video`) when saving assets.
- Embedded video preview players in media cards.
- Added a **Copy Link** utility on every asset card, copying the absolute URL to the clipboard so administrators can paste media links into Hero Banner configs or CTA backgrounds instantly.

### 6. Category Reordering & Toggles ([AdminCategories.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/admin/AdminCategories.jsx))
- Added reordering support. Moving categories up or down swaps their sort indexes optimistically in state, sending batch updates to the backend `/reorder` endpoint.
- Exposed a direct **Visibility Toggle** (Show/Hide) on each category to instantly hide/show them on the landing sliders and catalog menus.

---

## 🌐 Dynamic Database Fetching on Public Pages

- **[Home.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/Home.jsx)**:
  * Dynamic Hero Background renders color canvas, cover image, or loop video based on database choices.
  * Automatically hides categories or testimonials marked `hide: true`.
  * Dynamically resolves Lucide Icon names dynamically from Mongoose models to draw correct SVGs for cards.
  * Renders dynamic stats strip counters.
- **[About.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/About.jsx)**:
  * Renders CMS biographies, dynamic stats counters, and uploaded biography company banners.
- **[Gallery.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/pages/Gallery.jsx)** & **[Lightbox.jsx](file:///c:/Users/Tanish%2520Jain/Desktop/PR%2520Enterprise/frontend/src/components/Lightbox.jsx)**:
  * Renders video players inside grid cards and lightbox overlays if asset type is `video`, with full audio/video controls.

---

## 🚀 Standalone Deployments Sync

- Compiled frontend builds successfully:
  `dist/assets/index-CLZ84HBC.css` (67.38 kB)
  `dist/assets/index-B3giA6Ir.js` (1,317.72 kB)
- Synchronized frontend dist to backend Dist folder via corrected dirname path scripts.
- Pushed standalone repos successfully:
  * **Frontend standalone repo**: [https://github.com/tanishjain93133-hub/Pr-frontend-.git](https://github.com/tanishjain93133-hub/Pr-frontend-.git)
  * **Backend standalone repo**: [https://github.com/tanishjain93133-hub/backend-pr-.git](https://github.com/tanishjain93133-hub/backend-pr-.git)
