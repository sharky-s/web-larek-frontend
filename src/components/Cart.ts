import { createElement, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Cart {
  private readonly container: HTMLElement;
  private readonly catalog: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly orderButton: HTMLButtonElement;
  private readonly events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    this.catalog = ensureElement<HTMLElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });

    this.setItems([]); // Начальное состояние
  }

  private updateButtonState(): void {
    const totalPrice = parseFloat(this.priceElement.textContent || '0');
    if (totalPrice > 0) {
      this.orderButton.removeAttribute('disabled');
    } else {
      this.orderButton.setAttribute('disabled', 'disabled');
    }
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
    this.updateButtonState();
  }

  setItems(items: HTMLElement[]): void {
    if (items.length > 0) {
      this.catalog.replaceChildren(...items);
    } else {
      this.catalog.replaceChildren(
        createElement('p', { textContent: 'Корзина пуста' })
      );
    }
    this.updateButtonState();
  }
}