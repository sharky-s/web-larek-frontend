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

## Архитектура проекта

Проект реализован с использованием паттерна MVP (Model-View-Presenter) с элементами Event Bus для коммуникации между компонентами.

### Структура проекта

```
src/
├── components/         # Компоненты представления (View)
│   ├── common/        # Базовые компоненты
│   ├── layout/        # Компоненты макета
│   └── features/      # Компоненты для конкретных функций
├── models/            # Модели данных (Model)
├── presenters/        # Презентеры (Presenter)
├── services/          # Сервисы для работы с API
├── store/             # Управление состоянием
├── utils/             # Вспомогательные функции
└── types/             # TypeScript типы
```

### Базовые компоненты

#### Component (src/components/common/Component.ts)
Базовый абстрактный класс для всех компонентов представления.
```typescript
interface IComponent {
  element: HTMLElement;
  render(): void;
  destroy(): void;
}
```

#### ApiService (src/services/ApiService.ts)
Базовый класс для работы с API, реализующий интерфейс IApiClient.
```typescript
interface IApiClient {
  getProducts(): Promise<ApiProduct[]>;
  getProduct(id: string): Promise<ApiProduct>;
  createOrder(order: Omit<ApiOrder, 'id' | 'status'>): Promise<ApiOrder>;
  getOrder(id: string): Promise<ApiOrder>;
}
```

#### Store (src/store/Store.ts)
Централизованное хранилище состояния приложения, реализующее паттерн Observer.
```typescript
class Store {
  private state: AppState;
  private listeners: Listener[];
  
  getState(): AppState;
  setState(newState: Partial<AppState>): void;
  subscribe(listener: Listener): () => void;
}
```

### Модели данных

#### ProductModel
Трансформирует данные продуктов между API и приложением.
```typescript
interface IProductModel {
  transformApiProduct(apiProduct: ApiProduct): Product;
  transformApiProducts(apiProducts: ApiProduct[]): Product[];
}
```

#### OrderModel
Управляет данными заказов и их трансформацией.
```typescript
interface IOrderModel {
  transformApiOrder(apiOrder: ApiOrder): Order;
  transformOrderToApi(order: Omit<Order, 'id' | 'status'>): Omit<ApiOrder, 'id' | 'status'>;
}
```

#### CartModel
Управляет состоянием корзины.
```typescript
interface ICartModel {
  items: CartItem[];
  addItem(product: Product): void;
  removeItem(productId: string): void;
  updateQuantity(productId: string, quantity: number): void;
  clear(): void;
  getTotal(): number;
}
```

### Компоненты представления

#### ProductCard
Отображает карточку товара.
```typescript
interface IProductCard {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  isInCart: boolean;
}
```

#### Catalog
Отображает каталог товаров.
```typescript
interface ICatalog {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  getCartItems: () => CartItem[];
}
```

#### Cart
Отображает корзину и управляет ею.
```typescript
interface ICart {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}
```

### Типы данных

#### API типы
```typescript
interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: 'available' | 'unavailable';
}

interface ApiOrder {
  id: string;
  items: { productId: string; quantity: number; }[];
  total: number;
  payment: { type: 'card' | 'cash'; address: string; };
  contact: { email: string; phone: string; };
  status: 'pending' | 'completed' | 'cancelled';
}
```

#### Модели данных
```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  payment: { type: 'card' | 'cash'; address: string; };
  contact: { email: string; phone: string; };
  status: 'pending' | 'completed' | 'cancelled';
}
```

### Взаимодействие компонентов

#### Поток данных

1. **Просмотр каталога:**
   - Presenter запрашивает данные через ApiService
   - Данные трансформируются через ProductModel
   - Store обновляет состояние
   - Catalog компонент обновляет отображение

2. **Работа с корзиной:**
   - Пользователь взаимодействует с ProductCard
   - CartModel обновляет состояние корзины
   - Store уведомляет подписчиков
   - Cart компонент обновляет отображение

3. **Оформление заказа:**
   - OrderForm собирает данные
   - OrderModel трансформирует данные
   - ApiService отправляет заказ
   - Store очищает корзину при успехе

#### События

Приложение использует Event Bus для коммуникации между компонентами:

```typescript
enum EventType {
  CATALOG_LOADED = 'catalog:loaded',
  PRODUCT_SELECTED = 'product:selected',
  CART_UPDATED = 'cart:updated',
  ORDER_SUBMITTED = 'order:submitted',
  // ...
}
```

### Паттерны проектирования

1. **MVP (Model-View-Presenter)**
   - Model: модели данных и бизнес-логика
   - View: компоненты представления
   - Presenter: обработка пользовательского ввода и обновление представления

2. **Observer**
   - Store уведомляет компоненты об изменениях состояния
   - Компоненты подписываются на изменения через Store.subscribe()

3. **Factory**
   - Создание компонентов через фабричные методы
   - Инкапсуляция логики создания объектов

4. **Adapter**
   - Трансформация данных между API и моделями
   - Абстрагирование работы с API
