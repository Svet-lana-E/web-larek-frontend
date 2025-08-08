import { Component } from "../base/Component";
import { createElement, ensureElement} from "../../utils/utils";
import { IEvents } from "../base/events";
import { ICardCompact } from "../../types";

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: boolean;
}

export class Basket extends Component<IBasketView>{
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    if(this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = [];
  }

  set items (items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set selected(value: boolean) {
    if(value) {
      this.setDisabled(this._button, false);
    } else {
      this.setDisabled(this._button, true);
    }
  }

  set total(total: number | null) {
      this.setCurrency(this._total, total)
  }
}


export class BasketItem extends Component<ICardCompact> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected itemIndex: HTMLElement;
  protected basketItemDeleteButton: HTMLButtonElement;
  protected events: IEvents
  protected cardId: string;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.cardTitle = ensureElement<HTMLButtonElement>('.card__title', container);
    this.cardPrice = ensureElement<HTMLButtonElement>('.card__price', container);
    this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', container);
    this.basketItemDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this.basketItemDeleteButton.addEventListener('click', () => {
        this.events.emit('basketItem:delete', { data:this.id, obj: this.basketItemDeleteButton })
      })
  }
        
  setDeleteImage() {
    const img = createElement("img") as HTMLImageElement;
    this.basketItemDeleteButton.appendChild(img);
    img.src = 'src/images/trash.svg';
    img.alt = "Удалить из корзины";
  }

  set id(value: string) {
    this.cardId = value;
  }

  get id() {
    return this.cardId;
  }

  set index(value: number) {
    this.itemIndex.textContent = String(value)
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number) {
    this.setCurrency(this.cardPrice, value)
  }
}

