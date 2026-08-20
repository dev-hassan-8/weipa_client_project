import React from 'react';
import GalleryClient from './gallery/GalleryClient';
import { usePageMedia } from '@/lib/usePageMedia';

export default function GalleryPage() {
  const media = usePageMedia('gallery');
  return <GalleryClient mediaItems={media.items} />;
}
