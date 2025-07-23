import { IProduct, TCartItem, ICartData } from '../types';
import { IEvents } from './base/events';

export class CartData implements ICartData {
  private _items: TCartItem[] = [];

  constructor(protected events: IEvents) {
    this.events = events;
  }

  get items(): TCartItem[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    if (!this.checkProduct(product.id)) {
      const item: TCartItem = {
        id: product.id,
        title: product.title,
        price: product.price ?? 0
      };
      this._items.push(item);
      this.events.emit('cart:changed', { items: this._items });
    }
  }

  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('cart:changed', { items: this._items });
  }

  clear(): void {
    this._items = [];
    this.events.emit('cart:cleared');
  }

  checkProduct(id: string): boolean {
    return this._items.some(item => item.id === id);
  }

  getItemsId(): string[] {
    return this._items.map(item => item.id);
  }

  getItemsCount(): number {
    return this._items.length;
  }

  getItemsTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getItems(): TCartItem[] {
    return this._items;
  }
}