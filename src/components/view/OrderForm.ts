import { IContacts} from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";

export class OrderForm extends Form<IContacts> {
  protected payment: 'online' | 'cash' | '';
  protected cashButton: HTMLButtonElement;
  protected cardButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected addressError: HTMLElement;


  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);
    this.addressError = ensureElement<HTMLElement>('.form__errors', this.container)

    this.cardButton.addEventListener('click', () => this.events.emit('order.payment:change', {field: 'payment', value: 'online'}));
    this.cashButton.addEventListener('click', () => this.events.emit('order.payment:change', {field: 'payment', value: 'cash'}));
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  setActiveButton(value: string) {
    if (value === "cash") {
      this.cardButton.classList.remove('button_alt-active')
      this.cashButton.classList.add('button_alt-active');
    } else if(value === "online") {
      this.cashButton.classList.remove('button_alt-active')
      this.cardButton.classList.add('button_alt-active')
    } else {
      this.cashButton.classList.remove('button_alt-active')
      this.cardButton.classList.remove('button_alt-active')
    }
  }
}




