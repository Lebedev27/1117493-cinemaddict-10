import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  constructor() {
    super();

    this.rerender = this.rerender.bind(this);
  }
  recoverListeners() {
    throw new Error(`Abstract method not implemented: recoverListeners`);
  }

  rerender(data = null) {
    if (data !== null && this._data !== null) {
      this._data = data;
    }
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.clearElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoverListeners();
  }
}
