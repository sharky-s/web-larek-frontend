import { IProduct, IBuyer } from '../types';
import { ApiListResponse, Api } from './base/api';

export class AppApi {
	private readonly _baseApi: Api;
	private readonly _cdnUrl: string;

	constructor(cdnUrl: string, baseApi: Api) {
		this._baseApi = baseApi;
		this._cdnUrl = cdnUrl;
	}

  getProducts(): Promise<IProduct[]> {
    return this._baseApi.get(`/product`)
      .then((response) => (response as ApiListResponse<IProduct>).items.map((product) => ({
        ...product,
        image: this._cdnUrl + product.image,
      })));
  }

  getProduct(id: string): Promise<IProduct> {
    return this._baseApi.get(`/product/${id}`)
      .then((response) => {
        const product = response as IProduct;
        return {
          ...product,
          image: this._cdnUrl + product.image,
        };
      });
  }

	orderProducts(order: IBuyer): Promise<IBuyer> {
		return this._baseApi
			.post('/order', order) as Promise<IBuyer>;
	}
}