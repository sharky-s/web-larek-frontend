import { IBuyer, IBuyersData, TPaymentForm, TContactForm, TFormData } from '../types';
import { IEvents } from './base/events';

export class BuyersData implements IBuyersData {
	order: TFormData = {
		payment: '',
		email: '',
		phone: '',
		address: '',
	};

	protected _formErrors: Partial<Record<keyof IBuyer, string>> = {};

	constructor(protected events: IEvents) {
		this.events = events;
	}

	setPaymentData(data: Record<keyof TPaymentForm, string>): void {
		Object.assign(this.order, data);
		const dataForValidation: Record<keyof TPaymentForm, string> = {
			payment: this.order.payment,
			address: this.order.address,
		};
		this.events.emit('buyer:validated:payment', {
			valid: this.chekPaymentValidation(dataForValidation),
		});
		this.validateOrder();
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
		this.validateOrder();
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
		};
		this.events.emit('buyer:cleared');
	}

	validateOrder(): boolean {
		const errors: Partial<Record<keyof IBuyer, string>> = {};

		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}

		if (!this.order.address || !this.order.address.trim()) {
			errors.address = 'Укажите адрес доставки';
		}

		if (!this.order.email || !this.order.email.trim()) {
			errors.email = 'Укажите ваш e-mail';
		}

		if (!this.order.phone || !this.order.phone.trim()) {
			errors.phone = 'Укажите номер телефона';
		}

		this._formErrors = errors;

		// Сообщаем всем заинтересованным слушателям о наличии ошибок
		this.events.emit('errors:change', this._formErrors);

		return Object.keys(errors).length === 0;
	}
}
