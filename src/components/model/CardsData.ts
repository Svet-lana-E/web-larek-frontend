import { ICard} from "../../types";
import { IEvents } from "../base/events";

export class CardsData {
  protected _cards: ICard[];
  protected _preview: string | null;
  protected events: IEvents;
 
  constructor(events: IEvents) {
    this.events = events;
    this._cards = []
  }

  getCard(cardId: string) {
    return this._cards.find(item => item.id === cardId);
  }

  updateStatusInBasket(cardId: string, data?: HTMLElement): void {
    const item = this.getCard(cardId);
    if(item.inBasket === false) {
      item.inBasket = true
    } else { item.inBasket = false}
    this.events.emit('card:addedToBasket', {id: cardId, data: data, inBasket: item.inBasket});
  }
 
  set cards(data: ICard[]) {
    this._cards = data.map(item => {
      item.inBasket = false;
      return item as ICard
      })
    this.events.emit('cards:changed');
  };

  set preview(cardId: string) {
    if(!cardId) {
      this._preview = null;
      return;
    } else {
      this._preview = this.getCard(cardId).id;
      this.events.emit('card:selected', { preview: this._preview });
    }
  }

  get preview() {
    return this._preview;
  }

   get cards() {
    return this._cards;
  }
  
}