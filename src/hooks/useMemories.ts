import { useState } from "react";
import { Album, Story } from "@/lib/types";

const ALBUMS_KEY = "memory-book-albums";
const STORIES_KEY = "memory-book-stories";

function load<T>(key: string): T[] {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>(() => load(ALBUMS_KEY));

  const addAlbum = (album: Omit<Album, "id" | "createdAt">) => {
    const newAlbum: Album = {
      ...album,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newAlbum, ...albums];
    setAlbums(updated);
    save(ALBUMS_KEY, updated);
    return newAlbum;
  };

  const deleteAlbum = (id: string) => {
    const updated = albums.filter((a) => a.id !== id);
    setAlbums(updated);
    save(ALBUMS_KEY, updated);
  };

  return { albums, addAlbum, deleteAlbum };
}

export function useStories() {
  const [stories, setStories] = useState<Story[]>(() => load(STORIES_KEY));

  const addStory = (story: Omit<Story, "id" | "createdAt">) => {
    const newStory: Story = {
      ...story,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    save(STORIES_KEY, updated);
    return newStory;
  };

  const deleteStory = (id: string) => {
    const updated = stories.filter((s) => s.id !== id);
    setStories(updated);
    save(STORIES_KEY, updated);
  };

  return { stories, addStory, deleteStory };
}
