import { IComponent, IComponentConstructor } from './common';
import { Product, CartItem, Order } from './models';

// Базовые интерфейсы компонентов
export interface IProductCard extends IComponent {
  setProduct(product: Product): void;
  setInCart(inCart: boolean): void;
}

export interface ICatalog extends IComponent {
  setProducts(products: Product[]): void;
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
}

export interface ICart extends IComponent {
  setItems(items: CartItem[]): void;
  setTotal(total: number): void;
}

export interface IOrderForm extends IComponent {
  setOrder(order: Order | null): void;
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
}

export interface IModal extends IComponent {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
}

export interface IProductModal extends IModal {
  setProduct(product: Product): void;
}

// Конструкторы компонентов
export interface IProductCardConstructor extends IComponentConstructor {
  new (): IProductCard;
}

export interface ICatalogConstructor extends IComponentConstructor {
  new (): ICatalog;
}

export interface ICartConstructor extends IComponentConstructor {
  new (): ICart;
}

export interface IOrderFormConstructor extends IComponentConstructor {
  new (): IOrderForm;
}

export interface IModalConstructor extends IComponentConstructor {
  new (): IModal;
}

export interface IProductModalConstructor extends IComponentConstructor {
  new (): IProductModal;
} 