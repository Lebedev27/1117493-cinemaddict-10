import {Nodes, Count, ExtraTitles, TypeOfSorting, KeyCode} from '../constants.js';
import {renderHtmlPart, RenderPosition, createFragment, remove} from '../utils/render.js';
import {sortingFilms} from '../utils/common.js';
import FilmCardComponent from '../components/film-card.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import ExtraListComponent from '../components/extra-list.js';
import FilmPopupComponent from '../components/film-popup.js';

const createFilmCardFragment = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((card) => {
    const filmCardElement = new FilmCardComponent(card);
    const filmPopupElement = new FilmPopupComponent(card);

    const filmTitle = filmCardElement.getElement().querySelector(`h3`);
    const filmImage = filmCardElement.getElement().querySelector(`img`);
    const filmComments = filmCardElement.getElement().querySelector(`a`);

    const getCardClickHandler = (evt) => {
      if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
        renderHtmlPart(Nodes.BODY, filmPopupElement.getElement(), RenderPosition.BEFOREEND);
        filmPopupElement.setClickHandler(removePopupCkickHandler);
        document.addEventListener(`keydown`, removePopupKeydownHandler);
      }
    };

    const popupRemove = () => {
      if (filmPopupElement.getElement()) {
        remove(filmPopupElement);
        filmPopupElement.removeClickHandler(removePopupCkickHandler);
        document.removeEventListener(`keydown`, removePopupKeydownHandler);
      }
    };

    const removePopupCkickHandler = () => {
      popupRemove();
    };

    const removePopupKeydownHandler = (evt) => {
      if (evt.keyCode === KeyCode.ESC) {
        popupRemove();
      }
    };

    filmCardElement.setClickHandler(getCardClickHandler);

    fragment.appendChild(filmCardElement.getElement());
  });
  return fragment;
};

const renderExtraFilmCard = (data, node) => {
  renderHtmlPart(node.querySelector(`.films-list__container`), createFilmCardFragment(data), RenderPosition.BEFOREEND);
};

const renderFilmListExtra = (node, data) => {
  const ratingSortedFilms = sortingFilms(data, TypeOfSorting.rating).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortingFilms(data, TypeOfSorting.comments).slice(0, Count.EXTRA_FILMS);

  const isFilmsUnRated = ratingSortedFilms.every((film) => film.rating === 0);
  const isFilmsUnComment = ratingSortedFilms.every((comment) => comment.comments === 0);

  const filmListsExtra = node.querySelectorAll(`.films-list--extra`);

  if (isFilmsUnRated) {
    filmListsExtra[0].remove();
  } else {
    renderExtraFilmCard(ratingSortedFilms, filmListsExtra[0]);
  }
  if (isFilmsUnComment) {
    filmListsExtra[1].remove();
  } else {
    renderExtraFilmCard(commentsSortedFilms, filmListsExtra[1]);
  }
};

const loadMoreButtonClickHandler = (node, component, data) => {
  let showingTasksCount = Count.SHOWING_CARDS_ON_START;
  return () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += Count.SHOWING_CARDS_BY_BUTTON;

    const unrenderedCards = data.slice(prevTasksCount, showingTasksCount);

    renderHtmlPart(node, createFilmCardFragment(unrenderedCards), RenderPosition.BEFOREEND);

    if (showingTasksCount >= data.length) {
      remove(component);
      component.removeClickHandler(loadMoreButtonClickHandler(node, component, data));
    }
  };
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(filmsData) {
    if (filmsData.length > 0) {
      const filmsContainer = Nodes.MAIN.querySelector(`.films`);
      const filmsList = Nodes.MAIN.querySelector(`.films-list`);
      const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);
      const cardsOnStart = filmsData.slice(0, Count.SHOWING_CARDS_ON_START);

      renderHtmlPart(filmsListContainer, createFilmCardFragment(cardsOnStart), RenderPosition.BEFOREEND);

      renderHtmlPart(filmsList, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
      renderHtmlPart(filmsContainer, createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);
      renderFilmListExtra(filmsContainer, filmsData);

      this._showMoreButtonComponent.setClickHandler(loadMoreButtonClickHandler(filmsListContainer, this._showMoreButtonComponent, filmsData));
    }
  }
}
