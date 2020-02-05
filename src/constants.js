const NAMES = [`Aaron`, `Adam`, `Aiden`, `Albert`, `Alex`, `Alexander`, `Alfie`, `Archie`, `Arthur`, `Austin`, `Benjamin`, `Blake`, `Bobby`];

const FilterName = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`
};

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

const GenreIndex = {
  NAME: 0,
  VALUE: 1,
  TOP_GENRE: 0
};

const SortType = {
  DEFAULT: `default`,
  DATE: `releaseDate`,
  RATING: `totalRating`,
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
  AFTER_BEGIN: `afterBegin`,
  BEFORE_END: `beforeEnd`
};

const KeyCode = {
  ESC: 27,
  ENTER: 13
};

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const ContainerTitle = {
  CLASS: `visually-hidden`,
  TEXT_CONTENT: `All movies. Upcoming`
};

const ButtonStatus = {
  DELETING: `Deleting...`,
  DELETE: `Delete`,
  UNDOING: `Undoing...`,
  UNDO: `Undo`
};

const DEBOUNCE_TIMEOUT = 500;

const TagName = {
  INPUT: `INPUT`,
  BUTTON: `BUTTON`,
  LABEL: `LABEL`,
  A: `A`
};

const SortFlag = {
  REVERSE: `reverse`,
  LENGTH: `length`
};

export {NAMES, SortFlag, TagName, DEBOUNCE_TIMEOUT, GenreIndex, Nodes, ExtraTitles, SortType, Count, KeyCode, RenderPosition, Mode, FilterName, ContainerTitle, ButtonStatus};
