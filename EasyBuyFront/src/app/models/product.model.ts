export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category?: string;
  categoryId?: number;
  categoryName?: string;
  image?: string;
  imageUrl?: string;
  badge?: string;
  description: string;
  inStock?: boolean;
  stock?: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  count?: number;
  image?: string;
  description?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
