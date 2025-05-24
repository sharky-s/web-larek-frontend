import { IService, IServiceConstructor } from './common';

// Базовые типы для API
export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

// Типы данных, приходящие от API
export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: 'available' | 'unavailable';
}

export interface ApiOrder {
  id: string;
  items: {
    productId: string;
    quantity: number;
  }[];
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

// Интерфейс API-клиента
export interface IApiClient extends IService {
  getProducts(): Promise<ApiResponse<ApiProduct[]>>;
  getProduct(id: string): Promise<ApiResponse<ApiProduct>>;
  createOrder(order: Omit<ApiOrder, 'id' | 'status'>): Promise<ApiResponse<ApiOrder>>;
  getOrder(id: string): Promise<ApiResponse<ApiOrder>>;
}

export interface IApiClientConstructor extends IServiceConstructor {
  new (baseUrl: string): IApiClient;
} 