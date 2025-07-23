import { IProduct } from '../types';
import { categories } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Product {
  protected container: HTMLElement;
  protected titleElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement?: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  protected idValue: string = '';

  constructor(container: HTMLElement, protected events: IEvents) {
    this.container = container;
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.categoryElement = container.querySelector('.card__category');
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    this.imageElement = container.querySelector('.card__image');
    this.descriptionElement = container.querySelector('.card__text') || undefined;
    this.buttonElement = container.querySelector('.card__button');
    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', this.handleButtonClick.bind(this));
    }
    this.container.addEventListener('click', this.handleCardClick.bind(this));
  }

  set id(value: string) {
    this.idValue = value;
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.idValue;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set category(value: string) {
    if (!this.categoryElement) return;
    this.categoryElement.textContent = value;
    const categoryClass = categories.get(value);
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    if (!this.imageElement) return;
    this.imageElement.src = value;
    this.imageElement.alt = this.titleElement.textContent || '';
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (value == null) {
      this.priceElement.textContent = 'Бесценно';
      if (this.buttonElement) {

        this.buttonElement.disabled = true;
        this.buttonElement.textContent = 'Нельзя купить';
      }
    } else {
      this.priceElement.textContent = `${value} синапсов`;
      if (this.buttonElement) {
        this.buttonElement.disabled = false;
        this.buttonElement.textContent = 'Купить';
      }
    }
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  setData(product: IProduct): void {
    this.id = product.id;
    this.title = product.title;
    this.category = product.category;
    this.image = product.image;
    this.description = product.description;
    this.price = product.price;
  }

  addToCart(): void {
    this.buttonText = 'Удалить';
  }

  removeFromCart(): void {
    this.buttonText = 'Купить';
  }

  render(): HTMLElement {
    return this.container;
  }

  private handleButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.events.emit('product:add-to-cart', { id: this.id });
    this.events.emit('product:open', { id: this.id });
  }

  private handleCardClick(): void {
    this.events.emit('product:open', { id: this.id });
  }
}