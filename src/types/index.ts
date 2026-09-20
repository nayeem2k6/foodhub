export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  createdAt: Date;
}

export interface Restaurant {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  location: string;
  category: string;
  cuisine: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: string;
  restaurantId: string;
  createdAt: Date;
}

export interface Booking {
  _id: string;
  userId: string;
  restaurantId: string;
  quantity: number;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}