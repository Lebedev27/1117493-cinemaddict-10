const Nodes = {
  BODY: document.querySelector(`body`),
  HEADER: document.querySelector(`.header`),
  MAIN: document.querySelector(`.main`),
  FOOTER_STATISTIC: document.querySelector(`.footer__statistics p`)
};

const ExtraTitles = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`
};

const SortType = {
  DEFAULT: `default`,
  DATE: `year`,
  RATING: `rating`,
  COMMENTS: `comments`
};

const Count = {
  CARD: 29,
  SHOWING_CARDS_ON_START: 5,
  SHOWING_CARDS_BY_BUTTON: 5,
  EXTRA: 2,
  EXTRA_FILMS: 2
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const KeyCode = {
  ESC: 27
};

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export {Nodes, ExtraTitles, SortType, Count, KeyCode, RenderPosition, Mode};
