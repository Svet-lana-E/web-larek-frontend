import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import { ISuccess } from "../../types";
import { IEvents } from "../base/events";


export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._close = ensureElement<HTMLElement>('.button', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        this._close.addEventListener('click', () => {
            events.emit('oder:close')
        });
    }

    set total(total: number) {
        this.setCurrency(this._total, total)
    }
}