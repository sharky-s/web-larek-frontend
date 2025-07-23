import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IModalData {
  content: HTMLElement;
}

export class Modal {
  protected modal: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected content: HTMLElement;
  protected events: IEvents;

  constructor(selector: string, events: IEvents) {
    this.modal = ensureElement<HTMLElement>(selector);
    this.events = events;

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.modal);
    this.content = ensureElement<HTMLElement>('.modal__content', this.modal);

    this.closeButton.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', () => this.close());
    this.content.addEventListener('click', (e) => e.stopPropagation());

    this.handleEscUp = this.handleEscUp.bind(this);
  }

  setContent(content: HTMLElement | null): void {
    if (content === null) {
      this.content.innerHTML = '';
    } else {
      this.content.replaceChildren(content);
    }
  }

  open(): void {
    this.modal.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEscUp);
    this.events.emit('modal:open');
  }

  close(): void {
    this.modal.classList.remove('modal_active');
    document.removeEventListener('keyup', this.handleEscUp);
    this.setContent(null);
    this.events.emit('modal:close');
  }

  private handleEscUp(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  render(data: IModalData): HTMLElement {
    this.setContent(data.content);
    this.open();
    return this.modal;
  }
}