import { ICard, IOrder, ISuccess} from "../../types";
import { Api } from "../base/api";

export interface IAppApi {
    getItemList: () => Promise<ICard[]>;
    getItem: (id: string) => Promise<ICard>;
    placeOrder: (order: IOrder) => Promise<ISuccess>;
}

export type ServerResponse<T> = {
  total: number;
  items?: T[];
}

export class AppApi extends Api implements IAppApi{
  
  constructor(readonly cnd: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cnd = cnd;
  }

  getItemList(): Promise<ICard[]> {
    return this.get(`/product/`).then((data: ServerResponse<ICard>) =>
      data.items.map((item) => ({
          ...item,
          image: this.cnd + item.image
        }))
      )
  };

  getItem(id: string): Promise<ICard> {
    return this.get(`/product/${id}`)
      .then((item: ICard) => ({
        ...item,
        image: this.cnd + item.image
      })
      )
  };

  placeOrder(order: IOrder): Promise<ISuccess> {
    return this.post(`/order`, order).then(
      (data: Promise<ISuccess>) => data
    );
  }; 
}