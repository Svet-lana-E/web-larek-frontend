// -----------  карточка---------------

export interface ICard {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
  description: string;
  inBasket: boolean;
} 

export interface ICardCompact {
  title: string;
  price: number | null;
  index?: number;
  id?: string;
}

export interface ICardCatalog {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
}

// -------------- форма заказа-------------
export interface IContacts {
  payment?: string | null;
  address: string;
  phone: string;
  email: string;
}

// ------------ Размещение заказа ----------------

export interface IOrder extends IContacts  {
  payment: string;
  total: number;
  items: string[];
}

export interface ISuccess {
  id: string;
  total: number;

}


// ------------ Ошибки ----------------

export type FormErrors = Partial<Record<keyof IContacts, string>>;

