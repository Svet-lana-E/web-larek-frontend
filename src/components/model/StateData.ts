import { FormErrors, ICard, ICardCompact, IContacts} from "../../types";
import { IEvents } from "../base/events";


export class StateData {
 payment: string | null;
 total: number | null;
 items: string[];
 address: string;
 phone: string;
 email: string;
protected itemsSelected?: ICardCompact[];
protected formErrors?: FormErrors;
protected events: IEvents;

constructor(events: IEvents) {
  this.events = events;
}

setItemsSelected (cards: ICard[]) {
  this.itemsSelected = cards.filter(card => card.inBasket === true);
  this.items = this.itemsSelected.map(item => item.id)
}

setTotalPrice() {
  if(this.itemsSelected.length === 0) {
    this.total = 0;
    } else {
    this.total = this.itemsSelected.map(item => item.price).reduce((acc, item) => {return acc + item});
  }
}

get counter () {
  return this.itemsSelected.length;
}

get _items() {
  return this.items
}

get _selected() {
  return this.itemsSelected;
}


  get _total(): number {
    return this.total;
  }

   setContacts(field: keyof IContacts, value: string) {
      this[field] = value;
      if (this.validateContacts()) {
        this.events.emit('order:ready');
      }
    }

  
  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if (!this.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    this.formErrors = errors;
    if(errors.address || errors.email) {
      this.events.emit('formErrors:order.change', this.formErrors);
    } else {
      this.events.emit('formErrors:change', this.formErrors);
    }
    return Object.keys(errors).length === 0;
  }

  deleteErrors() {
    this.formErrors = {}
  }

  deleteContacts() {
    this.address = '';
    this.phone = '';
    this.email = '';
    this.payment = '';
  }
}



