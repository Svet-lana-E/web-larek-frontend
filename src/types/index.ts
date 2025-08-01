interface ICard<T> {
  id: string;
  title: string;
  category?: string;
  image?: string;
  price: number;
  description?: string;
  inBasket?: boolean;
}

interface IOrderForm {
  address: string;
}

interface IContactsForm {
  phone: string;
  email: string;
}

type IContacts = IContactsForm & IOrderForm

interface IOrder extends IContacts  {
  payment: 'online' | 'cash';
  total: number;
  items: string[];
}

interface ISuccess {
    id: string;
    total: number;
}

type CardCompact = {
  title: HTMLElement,
  price: HTMLElement,
  inBasket: boolean
}

type CardFull = {
  title: HTMLElement;
  category: HTMLElement;
  image: HTMLElement;
  price: HTMLElement;
  description: HTMLElement;
}

type CardCatalog = {
  title: HTMLElement;
  category: HTMLElement;
  image: HTMLElement;
  price: HTMLElement;
}

interface ICatalog {
    catalog: HTMLElement[];
}

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

interface IAppApi {
    getItemList: () => Promise<ICard<CardFull>[]>;
    getItem: (id: string) => Promise<ICard<CardFull>>;
    placeOrder: (order: IOrder) => Promise<ISuccess>;
}

type ServerResponse<T> = {
  total: number;
  items?: T[];
}

interface IFormState {
    valid: boolean;
    errors: string[];
}

interface IModalData {
    content: HTMLElement;
}

interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}