//Товар в каталоге

export interface IProduct {
  id: string;           // уникальный идентификатор
  description: string;  // описание
  image: string;     // URL изображения
  title: string;         // название
  category: string;     // категория
  price: number | null;        // цена в рублях
}

//Данные покупателя для оформления заказа

export interface IBuyer {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number; // общая сумма заказа
  items: string[]; // список идентификаторов товаров в заказе
}

export interface IProductsData {
  products: IProduct[]; // массив товаров
  preview: string | null; // выбранная карточка товара
  getProduct(id: string): IProduct | undefined; // метод для получения товара по ID
  getProducts() : IProduct[];
  setProducts(products: IProduct[]) : void;
  setPreview(product: IProduct) : void;
}

export interface ICartData {
  items: TCartItem[]; // массив товаров в корзине
  addItem(product: IProduct): void; // метод для добавления товара в корзину
  removeItem(id: string): void; // метод для удаления товара из корзины
  clear(): void; // метод для очистки корзины
  checkProduct(id: string): boolean; // метод для проверки наличия товаров в корзине
  getItemsId(): string[]; // метод для получения всех товаров в корзине
  getItemsCount() : number; // метод для получения количества товаров в корзине
  getItemsTotal() : number; // метод дял получения общей стоимости товаров в корзине
}

export interface IBuyersData{
  order: IBuyer; // данные заказа
  //errors: МОЖЕТ ПОНАДОБИТЬСЯ
  setPaymentData(data: Record<keyof TPaymentForm, string>) : void;
  setContactData(data: Record<keyof TContactForm, string>) : void;
  chekPaymentValidation(data: Record<keyof TPaymentForm, string>): 
  boolean; // метод для проверки валидности формы оплаты
  chekContactValidation(data: Record<keyof TContactForm, string>): boolean; // метод для проверки валидности формы контактов
  clear() : void; // метод очистки данных заказа
}

export type TCartItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TPaymentForm = Pick<IBuyer, 'payment' | 'address'>;

export type TContactForm = Pick<IBuyer, 'email' | 'phone'>;

export type TSuccessStep = Pick<IBuyer, 'total'>;