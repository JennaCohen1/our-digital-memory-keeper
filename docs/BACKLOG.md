# Backlog

## Export to Google Drive (future)

- **User story**: As a family member, I want to export a memory book, album, or story to my own Google Drive so I have a personal backup.
- **Flow**:
  - From an album or story view (or space settings), show an "Export to Google Drive" action.
  - If the user has not granted Drive access, prompt Google OAuth with `drive.file` scope.
  - Create a folder in the user's Drive (e.g. `Memory Book / {Space Name} / {Album or Story}`).
  - For albums: upload each photo as an image file; add a JSON metadata file (title, event_date, captions, tags).
  - For stories: create a text/markdown file or Google Doc with content and metadata.
  - Show success/error feedback (toast or inline).
- **Technical notes**: Core data stays in Supabase; Drive is one-way export. Use the user's OAuth token (or re-auth) to call Drive API `files.create` with `drive.file` scope. Optionally store the resulting Drive file/folder ID in Supabase for "re-export" or link display.

## Import from Google Photos (future)

- **User story**: As a user, I want to import photos from my Google Photos library into an album so I don't have to upload files manually.
- **Flow**:
  - When creating or editing an album, add an "Import from Google Photos" action.
  - Use Google Photos Library API with OAuth scope `https://www.googleapis.com/auth/photoslibrary.readonly`.
  - Let the user select one or more media items; fetch URLs and metadata (e.g. `creationTime`).
  - Map `creationTime` to asset `captured_at` / album event date; create assets (store URL or download and store in Supabase Storage) and `album_photos` rows.
- **Technical notes**: Add `source = 'google_photos'` on assets. Consider downloading and storing images in Supabase Storage for longevity (Photos URLs can expire).

## Photo reuse across spaces (enhancement)

- **Current**: Each album creation uploads new assets and links them to that album.
- **Enhancement**: In "Create album", add an "Add from library" option that lists the user's existing assets (owned by them). User can select existing photos; creating the album only inserts `album_photos` rows (no new upload). Same asset can then appear in multiple albums/spaces with different captions per album.

## Role-based UI restrictions (editor vs viewer)

- **Description**: SpaceMember type with role enum is now in place. Enforce in UI — viewers can't edit/delete, editors can't manage members. Depends on invitation flow.
- **Tasks**:
  - Update UI components to check user role before showing edit/delete actions.
  - Restrict member management UI to owners only.
  - Add appropriate error handling and user feedback for permission-denied cases.

## Invitation flow — add members to a space

- **Description**: Per [PLAN.md](http://PLAN.md): owner adds email from within a space, system sends invite, new user auto-joins as space_member. Requires invite UI, email sending, and accept-invite logic on sign-in.
- **Tasks**:
  - Add invite input UI in space settings.
  - Implement email sending for invitations.
  - Create accept-invite flow on user sign-in.
  - Track invitation status and handle expiration.

## Display cover image on Memory Books page

- **Description**: Space.coverImageId exists in DB and types but MemoryBooks.tsx shows a generic icon. Wire up the cover image display.
- **Tasks**:
  - Update MemoryBooks.tsx to fetch and display Space.coverImageId.
  - Add fallback to generic icon if no cover image is set.
  - Ensure responsive display across device sizes.
