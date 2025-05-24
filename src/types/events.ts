import { Product, CartItem, Order } from './models';

// Типы событий
export enum EventType {
  // События каталога
  CATALOG_LOADED = 'catalog:loaded',
  CATALOG_ERROR = 'catalog:error',
  PRODUCT_SELECTED = 'product:selected',
  
  // События корзины
  CART_UPDATED = 'cart:updated',
  CART_ITEM_ADDED = 'cart:item:added',
  CART_ITEM_REMOVED = 'cart:item:removed',
  CART_ITEM_UPDATED = 'cart:item:updated',
  CART_CLEARED = 'cart:cleared',
  
  // События заказа
  ORDER_CREATED = 'order:created',
  ORDER_UPDATED = 'order:updated',
  ORDER_ERROR = 'order:error',
  
  // События модальных окон
  MODAL_OPENED = 'modal:opened',
  MODAL_CLOSED = 'modal:closed'
}

// Интерфейс для эмиттера событий
export interface IEventEmitter {
  emit<T>(event: EventType, data: T): void;
  on<T>(event: EventType, callback: (data: T) => void): void;
  off<T>(event: EventType, callback: (data: T) => void): void;
}

// Типы данных событий
export interface CatalogLoadedEvent {
  products: Product[];
}

export interface ProductSelectedEvent {
  product: Product;
}

export interface CartUpdatedEvent {
  items: CartItem[];
  total: number;
}

export interface CartItemEvent {
  product: Product;
  quantity?: number;
}

export interface OrderEvent {
  order: Order;
}

export interface ModalEvent {
  modalId: string;
} 