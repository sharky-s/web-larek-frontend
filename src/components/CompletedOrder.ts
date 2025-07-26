import { ensureElement } from '../utils/utils';

export class CompletedOrder {
  private readonly container: HTMLElement;
  private readonly closeButton: HTMLElement;
  private readonly description: HTMLElement;

  constructor(container: HTMLElement, total: number) {
    this.container = container;

    this.description = ensureElement<HTMLElement>(
      '.order-success__description',
      container
    );

    this.closeButton = ensureElement<HTMLElement>(
      '.order-success__close',
      container
    );

    this.setTotal(total);
  }

  private setText(element: HTMLElement, value: string): void {
    if (element) {
      element.textContent = value;
    }
  }

  get containerElement(): HTMLElement {
    return this.container;
  }

  setTotal(total: number): void {
    this.setText(this.description, `Ваш заказ ${total} синапсов`);
  }

  onClose(handler: () => void): void {
    this.closeButton.addEventListener('click', handler);

  }
}