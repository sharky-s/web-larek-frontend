import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class ViewManager {
  private readonly container: HTMLElement;
  private readonly cartCounter: HTMLElement;
  private readonly productsContainer: HTMLElement;
  private readonly cartButton: HTMLElement;
  private readonly wrapper: HTMLElement;
  private readonly events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    this.cartCounter = ensureElement<HTMLElement>(
      '.header__basket-counter',
      container
    );

    this.productsContainer = ensureElement<HTMLElement>(
      '.gallery',
      container
    );

    this.cartButton = ensureElement<HTMLElement>(
      '.header__basket',
      container
    );

    this.wrapper = ensureElement<HTMLElement>(
      '.page__wrapper',
      container
    );

    this.cartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }

  setCounter(value: number): void {
    this.cartCounter.textContent = String(value);
  }

  setProducts(items: HTMLElement[]): void {
    this.productsContainer.replaceChildren(...items);
  }

  set locked(value: boolean) {
    if (value) {
      this.wrapper.classList.add('page__wrapper_locked');
    } else {
      this.wrapper.classList.remove('page__wrapper_locked');
    }
  }
}