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
}

export interface Story {
  id: string;
  title: string;
  content: string;
  date?: string;
  createdAt: string;
}
