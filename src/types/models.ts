import { IProduct, IBuyerData } from './data';

/**
 * Интерфейс ProductModel
 */
export interface IProductModel {
  /**
   * Загрузить все товары
   */
  loadAll(): Promise<IProduct[]>;

  /**
   * Получить товар по id из кэша
   */
  getById(id: number): IProduct | undefined;
}

/**
 * Интерфейс CartModel
 */
export interface ICartModel {
  /**
   * Добавить товар в корзину
   */
  add(productId: number): void;

  /**
   * Удалить товар из корзины
   */
  remove(productId: number): void;

  /**
   * Очистить корзину
   */
  clear(): void;

  /**
   * Получить все id из корзины
   */
  getItems(): number[];
}

/**
 * Интерфейс BuyerDataModel
 */
export interface IBuyerDataModel {
  /**
   * Установить данные шага 1 (оплата + адрес)
   */
  setStep1(
    paymentMethod: IBuyerData['paymentMethod'],
    address: string
  ): void;

  /**
   * Установить данные шага 2 (почта + телефон)
   */
  setStep2(email: string, phone: string): void;

  /**
   * Проверить, что данные шага 1 валидны
   */
  validateStep1(): boolean;

  /**
   * Проверить, что данные шага 2 валидны
   */
  validateStep2(): boolean;

  /**
   * Сбросить все поля модели
   */
  clear(): void;
}