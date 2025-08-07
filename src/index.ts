import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { CardGallery, CardPreview } from './components/view/Card';
import { Modal } from './components/common/Modal';
import { CardsData } from './components/model/CardsData';
import { Page } from './components/view/Page';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket, BasketItem } from './components/view/Basket';
import { StateData } from './components/model/StateData';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/OrderSucceed';
import { IContacts } from './types';

const events = new EventEmitter(); // инстанс брокера событий
const api = new AppApi(CDN_URL, API_URL); // инстанс api приложения

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
    console.log(event.eventName, event.data)
})

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Шаблоны темплейтов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); 
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Переиспользуемые элементы
const basketElement = basketTemplate.content.querySelector('.basket') as HTMLElement;
const orderFormElement = orderTemplate.content.querySelector('form') as HTMLFormElement;
const contactsFormElement = contactsTemplate.content.querySelector('form');
const successElement = successTemplate.content.querySelector('.order-success')as HTMLElement;
const cardsData = new CardsData(events);
const stateData = new StateData(events);
const basket = new Basket(basketElement, events);
const cardPreviewElement = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const orderForm = new OrderForm(orderFormElement, events);
const contactsForm = new ContactsForm(contactsFormElement, events);
const orderSuccess = new Success(successElement, events);

// Удалить первоначально открытое модальное окно 

ensureElement<HTMLElement>('.modal_active').classList.remove('modal_active');

// ------------------Получаем карточки с сервера и отрисовываем их ---------------

api.getItemList()
  .then((data) => {
    cardsData.cards = data;
    events.emit('initialData:loaded');
  })
  .catch((err) => {
    console.error(err);
})

events.on('initialData:loaded', () => {
  const cardsArray = cardsData.cards.map((card) => {
      const cardInstant = new CardGallery(cloneTemplate(cardCatalogTemplate), events);

      return cardInstant.render(card);
  });
  page.render({catalog: cardsArray});
});


// ---------Открываем preview  + добавить в корзину / удалить из корзины---------------

events.on('cardPreview:open', (data: {id: string}) => {                
  cardsData.preview = data.id; 

  events.on('modal:close', () => {
    cardsData.preview = null;
  });
});
  
events.on('card:selected', (data: { preview: string }) => {                              
  modal.render({content: cardPreviewElement.render(cardsData.getCard(data.preview))
  });
  cardPreviewElement.setCardBasketButton();
});

events.on('card:basket', (data: { id: string, obj: HTMLElement }) => {                                 
  cardsData.updateStatusInBasket(data.id, data.obj);
  stateData.setItemsSelected(cardsData.cards);
  stateData.setTotalPrice();
  page.render({counter: stateData.counter});                 
    
});

  events.on('card:addedToBasket', (data: {id: string, data: HTMLElement, inBasket: boolean}) => { 
    console.log(data.data.classList.value);
    
    if(data.data.classList.value === 'button card__button') {
      modal.render({content: cardPreviewElement.render({
        inBasket: data.inBasket,
      })})
      cardPreviewElement.setCardBasketButton();
    } else if (data.data.classList.value === 'basket__item-delete card__button') {
      stateData.setItemsSelected(cardsData.cards);
      stateData.setTotalPrice();
      page.render({counter: stateData.counter});
      const compactCards = stateData._selected.map((item) => {
      const basketListItem = new BasketItem(cloneTemplate(cardBasketTemplate), events);
      basketListItem.index = stateData._selected.indexOf(item) + 1;
      return basketListItem.render(item)})
      modal.render({content: basket.render({
        items: compactCards,
        total: stateData._total,
        selected: stateData._items,
        })
  })
  }})     


// ------- Блокировка прокрутки экрана -------------

events.on('modal:open', () => {page.locked = true});
events.on('modal:close', () => {page.locked = false});


// ---------------- Корзина ------------------

events.on('basket:open', () => {   
  stateData.setItemsSelected(cardsData.cards);
  stateData.setTotalPrice();
  const compactCards = stateData._selected.map((item) => {
  const basketListItem = new BasketItem(cloneTemplate(cardBasketTemplate), events);
  basketListItem.index = stateData._selected.indexOf(item) + 1;
  return basketListItem.render(item)})
  modal.render({content: basket.render({
    items: compactCards,
    total: stateData._total,
    selected: stateData._items,
    })
  })
});
 
events.on('basketItem:delete', (data: { data: string, obj: HTMLElement}) => {
  cardsData.updateStatusInBasket(data.data, data.obj);
});


// --------------------- Форма заказа 1 окно----------------------

events.on('order:open', () => {
  console.log(stateData);
    modal.render({
        content: orderForm.render({
            phone: '',
            email: '',
            address: '',
            valid: false,
            errors: []
        })
    });

    orderForm.setActiveButton("");
    stateData.deleteContacts();
    stateData.deleteErrors();
});


// -----------------Изменилось одно из полей формы ORDER----------

events.on(/^order\..*:change/, (data: { field: keyof IContacts, value: string }) => {
  stateData.setContacts(data.field, data.value);
  if (data.field === 'payment') {
    orderForm.setActiveButton(data.value);
  }
    
});

events.on('formErrors:order.change', (errors: Partial<IContacts>) => {
    const { address, payment} = errors;
    orderForm.valid = !address && !payment;
    orderForm.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});



// --------------------- Форма заказа 2 окно-----------------------

events.on('order:submit', () => {
  modal.render({
      content: contactsForm.render({
            phone: '',
            email: '',
            address: '',
            valid: false,
            errors: []
      })
  });

});

// -----------------Изменилось одно из полей формы CONTACTS----------

events.on(/^contacts\..*:change/, (data: { field: keyof IContacts, value: string }) => {
  stateData.setContacts(data.field, data.value);

    console.log(stateData);
});


events.on('formErrors:change', (errors: Partial<IContacts>) => {
    const { phone, email} = errors;
    contactsForm.valid = !phone && !email;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});


// ---------------------- Заказ отправлен -----------------------
events.on('contacts:submit', () => {
  api.placeOrder(stateData)
    .then((data) => {
      orderSuccess.total = data.total;
      modal.render({content:orderSuccess.render(data)});

    })
    .catch((err) => {
      console.error(err);
    })
});

// ---------------- Закрытие окна подтверждения заказа---------------

events.on('oder:close', () => {
  modal.close();
      cardsData.cards.forEach(item => item.inBasket = false);
      stateData.deleteContacts();
      stateData.deleteErrors();
      stateData.setItemsSelected(cardsData.cards);
      page.render({counter: stateData.counter});
})

