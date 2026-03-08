/**
 * Gallery Types - TypeScript interfaces for the About page gallery
 */

export interface GallerySlide {
  id: string;
  index: number;
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  accent?: string;
}

export interface GalleryState {
  currentIndex: number;
  direction: number; // -1 for left/prev, 1 for right/next
  isDragging: boolean;
  dragOffset: number;
  isTransitioning: boolean;
}

export interface GalleryContextValue {
  state: GalleryState;
  slides: GallerySlide[];
  goToSlide: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  setIsDragging: (isDragging: boolean) => void;
  setDragOffset: (offset: number) => void;
  totalSlides: number;
}

export interface GalleryItemProps {
  slide: GallerySlide;
  isActive: boolean;
  isAdjacent: boolean;
  direction: number;
  index: number;
}

export interface GalleryContainerProps {
  slides: GallerySlide[];
  children?: React.ReactNode;
}

export interface ProgressIndicatorProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export interface UseGalleryGesturesReturn {
  dragProps: {
    onDragStart: () => void;
    onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => void;
    onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => void;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  point: { x: number; y: number };
}

export interface GalleryTheme {
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}
