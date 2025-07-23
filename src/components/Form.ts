import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Form<T extends Record<string, string>> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: IEvents
  ) {
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type=submit]',
      container
    );
    this.errorsContainer = ensureElement<HTMLElement>(
      '.form__errors',
      container
    );

    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.name) {
        const field = target.name as keyof T;
        const value = target.value;
        this.onChange(field, value);
      }
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set valid(isValid: boolean) {
    this.submitButton.disabled = !isValid;
  }

  set errors(message: string) {
    this.errorsContainer.textContent = message;
  }

  protected onChange(field: keyof T, value: string): void {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  render(state: Partial<T>): HTMLFormElement {
    Object.entries(state).forEach(([name, value]) => {
      const input = this.container.querySelector<HTMLInputElement>(
        `[name="${name}"]`
      );
      if (input) {
        input.value = String(value ?? '');
      }
    });

    return this.container;
  }
}