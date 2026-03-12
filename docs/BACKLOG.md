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

- **User story**: As a user, I want to import photos from my Google Photos library into an album so I don’t have to upload files manually.
- **Flow**:
  - When creating or editing an album, add an "Import from Google Photos" action.
  - Use Google Photos Library API with OAuth scope `https://www.googleapis.com/auth/photoslibrary.readonly`.
  - Let the user select one or more media items; fetch URLs and metadata (e.g. `creationTime`).
  - Map `creationTime` to asset `captured_at` / album event date; create assets (store URL or download and store in Supabase Storage) and `album_photos` rows.
- **Technical notes**: Add `source = 'google_photos'` on assets. Consider downloading and storing images in Supabase Storage for longevity (Photos URLs can expire).

## Photo reuse across spaces (enhancement)

- **Current**: Each album creation uploads new assets and links them to that album.
- **Enhancement**: In "Create album", add an "Add from library" option that lists the user’s existing assets (owned by them). User can select existing photos; creating the album only inserts `album_photos` rows (no new upload). Same asset can then appear in multiple albums/spaces with different captions per album.
