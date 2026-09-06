# Student Management — Web Application

A production-grade React front-end built from the **Project Requirement
Document — Student Management Mobile Application (v1.0)**. It implements
all 7 specified screens with full field-level validation, master-data
driven dropdowns, and a responsive layout that works on mobile, tablet
and desktop.

## Tech Stack

| Concern              | Choice                                   | Why |
|-----------------------|-------------------------------------------|-----|
| Build tool            | Vite                                      | Fast dev server & optimized production builds |
| UI framework          | React 19                                  | Industry standard, huge ecosystem |
| Routing               | React Router v7                           | Nested routes, protected-route pattern |
| Forms & validation    | React Hook Form + Zod                     | Uncontrolled-first performance, schema validation matching every rule in the spec (regex, max length, required) |
| Styling               | Tailwind CSS                              | Fast, consistent, no CSS-file sprawl; easy to theme |
| Icons                 | lucide-react                              | Lightweight, tree-shakeable |
| State                 | React Context (`AuthContext`)             | Simple, sufficient for auth/session; swappable for Redux/Zustand later without touching pages |
| Data layer            | `src/api/*Api.js` + `src/data/mockApi.js`  | Every page calls `src/api/*Api.js`. With `VITE_API_BASE_URL` unset, those files delegate to the localStorage mock; set it to point at `backend/` and the same pages talk to a real Neon-backed API — zero component changes either way |

## Getting Started

```bash
npm install
npm run dev       # start local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
npm run lint        # oxlint
```

By default the app runs entirely against the built-in mock (no server
needed). To use the real backend instead, see `backend/README.md` to get
it running, then:

```bash
cp .env.example .env.local
# set VITE_API_BASE_URL=http://localhost:4000/api in .env.local
npm run dev
```

### Demo login

Both the mock and the backend's seed script provision the same demo user:

| Field | Value |
|---|---|
| Client Id | `DEMO0001` |
| Mobile Number | `9619306969` |
| Password | `Demo@123` |

## Project Structure

```
src/
  api/
    httpClient.js     Fetch wrapper: base URL, bearer token, normalized
                      { ok, ... } responses matching mockApi's contract
    tokenStore.js     JWT storage (localStorage) for the real backend
    authApi.js         login/logout/getSession -- mock or real, by flag
    profileApi.js       updateProfile -- mock or real
    customerApi.js       list/get/create/update/deleteCustomer -- mock or real
  components/
    layout/         AppShell (header + drawer), NavDrawer, ProtectedRoute
    ui/              Reusable form controls (Input, Select, TextArea,
                      PasswordInput, MultiSelectDays) and small atoms
                      (Badge, Spinner, SectionCard, PageHeading)
  context/
    AuthContext.jsx  Session state, login/logout/updateProfile (via src/api/)
  data/
    masterData.js    Single source of truth for every dropdown list
                      (Gender, Blood Group, City, District, State, Days)
    mockApi.js        Promise-based mock backend (localStorage-backed),
                      used automatically when VITE_API_BASE_URL is unset.
  schemas/
    loginSchema.js    Zod schema -- Section 5.1
    profileSchema.js  Zod schema -- Section 5.3
    customerSchema.js Zod schema -- Section 5.5 (Add/Edit Customer)
  pages/
    Login.jsx
    Home.jsx
    ViewProfile.jsx
    ViewCustomer.jsx
    AddCustomer.jsx    (also handles Edit, via /customers/:id/edit)
    Guide.jsx
    ContactUs.jsx
  utils/
    validators.js      Shared regex patterns / messages used by all schemas
```

## Screens Implemented (per the Requirement Document)

1. **Login** -- Client Id, Mobile Number, masked Password. All fields
   required with exact accepted-character and length rules enforced.
2. **Home** -- Landing screen with logo and access to all sections; a
   right-hand navigation drawer (View Profile, View Customer, Guide,
   Contact, Logout) is available from every authenticated screen.
3. **View Profile** -- Card layout showing User Name, Contact Number,
   Subscription Status badge, Email Id, Client Name, with inline
   "Edit Profile".
4. **View Customer** -- List of students with an edit icon per row and
   an "Add Customer" action in the header.
5. **Add / Edit Customer** -- Full form covering Student, Parent,
   Medical, Address and School sections, including the multi-select
   School Days control, dropdowns sourced from `masterData.js`, and
   validation matching every rule in Section 5.5 of the document.
6. **Guide** -- In-app walkthrough of core features.
7. **Contact Us** -- Support contact details.

## Validation Approach

Every field's "Accepted Value" and "Length" column from the requirement
document is encoded as a Zod rule in `src/schemas/`, built from shared
regex patterns in `src/utils/validators.js`. This keeps the mapping from
spec to code traceable, and means a future change to the document (e.g. a
new accepted character) is a one-line change in a single file.

## Backend

A production-ready backend (Express + Prisma + Neon PostgreSQL) lives in
`backend/`. It's a separate deployable service — see `backend/README.md`
for Neon setup, migrations, seeding, the API reference, and deployment
instructions. The frontend works standalone without it (mock mode) and
switches to it entirely via the `VITE_API_BASE_URL` env var above.

## Ready for Future Development

- **Real backend**: already built in `backend/` — see above. No frontend
  component changes were needed to wire it up, only the `src/api/*Api.js`
  layer, exactly as designed.
- **Master data from API**: `src/data/masterData.js` exports plain
  arrays -- replace with a fetch-and-cache hook without touching any
  form. The backend already models City/District/State as database
  tables for this reason.
- **Auth**: the real backend issues JWTs; `src/api/tokenStore.js` and
  `authApi.js` are the only files that know about token storage, so
  switching to e.g. httpOnly-cookie sessions later touches just those two
  files.
- **Design system**: all form controls live in `src/components/ui/` --
  restyle once, it applies everywhere.
- **TypeScript migration**: the code is organized so files can be
  renamed `.tsx`/`.ts` incrementally (schemas and master data first,
  since everything else consumes them).

## Out of Scope (per the Requirement Document)

Visual design/wireframes, formal API contracts, and non-functional
requirements (performance, security) were explicitly out of scope for
the requirement document and are approximated here with a clean,
accessible, responsive Tailwind UI and a mock data layer -- both meant
to be refined once those companion documents exist.
