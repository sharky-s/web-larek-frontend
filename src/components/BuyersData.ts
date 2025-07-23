import { IBuyer, IBuyersData, TPaymentForm, TContactForm } from '../types';
import { IEvents } from './base/events';

export class BuyersData implements IBuyersData {
  order: IBuyer = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: [],
  };

  constructor(protected events: IEvents) {
    this.events = events;
  }

  setPaymentData(data: Record<keyof TPaymentForm, string>): void {
    Object.assign(this.order, data);

    this.events.emit('buyer:validated:payment', {
      valid: this.chekPaymentValidation(this.order),
    });
  }

  setContactData(data: Record<keyof TContactForm, string>): void {
    Object.assign(this.order, data);
    // creatge new object from this.order containing keys of TContactForm
    const dataForValidation: Record<keyof TContactForm, string> = {
      email: this.order.email,
      phone: this.order.phone,
    };
    this.events.emit('buyer:validated:contact', {
      valid: this.chekContactValidation(dataForValidation),
    });
  }

  chekPaymentValidation(data: Record<keyof TPaymentForm, string>): boolean {
    const { payment, address } = data;
    return Boolean(payment && address?.trim());
  }

  chekContactValidation(data: Record<keyof TContactForm, string>): boolean {
    const { email, phone } = data;
    return Boolean(email?.trim() && phone?.trim());
  }

  clear(): void {
    this.order = {
      payment: '',
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: [],
    };
    this.events.emit('buyer:cleared');
  }
}