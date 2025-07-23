import { TPaymentForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';
import { ensureElement } from '../utils/utils';

export class OrderPayment extends Form<TPaymentForm> {
  private buttonOnline: HTMLButtonElement;
  private buttonCash: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    this.buttonOnline = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container
    );

    this.buttonCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container
    );

    this.submitButton = ensureElement<HTMLButtonElement>(
      '.order__button',
      container
    );

    this.buttonOnline.addEventListener('click', () => {
      this.events.emit('order:payment-change', {
        payment: this.buttonOnline.name,
        button: this.buttonOnline,
      });
    });

    this.buttonCash.addEventListener('click', () => {
      this.events.emit('order:payment-change', {
        payment: this.buttonCash.name,
        button: this.buttonCash,
      });
    });

    this.addressInput.addEventListener('input', (e) => {
      this.events.emit('order:address-change', {
        field: 'address',
        value: (e.target as HTMLInputElement).value,
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  toggleSubmitButtonState(valid: boolean): void {
    this.valid = valid;
    if (valid) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }

  togglePayment(button: HTMLElement): void {
    this.resetPayment();
    button.classList.add('button_alt-active');
  }

  resetPayment(): void {
    this.buttonOnline.classList.remove('button_alt-active');
    this.buttonCash.classList.remove('button_alt-active');
  }
}