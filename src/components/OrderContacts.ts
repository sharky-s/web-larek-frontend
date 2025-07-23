import { TContactForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';
import { ensureElement } from '../utils/utils';

export class OrderContacts extends Form<TContactForm> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );

    this.emailInput.addEventListener('input', (e) => {
      this.events.emit('contacts.email:change', {
        field: 'email',
        value: (e.target as HTMLInputElement).value,
      });
    });


    this.phoneInput.addEventListener('input', (e) => {
      this.events.emit('contacts.phone:change', {
        field: 'phone',
        value: (e.target as HTMLInputElement).value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}