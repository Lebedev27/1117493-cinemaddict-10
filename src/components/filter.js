const withoutCount = {
  'All movies': ` main-navigation__item--active`,
  'Stats': ` main-navigation__item--additional`
};

const decorFilterLink = (name) => {
  return withoutCount[name] || ``;
};

const createFilterMarkup = (filter) => {
  const {name, link, count} = filter;

  return (
    `<a href="#${link}" class="main-navigation__item${decorFilterLink(name)}">${name}
    ${count !== `` ?
      `<span class="main-navigation__item-count">${count}</span>`
      : ``
    }
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

export {createFilterTemplate};
