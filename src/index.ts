import './scss/styles.scss';
import { IEvents, EventEmitter } from './components/base/events';
import { ProductsData } from './components/ProductsData';
import { CartData } from './components/CartData';
import { BuyersData } from './components/BuyersData';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Product } from './components/Product';
import { Modal } from './components/Modal';
import { AppApi } from './components/AppApi';
import { ViewManager } from './components/ViewManager';
import { Cart } from './components/Cart';
import { OrderContacts } from './components/OrderContacts';
import { OrderPayment } from './components/OrderPayment';
import { CompletedOrder } from './components/CompletedOrder';
import {
	IProduct,
	IBuyer,
	TCartItem,
	TPaymentForm,
	TContactForm,
	TFormData,
} from './types';

// --- Инициализация базовых сущностей ---
const baseApi = new Api(API_URL);
const api = new AppApi(CDN_URL, baseApi);
const events: IEvents = new EventEmitter();

const originalEmit = events.emit.bind(events);
events.emit = (event, payload) => {
	console.log('Event emitted:', event, payload);
	return originalEmit(event, payload);
};

const productsData = new ProductsData(events);
const cartData = new CartData(events);
const buyersData = new BuyersData(events);

const view = new ViewManager(document.body, events);
const modal = new Modal('#modal-container', events);
const cart = new Cart(cloneTemplate('#basket'), events);
const orderContacts = new OrderContacts(cloneTemplate('#contacts'), events);
const orderPayment = new OrderPayment(cloneTemplate('#order'), events);

// темплейты для данных
const productCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');

// --- Каталог ---
events.on<{ products: IProduct[] }>('products:changed', ({ products }) => {
	const cards = products.map((product) => {
		const card = new Product(cloneTemplate(productCardTemplate), events);
		card.setData(product);
		return card.render();
	});
	view.setProducts(cards);
});

// --- Открытие карточки товара ---
events.on<{ id: string }>('product:open', ({ id }) => {
	const product = productsData.getProduct(id);
	if (!product) return;
	const card = new Product(cloneTemplate(productPreviewTemplate), events);
	card.setData(product);
	// Кнопка в предпросмотре: если товар в корзине — "Удалить", иначе "Купить"
	card.buttonText = cartData.checkProduct(product.id) ? 'Удалить' : 'Купить';
	modal.render({ content: card.render() });
});

// --- Добавление/удаление товара в корзину ---
events.on<{ id: string }>('product:add-to-cart', ({ id }) => {
	const product = productsData.getProduct(id);
	if (!product) return;
	if (cartData.checkProduct(id)) {
		cartData.removeItem(id);
	} else {
		cartData.addItem(product);
	}
});

// --- Обновление корзины ---
events.on<{ items: TCartItem[] }>('cart:changed', ({ items }) => {
	view.setCounter(items.length);
	cart.price = cartData.getItemsTotal();
	const basketItems = items.map((item, index) => {
		// Для корзины используем Product, но только нужные поля
		const basketCard = new Product(
			cloneTemplate(productBasketTemplate),
			events
		);
		basketCard.setData({
			...item,
			description: '',
			image: '',
			category: '',
			price: item.price,
		});
		basketCard.index = index + 1;
		basketCard.buttonText = 'Удалить';
		return basketCard.render();
	});
	cart.setItems(basketItems);
});

events.on('cart:cleared', () => {
	view.setCounter(0);
	cart.price = 0;
	cart.setItems([]);
});

// --- Открытие корзины ---
events.on('cart:open', () => {
	modal.render({ content: cart.containerElement });
});

// --- Открытие формы оплаты ---
events.on('order:open', () => {
	modal.render({ content: orderPayment.render({ address: '', payment: '' }) });
});

// --- Валидация и заполнение формы оплаты ---
events.on<{ field: keyof TPaymentForm; value: string }>(
	'order:address-change',
	({ field, value }) => {
		buyersData.setPaymentData({ [field]: value } as Record<
			keyof TPaymentForm,
			string
		>);
	}
);

events.on<{ payment: string; button: HTMLElement }>(
	'order:payment-change',
	({ payment, button }) => {
		orderPayment.togglePayment(button);
		buyersData.setPaymentData({ payment } as Record<
			keyof TPaymentForm,
			string
		>);
	}
);

events.on<{ valid: boolean }>('buyer:validated:payment', ({ valid }) => {
	orderPayment.toggleSubmitButtonState(valid);
});

events.on('order:submit', () => {
	modal.render({ content: orderContacts.render({ email: '', phone: '' }) });
});

// --- Валидация и заполнение формы контактов ---
events.on<{ field: keyof TContactForm; value: string }>(
	'contacts.email:change',
	({ field, value }) => {
		buyersData.setContactData({ [field]: value } as Record<
			keyof TContactForm,
			string
		>);
	}
);
events.on<{ field: keyof TContactForm; value: string }>(
	'contacts.phone:change',
	({ field, value }) => {
		buyersData.setContactData({ [field]: value } as Record<
			keyof TContactForm,
			string
		>);
	}
);

events.on<{ valid: boolean }>('buyer:validated:contact', ({ valid }) => {
	orderContacts.valid = valid;
});

events.on('contacts:submit', () => {
	// Собираем заказ
	const order: IBuyer = {
		...buyersData.order,
		items: cartData.getItemsId(),
		total: cartData.getItemsTotal(),
	};
	api
		.orderProducts(order)
		.then((result) => {
			cartData.clear();
			buyersData.clear();
			orderContacts.clear();
			orderPayment.resetPayment();
			// Показываем успешный заказ
			const completed = new CompletedOrder(
				cloneTemplate('#success'),
				result.total
			);
			completed.onClose(() => modal.close());
			modal.render({ content: completed.containerElement });
		})
		.catch((error) => {
			// Логируем и показываем ошибку
			console.error('Ошибка при оформлении заказа:', error);
			alert('Произошла ошибка при оформлении заказа. Попробуйте позже.');
		});
});

// --- Модалка: блокировка скролла через ViewManager ---
events.on('modal:open', () => {
	view.locked = true;
});
events.on('modal:close', () => {
	view.locked = false;
});

events.on<Partial<Record<keyof TFormData, string>>>(
	'errors:change',
	(errors) => {
		const contactKeys: Array<keyof TContactForm> = ['email', 'phone'];
		const hasContactErrors = contactKeys.some((key) => key in errors);

		if (hasContactErrors) {
			const firstContactError = contactKeys.find((key) => key in errors);
			orderContacts.errors = errors[firstContactError];
			orderContacts.valid = false;
		} else {
			orderContacts.errors = '';
			orderContacts.valid = true;
		}

		const paymentKeys: Array<keyof TPaymentForm> = ['address', 'payment'];
		const hasPaymentErrors = paymentKeys.some((key) => key in errors);

		if (hasPaymentErrors) {
			const firstPaymentError = paymentKeys.find((key) => key in errors);
			orderPayment.errors = errors[firstPaymentError];
			orderPayment.valid = false;
		} else {
			orderPayment.errors = '';
			orderPayment.valid = true;
		}
	}
);

// --- Загрузка товаров ---
api
	.getProducts()
	.then((products) => {
		productsData.setProducts(products);
	})
	.catch((error) => {
		console.error('Ошибка при загрузке товаров:', error);
		alert('Не удалось загрузить каталог. Попробуйте позже.');
	});
