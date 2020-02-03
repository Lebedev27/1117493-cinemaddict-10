import AbstractComponent from './abstract-component.js';

const withoutCount = {
  'All movies': ` main-navigation__item--active`,
  'Stats': ` main-navigation__item--additional`
};

const decorFilterLink = (name) => withoutCount[name] || ``;

const createCounter = (count) => count !== `` ? `<span class="main-navigation__item-count">${count}</span>` : ``;

const createFilterMarkup = (filter) => {
  const {name, link, count} = filter;

  return (
    `<a href="#${link}" class="main-navigation__item${decorFilterLink(name)}">${name}
    ${createCounter(count)}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item) => createFilterMarkup(item)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
