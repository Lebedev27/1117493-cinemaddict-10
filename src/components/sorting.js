import {SortType, TagName} from '../constants.js';
import AbstractComponent from './abstract-component.js';

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, this.sortTypeChangeHandler(handler));
  }

  sortTypeChangeHandler(handler) {
    return (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== TagName.A) {
        return;
      }
      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    };
  }

  setSortTypeDefault() {
    const sortByDefault = this.getElement().querySelector(`a[data-sort-type="default"]`);
    sortByDefault.click();
  }
}
