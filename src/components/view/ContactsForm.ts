import { IContacts} from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";


export class ContactsForm extends Form<IContacts> {
  protected phoneInput: HTMLInputElement;
  protected emailInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.phoneInput = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
    this.emailInput = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

}