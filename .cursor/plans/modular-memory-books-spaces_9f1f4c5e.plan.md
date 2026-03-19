---
name: modular-memory-books-spaces
overview: Introduce modular Memory Books (spaces) with per-book membership, multi-provider sign-in, and a user-wide Memories gallery.
todos:
  - id: auth-supabase-design
    content: Design Supabase-based auth and user model supporting Google and email sign-in
    status: completed
  - id: spaces-schema
    content: Define database schema for spaces (memory books), space_members, albums, stories, assets, and album_photos
    status: completed
  - id: space-selection-flow
    content: Design UX flow for Memory Book selection screen after sign-in
    status: completed
  - id: header-space-selector
    content: Design header book selector UI next to profile avatar and link to space selection
    status: completed
  - id: space-scoped-routes
    content: Plan how to thread current space_id through existing routes and hooks
    status: completed
  - id: memories-views
    content: Specify behavior for space-scoped Memories view vs cross-space My Memories view
    status: completed
  - id: photo-reuse-model
    content: Model reusable photo assets and their use across multiple spaces
    status: completed
  - id: future-google-backup
    content: Outline future export-to-Google-Drive flow for a space or album
    status: completed
  - id: future-google-photos-import
    content: Outline future import-from-Google-Photos flow for album creation
    status: completed
isProject: false
---

## Modular Memory Books Architecture

### Auth & identity

- **Multi-provider sign-in**
  - Use Supabase Auth (or similar) with:
    - Email-based sign-in (magic link or password) so iCloud users are first-class.
    - Google OAuth as an additional option (to support later Google backups/imports).
  - Treat the current Google-only flow as a thin layer that can be swapped to Supabase-auth-backed user objects.
- **User model**
  - Backend `users` table keyed by `id` from Supabase Auth, with columns like `primary_email`, `display_name`, `avatar_url`.
  - Frontend `useAuth` context should normalize to this user shape and no longer depend on Google-specific fields (beyond optional tokens for future Drive/Photos features).

### Spaces = Memory Books

- **Core concept**
  - Introduce `spaces` (a.k.a. Memory Books) as a first-class table: `spaces(id, name, created_by, created_at, cover_image_id?)`.
  - A user can belong to multiple spaces (family book, camp book, etc.).
- **Membership & permissions**
  - `space_members(space_id, user_id, role)` where `role` can be `owner`, `editor`, `viewer`.
  - Access rules:
    - Users only see spaces where they are members.
    - For now, only **owners** can invite/remove; future sprint can add UI for changing roles.
  - Invitation flow (future sprint): from within a selected space, owner adds an email, system sends invite; upon sign-in, that user is added as a `space_member`.

### Memory data model (albums, stories, photos)

- **Space-scoped memories**
  - `albums(id, space_id, title, description?, event_date?, created_by, created_at)`.
  - `stories(id, space_id, title, content, event_date?, created_by, created_at)`.
- **Reusable assets (for cross-space reuse)**
  - `assets(id, owner_user_id, storage_path, mime_type, captured_at?, created_at, source? ["upload"|"google_photos"|...])`.
  - `album_photos(album_id, asset_id, caption?, sort_order)` so the same underlying photo `asset` can appear in multiple albums or spaces.
  - This supports your example: upload your daughter’s camp photos once, then:
    - Use them in a "Family" space album.
    - Use some or all in a "Camp Friends" space album.

### Screen flow & navigation

- **Screen 1 – Sign in**
  - Simple landing with options (all enabled from the beginning):
    - "Continue with Google".
    - "Continue with email" (Supabase email magic link or password).
    - (Later) Continue with Apple when you are ready to add it.
  - After successful auth, user is known in the backend and associated with their `user` row.
- **Screen 2 – Select or create Memory Book**
  - New **“Memory Books”** (spaces) screen that lists all `spaces` the user is a member of.
  - For each: show name, maybe a cover image, and last updated time.
  - Primary actions:
    - "Create new Memory Book" → prompts for name only (no invites here, per your preference).
    - Select an existing book to enter it.
- **Within a selected Memory Book**
  - All existing routes (`Home`, `Memories`, `Album`, `Story`, `Preview`) become **space-scoped** by `space_id`.
  - On initial entry to a space:
    - Home shows the hero + 4 tiles as now, but all actions operate within the current `space_id`.

### Where to put the book selector & actions

- **Header selector placement**
  - Add a **Memory Book selector** in the header **next to the profile/avatar & sign-out**.
    - This is a compact dropdown or pill with the current book name.
    - Clicking it opens a list of the user’s spaces and a link to "All Memory Books" (Space selection screen).
  - This keeps the header focused on **global context (which space am I in, who am I)**.
- **Page body actions**
  - Keep creation actions (create album, write story, preview, etc.) in the **body of the page**, not the header.
  - On the Home page:
    - Use the white space between hero copy and the feature tiles for a **“Go to Memories gallery”** button.
    - The 4 tiles remain as "Photo Albums", "Written Stories", "Voice-Over (coming soon)", "Preview Draft" and act as entry points within the current space.

### Memories page semantics

- **Space-agnostic vs space-scoped views**
  - Introduce two related concepts:
    - **Space-scoped Memories**: what you currently have – gallery of all albums + stories **for the current space**.
    - **User-wide Memories (My Memories)**: a personal gallery of **everything the user has created**, across all spaces.
- **How to implement both without confusion**
  - Keep the existing `Memories` tab in the space navigation as **space-scoped**: shows all memories belonging to the current `space_id`.
  - Expose My Memories only from the **header** (e.g. in the profile/avatar menu or as a dedicated header link), not in the main in-space nav.
    - My Memories filters albums/stories where `created_by = current_user_id`, across all spaces.
    - Optionally shows tags/pills for which spaces each memory belongs to.
  - Reuse the same card components (`AlbumCard`, `StoryCard`) but add optional badges that show associated space names when in the cross-space view.
- **Photo reuse across spaces**
  - When an album is created in another space using existing photos:
    - User selects from their own `assets` (owned by them) in an "Add from library" dialog.
    - Creating that album only inserts new rows into `album_photos`; no extra upload is necessary.

### Permissions and visibility

- **What each user can see**
  - Within a space:
    - Users see all albums/stories in that space (subject to role-based restrictions if added later).
  - In "My Memories" (user-wide):
    - Only show memories where `created_by = current_user_id`.
    - For albums/stories that belong to multiple spaces, list the associated spaces, but only if the user has membership in each.
- **Invitations (future sprint)**
  - From inside a space, an owner can go to "Manage members" and:
    - Add an email, pick a role, send invite.
    - When that person signs in (via Google or email), the backend checks for a pending invite and adds them as `space_member`.

### Future Google features (phased)

- **Phase later – Google Drive backup**
  - For a selected space or album, add an "Export to Google Drive" button.
  - Use the user’s Google token (if they’ve connected their Google account) to:
    - Create a `Memory Book/{SpaceName}` folder.
    - Upload JSON metadata + images.
- **Phase later – Google Photos import**
  - Add an "Import from Google Photos" action when creating or editing an album.
  - Use Google Photos Library API to let the user select photos and pull in URLs + timestamps.
  - Map creation time to your `captured_at` / event date, and store imported images as `assets` with `source = "google_photos"`.

This plan keeps the core UX you like, introduces Memory Books as modular spaces, supports non-Google users from day one, and leaves clean hooks for future invites, Drive export, and Google Photos import.