# 📋 ReleaseNotes Maker

> **Theme:** Release Note Organiser  
> **Tech Stack:** MERN Stack (MongoDB, Express.js, React, Node.js)

---

## 📌 Problem Statement

Small project teams often struggle to keep track of which bug fixes, features, and enhancements belong to which upcoming release. Without a structured changelog, critical changes get overlooked, communication with stakeholders becomes fragmented, and compiling release notes before deployment turns into a manual, error-prone chore.

**ReleaseNotes Maker** solves this by providing a unified, version-aware changelog system that records items by type, version, and status—and automates the generation of clean, formatted release notes in seconds.

---

## 🌟 Differentiating Feature

### ⚡ Formatted Release Note Generation from Selected Completed Changes
Unlike static changelogs, ReleaseNotes Maker features an interactive 3-step Release Note Generator:
1. **Target Version Selection:** Filter changes tied to an upcoming milestone (e.g., `v1.0.0`).
2. **Selective Inclusion:** Review all `completed` items and pick the exact changes to publish using checklist controls (with Select All / Deselect All options).
3. **Automated Markdown Compilation & Status Transition:**
   - Automatically groups changes into standardized, emoji-badged release categories (`🚀 New Features`, `🐛 Bug Fixes`, `✨ Improvements`, `💥 Breaking Changes`, `⚠️ Deprecations`, `🔒 Security`).
   - Displays a live rendered Markdown preview with custom formatting.
   - Provides one-click **Copy to Clipboard** and **Download as `.md`**.
   - Automatically promotes selected changes from `completed` to `released` status to prevent duplicate entries in future notes.

---

## 🛠️ MERN Architecture & Tech Stack

| Layer | Technology | Key Highlights |
|---|---|---|
| **Frontend** | React 18, React Router v6, Vite | Component-driven architecture, custom responsive CSS (dark navy theme), client-side input validation, mobile-friendly navigation, modal dialogs, and instant search/filtering. |
| **Backend** | Node.js, Express.js | Modular RESTful API, structured route handlers, CORS configuration, centralized error-handling middleware. |
| **Database** | MongoDB & Mongoose | Flexible document persistence with strict schema constraints, indexing, semver validation regex, and query filtering. |
| **Validation** | `express-validator` & Mongoose | Server-side validation rules for request bodies and object IDs, paired with client-side form validation. |
| **Design** | Handcrafted Responsive CSS | Modern dark theme (`#0f172a`), flex/grid layouts, animated modals, card elevation effects, and zero heavy UI framework overhead. |

---

## 📂 Project Structure

```
p:\Backend Project\
├── package.json                          # Root package with helper scripts
├── README.md                             # Comprehensive project documentation
├── server/                               # Backend Node.js + Express API
│   ├── .env                              # Environment variables (MONGO_URI, PORT)
│   ├── package.json                      # Backend dependencies & scripts
│   ├── server.js                         # Server entry point & middleware pipeline
│   ├── config/
│   │   └── db.js                         # Mongoose database connection setup
│   ├── middleware/
│   │   └── errorHandler.js               # Centralized global error handler
│   ├── models/
│   │   └── ChangeItem.js                 # Mongoose model schema & indexing
│   ├── routes/
│   │   └── changeItems.js                # REST API endpoints & generator logic
│   └── validators/
│       └── changeItemValidator.js        # express-validator request rules
│
└── client/                               # Frontend React + Vite application
    ├── index.html                        # Application HTML root
    ├── package.json                      # Client dependencies & scripts
    ├── vite.config.js                    # Vite configuration with `/api` proxy
    └── src/
        ├── main.jsx                      # React DOM mounting & BrowserRouter
        ├── App.jsx                       # Routing configuration
        ├── App.css / index.css           # Global theme variables & layout resets
        ├── api/
        │   └── changeApi.js              # Fetch-based API service layer
        ├── components/                   # Reusable UI components
        │   ├── Navbar.jsx/.css           # Responsive navbar with mobile hamburger
        │   ├── ChangeCard.jsx/.css       # Color-coded change card with actions
        │   ├── ChangeList.jsx/.css       # Responsive card grid & empty states
        │   ├── ChangeForm.jsx/.css       # Add/Edit form with validation feedback
        │   ├── FilterBar.jsx/.css        # Multi-attribute dropdowns & text search
        │   ├── ConfirmModal.jsx/.css     # Backdrop-blurred confirmation dialog
        │   ├── ReleaseNoteGenerator.jsx/.css # 3-step interactive note generator wizard
        │   └── ReleaseNotePreview.jsx/.css   # Live markdown renderer, copy & download
        └── pages/                        # Page-level views
            ├── Dashboard.jsx/.css        # Main overview & changelog feed
            ├── AddChange.jsx/.css        # New change record view
            ├── EditChange.jsx/.css       # Change record update view
            └── GenerateNotes.jsx/.css    # Release note generator & preview page
```

---

## 🗄️ Data Model (`ChangeItem`)

Stored in the `changeitems` MongoDB collection:

| Field | Type | Required | Constraints / Enums |
|---|---|---|---|
| `title` | `String` | Yes | Trimmed, max 200 characters |
| `description` | `String` | No | Max 2000 characters |
| `type` | `String` | Yes | `feature`, `bugfix`, `improvement`, `breaking`, `deprecation`, `security` |
| `version` | `String` | Yes | Valid SemVer pattern (`/^\d+\.\d+\.\d+$/`, e.g., `1.0.0`) |
| `status` | `String` | Yes | `planned`, `in-progress`, `completed`, `released` (Default: `planned`) |
| `author` | `String` | No | Contributor name / email |
| `tags` | `[String]` | No | Array of keywords (e.g., `ui`, `auth`, `api`) |
| `createdAt` | `Date` | Auto | Mongoose timestamp |
| `updatedAt` | `Date` | Auto | Mongoose timestamp |

---

## 🔌 REST API Reference

Base URL: `http://localhost:5000/api/changes` (proxied via client at `/api/changes`)

### Endpoints

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| **GET** | `/` | Retrieve changelog items | Filters: `?type=`, `?version=`, `?status=`, `?search=` |
| **GET** | `/versions` | Get all distinct recorded versions | Returns semver-sorted version list |
| **GET** | `/:id` | Get single change by ID | Param: MongoDB ObjectId |
| **POST** | `/` | Create a new change item | Body: `{ title, description, type, version, status, author, tags }` |
| **PUT** | `/:id` | Update an existing change item | Param: ID, Body: `{ ...fieldsToUpdate }` |
| **DELETE** | `/:id` | Delete a change item | Param: MongoDB ObjectId |
| **POST** | `/generate-notes` | Generate markdown release notes & mark items as `released` | Body: `{ version: "1.0.0", ids: ["id1", "id2"] }` |

### Sample Response: `POST /api/changes/generate-notes`

```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "generatedAt": "2026-11-07T13:15:00.000Z",
    "sections": [
      {
        "type": "feature",
        "label": "🚀 New Features",
        "items": [
          {
            "id": "672c...",
            "title": "OAuth Google sign-in support",
            "description": "Added passport-google strategy and UI buttons.",
            "author": "Alex"
          }
        ]
      },
      {
        "type": "bugfix",
        "label": "🐛 Bug Fixes",
        "items": [
          {
            "id": "672d...",
            "title": "Fix token expiration issue on page refresh",
            "description": "Refreshes session token silently in background.",
            "author": "Jordan"
          }
        ]
      }
    ],
    "markdownContent": "# Release Notes v1.0.0\n\n> Generated on 2026-11-07T13:15:00.000Z\n\n## 🚀 New Features\n\n- **OAuth Google sign-in support**: Added passport-google strategy and UI buttons.\n\n## 🐛 Bug Fixes\n\n- **Fix token expiration issue on page refresh**: Refreshes session token silently in background."
  }
}
```

---

## 🛡️ Input Validation & Error Handling

- **Validation:**
  - Client side: Validates non-empty title, valid SemVer structure, and character bounds before network dispatch.
  - Server side: Uses `express-validator` to enforce sanitize rules, string lengths, valid MongoID parameters, and enum memberships. Returns HTTP `400` with descriptive error lists.
- **Error Handling Middleware:**
  - Centralized global middleware catches `CastError` (invalid Mongo IDs), `ValidationError` (schema violations), duplicate keys (`11000`), and uncaught exceptions.
  - Safe error fallbacks with HTTP status codes and user-friendly JSON messages.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- A running [MongoDB](https://www.mongodb.com/) instance (either local or MongoDB Atlas)

### 2. Environment Configuration
Create/verify the `.env` file inside `server/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/releasenotes?retryWrites=true&w=majority
PORT=5000
```
*(Both `MONGO_URI` and `MONGODB_URI` environment keys are supported).*

### 3. Install Dependencies

You can install all dependencies from the root or within each folder:

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 4. Running the Application

Open two terminal windows:

#### Terminal 1 — Start Backend Server
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

#### Terminal 2 — Start Frontend Client
```bash
cd client
npm run dev
# Application will run on http://localhost:5173
```

Now open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📱 User Workflow Walkthrough

1. **Record Items (`/add`):** Log every enhancement or fix with its target version (e.g. `1.0.0`), classification, status (`planned`, `in-progress`, `completed`), and notes.
2. **Organise & Filter (`/`):** Use the search bar and filter controls to isolate items by version, lifecycle stage, or category.
3. **Generate Notes (`/generate`):**
   - Select the release milestone.
   - Choose which completed changes to publish.
   - Click **Generate Release Notes** to view formatted sections.
   - Export via **Copy to Clipboard** or download the generated `.md` file for your GitHub release, changelog, or documentation site!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

