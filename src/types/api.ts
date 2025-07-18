import { IProduct } from './data';

/**
 * Клиент для работы с сервером API
 */
export interface IApiClient {
  /**
   * Получить полный каталог товаров
   * GET /products
   */
  getProducts(): Promise<IProduct[]>;

  /**
   * Получить детальную информацию о товаре
   * GET /products/:id
   * @param id — идентификатор товара
   */
  getProductById(id: number): Promise<IProduct>;
}