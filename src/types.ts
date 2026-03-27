export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  name?: string;
  timestamp: number;
}

export type ElementType = 'flower' | 'leaf' | 'stem' | 'image';

export interface CanvasElement {
  id: string;
  type: ElementType;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill?: string;
  imageUrl?: string;
  zIndex: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artist: string;
  tags: string[];
}

export interface SpeciesCase {
  id: number;
  title: string;
  category: string;
  image: string;
  stats: { stability: string; growth: string; energy: string };
  description: string;
  technicalData?: {
    dnaResonance: string;
    neuralComplexity: string;
    quantumState: string;
    originSector: string;
  };
}
