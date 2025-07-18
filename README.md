# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Интерфейсы данных


**Описание товара**
 
```
export interface IProduct {
  id: number;                 // уникальный идентификатор
  name: string;               // название товара
  description: string;        // подробное описание
  price: number;              // цена в рублях
  category: string;           // категория товара
  imageUrl: string;           // URL изображения
}
```

**Данные покупателя, заполняемые на шаге оформления**

```
export interface IBuyerData {
  paymentMethod: 'card' | 'cash'; // выбранный способ оплаты
  address: string;                           // адрес доставки
  email: string;                             // электронная почта
  phone: string;                             // номер телефона
}
```
## Описание классов

### EventEmitter 

Ответственность: реализует паттерн «Наблюдатель» для обмена событиями между уровнями приложения.

•	Constructor

```
constructor();
```

•	Поля

```
private listeners: Map<string, Set<(...args: any[]) => void>>;
```

•	Методы
```
on(event: string, listener: (...args: any[]) => void): void
  // подписаться на событие

off(event: string, listener: (...args: any[]) => void): void
  // отписаться от события

emit(event: string, ...args: any[]): void
  // уведомить всех подписчиков

onAll(listener: (event: string, ...args: any[]) => void): void
  // подписаться на **все** события

offAll(): void
  // очистить все подписки
```

⸻

### ProductModel

Ответственность: загрузка и хранение данных каталога товаров из API.

•	Constructor
```
constructor(emitter: EventEmitter, apiOrigin: string);
```

•	Поля
```
private emitter: EventEmitter;
private apiOrigin: string;
private products: IProduct[];
```

•	Методы
```
loadAll(): Promise<IProduct[]>
  // запрос GET /products, сохраняет в this.products и emit('products-loaded', products)

getById(id: number): IProduct | undefined
  // возвращает товар по id из this.products
```


⸻

### CartModel

Ответственность: управление списком товаров в корзине (добавление, удаление, очистка).

•	Constructor
```
constructor(emitter: EventEmitter);
```

•	Поля
```
private emitter: EventEmitter;
private items: Set<number>;
```

•	Методы
```
add(productId: number): void
  // добавить в this.items, emit('cart-updated', Array.from(this.items))

remove(productId: number): void
  // удалить из this.items, emit('cart-updated', ...)

clear(): void
  // очистить корзину, emit('cart-cleared')

getItems(): number[]
  // вернуть массив id из this.items
```


⸻

### BuyerDataModel

Ответственность: хранение и валидация данных покупателя на шагах оформления.

•	Constructor
```
constructor(emitter: EventEmitter);
```

•	Поля
```
private emitter: EventEmitter;
private paymentMethod?: IBuyerData['paymentMethod'];
private address?: string;
private email?: string;
private phone?: string;
```

•	Методы
```
setStep1(paymentMethod: IBuyerData['paymentMethod'], address: string): void
  // сохраняет, emit('checkout-step1-complete', { paymentMethod, address })

setStep2(email: string, phone: string): void
  // сохраняет, emit('checkout-step2-complete', { email, phone })

validateStep1(): boolean
  // проверяет, что paymentMethod и address заданы

validateStep2(): boolean
  // проверяет, что email и phone не пустые

clear(): void
  // сброс всех полей, emit('buyer-data-cleared')
```


⸻

### CatalogController

Ответственность: связывает ProductModel и представления каталога (CatalogPage, ProductCard).

•	Constructor
```
constructor(
  emitter: EventEmitter,
  model: ProductModel,
  view: CatalogPage
);
```

•	Поля
```
private emitter: EventEmitter;
private model: ProductModel;
private view: CatalogPage;
```

•	Методы
```
init(): void
  // подписка на 'products-loaded', вызов model.loadAll()

private onProductClick(productId: number): void
  // emit('show-product', productId)
```


⸻

### CartController

Ответственность: обрабатывает действия над корзиной и управляет CartModel и CartModal.

•	Constructor
```
constructor(
  emitter: EventEmitter,
  model: CartModel,
  view: CartModal
);
```

•	Поля
```
private emitter: EventEmitter;
private model: CartModel;
private view: CartModal;
```

•	Методы
```
init(): void
  // подписка на 'card-buy', 'card-remove', 'cart-updated', 'checkout-start'

private onBuy(productId: number): void
  // model.add(productId)

private onRemove(productId: number): void
  // model.remove(productId)

private onCheckout(): void
  // emit('checkout-start')
```


⸻

### CheckoutController

Ответственность: управляет формами оформления (шаг 1 и шаг 2) через BuyerDataModel.

•	Constructor
```
constructor(
  emitter: EventEmitter,
  buyerModel: BuyerDataModel,
  step1View: CheckoutStep1,
  step2View: CheckoutStep2
);
```

•	Поля
```
private emitter: EventEmitter;
private buyerModel: BuyerDataModel;
private step1View: CheckoutStep1;
private step2View: CheckoutStep2;
```

•	Методы
```
init(): void
  // подписка на 'checkout-start', 'checkout-step1-complete', 'checkout-step2-complete'

private handleStep1(data: { paymentMethod: string; address: string }): void
  // buyerModel.setStep1(...)

private handleStep2(data: { email: string; phone: string }): void
  // buyerModel.setStep2(...); emit('order-complete')

```
