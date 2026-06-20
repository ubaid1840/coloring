import { useState, useEffect, useCallback } from "react";

export interface GenerationHistoryItem {
  id: string;
  imageUrl: string;
  category: string;
  categoryLabel: string;
  ageGroup: string;
  customPrompt?: string;
  createdAt: string;
}

const STORAGE_KEY = "coloringfunai-generation-history";
const MAX_HISTORY_ITEMS = 10;

// Safely persist history, trimming oldest items if storage quota is exceeded
function safeSetHistory(items: GenerationHistoryItem[]): GenerationHistoryItem[] {
  let toStore = [...items];
  while (toStore.length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      return toStore;
    } catch (error) {
      // QuotaExceededError — drop oldest item and retry
      if (toStore.length === 1) {
        console.error("Cannot store even a single history item:", error);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        return [];
      }
      toStore = toStore.slice(0, -1);
    }
  }
  return toStore;
}

export function useGenerationHistory() {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load generation history:", error);
    }
  }, []);

  const addToHistory = useCallback((item: Omit<GenerationHistoryItem, "id" | "createdAt">) => {
    const newItem: GenerationHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const newHistory = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return safeSetHistory(newHistory);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== id);
      return safeSetHistory(newHistory);
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
