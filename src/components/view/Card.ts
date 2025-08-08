import { ICard, ICardCatalog} from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Card<T> extends Component<T>{
  protected cardId: string;
  protected basketStatus: boolean;
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.cardCategory = ensureElement<HTMLElement>('.card__category', container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', container);
  }

  set id (value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  get title(): string {
    return this.cardTitle.textContent || '';
  }

  set price(price: number | null) {
    if (!price) {
      this.setText(this.cardPrice, 'Бесценно');
    } else {
      this.setCurrency(this.cardPrice, price)
      }
  };

  get price(): number {
    return Number(this.cardPrice.textContent.split(' ')[0]);
  }

  set inBasket(value: boolean) {
      this.basketStatus = value;
  }

  get inBasket(): boolean {
    return this.basketStatus;
  }

  set image(value: string) {
    this.setImage(this.cardImage, value, this.title)
  }

  set category(value: string) {
    if(this.cardCategory.classList.length > 0){      
      
      const categoryColor = 'card__category_';
      this.cardCategory.classList.forEach(item => 
        item.includes(categoryColor) ? this.cardCategory.classList.remove(item) : this.cardCategory.classList
      )
    }
    this.setText(this.cardCategory, value);
    const categoryType: {value: string, name: string}[] = [
      {value: 'софт-скил', name:'soft'},
      {value: 'хард-скил', name:'hard'},
      {value: 'другое', name:'other'},
      {value: 'кнопка', name:'button'},
      {value: 'дополнительное', name:'additional'},
    ]
    const categoryName = categoryType.find(object => object.value === value)
    this.cardCategory.classList.add(`card__category_${categoryName.name}`)
  }

  get category(): string {
    return this.cardCategory.textContent || '';
  }
}

export class CardGallery extends Card<ICardCatalog>  {

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this.container.addEventListener('click', () => {
      this.events.emit('cardPreview:open', {id: this.id})
    });
  }
}


export class CardPreview extends Card<ICard>  {
  protected cardDescription: HTMLElement;
  protected cardBasketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this.cardDescription = ensureElement<HTMLElement>('.card__text', container);
    this.cardBasketButton = ensureElement<HTMLButtonElement>('.button', container);

    this.cardBasketButton.addEventListener('click', () => {
      this.events.emit('card:basket', {id: this.id, obj: this.cardBasketButton })
      })
    }

  set description (value: string) {
    this.cardDescription.textContent = value;
  }

  setCardBasketButton() {
    if (!this.price) {
      this.setText(this.cardBasketButton, 'Недоступно');
      this.setDisabled(this.cardBasketButton, true)
    } else {
      this.setDisabled(this.cardBasketButton, false)
      if(this.inBasket) {
        this.setText(this.cardBasketButton, 'Удалить из корзины');
      } else {
        this.setText(this.cardBasketButton, 'Купить');
      }
    }
  }
}

