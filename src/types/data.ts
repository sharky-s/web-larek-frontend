//Товар в каталоге

export interface IProduct {
  id: number;           // уникальный идентификатор
  name: string;         // название
  description: string;  // описание
  price: number;        // цена в рублях
  category: string;     // категория
  imageUrl: string;     // URL изображения
}

//Данные покупателя для оформления заказа

export interface IBuyerData {
  paymentMethod: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
}