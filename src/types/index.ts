export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  items: CartItem[];
  total: number;
  payment: {
    type: 'card' | 'cash';
    address: string;
  };
  contact: {
    email: string;
    phone: string;
  };
}

export interface OrderResponse {
  id: string;
  status: 'success' | 'error';
  message: string;
}

export * from './common';
export * from './api';
export * from './models';
export * from './components';
export * from './events';
