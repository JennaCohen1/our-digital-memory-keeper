import { useState } from "react";
import { Memory } from "@/lib/types";

const STORAGE_KEY = "memory-book-memories";

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const save = (updated: Memory[]) => {
    setMemories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addMemory = (memory: Omit<Memory, "id" | "createdAt">) => {
    const newMemory: Memory = {
      ...memory,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save([newMemory, ...memories]);
    return newMemory;
  };

  const deleteMemory = (id: string) => {
    save(memories.filter((m) => m.id !== id));
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    save(memories.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  return { memories, addMemory, deleteMemory, updateMemory };
}
