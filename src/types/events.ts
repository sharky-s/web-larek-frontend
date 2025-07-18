import { IProduct, IBuyerData } from './data';

/**
 * Все события приложения
 */
export enum AppEvent {
  ProductsLoaded          = 'products-loaded',
  ShowProduct             = 'show-product',
  CardBuy                 = 'card-buy',
  CardRemove              = 'card-remove',
  CartUpdated             = 'cart-updated',
  CartCleared             = 'cart-cleared',
  CheckoutStart           = 'checkout-start',
  CheckoutStep1Complete   = 'checkout-step1-complete',
  CheckoutStep2Complete   = 'checkout-step2-complete',
  OrderComplete           = 'order-complete',
  BuyerDataCleared        = 'buyer-data-cleared',
}

/**
 * Интерфейс для payload каждого события
 */
export interface EventPayloads {
  [AppEvent.ProductsLoaded]:        [products: IProduct[]];
  [AppEvent.ShowProduct]:           [productId: number];
  [AppEvent.CardBuy]:               [productId: number];
  [AppEvent.CardRemove]:            [productId: number];
  [AppEvent.CartUpdated]:           [items: number[]];
  [AppEvent.CartCleared]:           [];
  [AppEvent.CheckoutStart]:         [];
  [AppEvent.CheckoutStep1Complete]: [step1: Pick<IBuyerData, 'paymentMethod' | 'address'>];
  [AppEvent.CheckoutStep2Complete]: [step2: Pick<IBuyerData, 'email' | 'phone'>];
  [AppEvent.OrderComplete]:         [];
  [AppEvent.BuyerDataCleared]:      [];
}