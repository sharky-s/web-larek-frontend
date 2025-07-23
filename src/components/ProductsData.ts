import { IProduct, IProductsData } from '../types';
import { IEvents } from './base/events';

export class ProductsData implements IProductsData {
  _products: IProduct[] = [];
  _preview: string | null = null;

  constructor(protected events: IEvents) {
    this.events = events;
  }

  get products(): IProduct[] {
    return this._products;
  }

  get preview(): string | null {
    return this._preview;
  }

  setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit('products:changed', { products });
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  setPreview(product: IProduct): void {
    this._preview = product.id;
    this.events.emit('products:preview', { product });
  }

  getPreview(): IProduct | undefined {
    return this._products.find(product => product.id === this._preview);
  }
}