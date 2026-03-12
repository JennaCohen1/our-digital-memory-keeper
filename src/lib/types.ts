export interface Photo {
  id: string;
  imageData: string;
  caption?: string;
}

export interface Album {
  id: string;
  title: string;
  date?: string;
  photos: Photo[];
  createdAt: string;
  spaceId?: string;
  createdBy?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  date?: string;
  createdAt: string;
  spaceId?: string;
  createdBy?: string;
}

export interface Space {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  coverImageId?: string;
}

export interface Asset {
  id: string;
  ownerUserId: string;
  storagePath: string;
  mimeType: string;
  capturedAt?: string;
  eventDate?: string;
  createdAt: string;
  source?: "upload" | "google_photos";
}
