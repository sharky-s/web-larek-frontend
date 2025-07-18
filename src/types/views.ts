import { IProduct, IBuyerData } from './data';

/**
 * Отображение списка товаров
 */
export interface ICatalogPage {
  /**
   * Рендерить список
   */
  render(products: IProduct[]): void;

  /**
   * Навесить обработчик клика на карточку
   */
  bindProductClick(handler: (id: number) => void): void;
}

/**
 * Отображение одной карточки товара
 */
export interface IProductCard {
  render(product: IProduct, inCart: boolean): void;
  bindBuy(handler: (id: number) => void): void;
  bindRemove(handler: (id: number) => void): void;
}

/**
 * Отображение корзины
 */
export interface ICartModal {
  render(items: IProduct[]): void;
  bindCheckout(handler: () => void): void;
  bindRemove(handler: (id: number) => void): void;
}

/**
 * Первый шаг оформления заказа
 */
export interface ICheckoutStep1 {
  render(data?: {
    paymentMethod?: IBuyerData['paymentMethod'];
    address?: string;
  }): void;
  bindNext(
    handler: (data: {
      paymentMethod: IBuyerData['paymentMethod'];
      address: string;
    }) => void
  ): void;
}

/**
 * Второй шаг оформления заказа
 */
export interface ICheckoutStep2 {
  render(data?: {
    email?: string;
    phone?: string;
  }): void;
  bindNext(
    handler: (data: { email: string; phone: string }) => void
  ): void;
}