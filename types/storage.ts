
export interface StorageItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'file' | 'link' | 'image';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  emoji?: string;
  color?: string;
  isFavorite: boolean;
  size?: number; // for files
  url?: string; // for links and files
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  itemCount: number;
}

export interface StorageStats {
  totalItems: number;
  totalSize: number;
  categories: Category[];
  recentItems: StorageItem[];
}
