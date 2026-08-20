import { useEffect, useMemo, useState } from 'react';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  page: string;
  position?: string | null;
  sort_order?: number;
  active?: boolean | number;
  created_at?: string;
}

function toMediaHelper(mediaItems: MediaItem[]) {
  return {
    items: mediaItems,
    get: (position: string, fallback: string) => {
      const item = mediaItems.find((m) => m.position === position);
      return item ? item.url : fallback;
    },
    getAll: (position: string) => {
      return mediaItems.filter((m) => m.position === position).map((m) => m.url);
    },
    getAllImages: (fallbackCount: number = 0, fallbacks: string[] = []) => {
      if (mediaItems.length > 0) return mediaItems.map((m) => m.url);
      return fallbacks.slice(0, fallbackCount);
    },
  };
}

export function usePageMedia(pageName: string) {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/media?page=${encodeURIComponent(pageName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.items)) {
          setItems(data.items.filter((item: MediaItem) => item.active !== false && item.active !== 0));
        }
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [pageName]);

  return useMemo(() => toMediaHelper(items), [items]);
}

export function useAllMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.items)) {
          setItems(data.items.filter((item: MediaItem) => item.active !== false && item.active !== 0));
        }
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
