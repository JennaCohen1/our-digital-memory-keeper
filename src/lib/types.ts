export interface Memory {
  id: string;
  type: "photo" | "story";
  title: string;
  content: string; // story text or photo caption
  imageData?: string; // base64 for photos
  date?: string; // when the memory happened
  createdAt: string;
}
