import { IModel } from './common';
import { ApiProduct, ApiOrder } from './api';

// Типы данных для отображения
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
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
  status: 'pending' | 'completed' | 'cancelled';
}

// Интерфейсы моделей
export interface IProductModel extends IModel<Product[]> {
  getProduct(id: string): Product | undefined;
  getProductsByCategory(category: string): Product[];
  transformApiProduct(apiProduct: ApiProduct): Product;
}

export interface IOrderModel extends IModel<Order | null> {
  createOrder(items: CartItem[], payment: Order['payment'], contact: Order['contact']): Promise<Order>;
  transformApiOrder(apiOrder: ApiOrder): Order;
}

export interface ICartModel extends IModel<CartItem[]> {
  addItem(product: Product, quantity?: number): void;
  removeItem(productId: string): void;
  updateQuantity(productId: string, quantity: number): void;
  clear(): void;
  getTotal(): number;
} 