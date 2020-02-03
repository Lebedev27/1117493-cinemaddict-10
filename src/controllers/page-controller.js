import {Nodes, Count, ExtraTitles, SortType, KeyCode} from '../constants.js';
import {renderHtmlPart, RenderPosition, createFragment, remove} from '../utils/render.js';
import {sortingFilms} from '../utils/common.js';
import {generateFilters} from '../mock.js';
import FilterComponent from '../components/filter.js';
import SortingComponent from '../components/sorting.js';
import FilmCardComponent from '../components/film-card.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import ExtraListComponent from '../components/extra-list.js';
import FilmPopupComponent from '../components/film-popup.js';

const filters = generateFilters();

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
  const ratingSortedFilms = sortingFilms(data, SortType.RATING).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortingFilms(data, SortType.COMMENTS).slice(0, Count.EXTRA_FILMS);

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

export default class PageController {
  constructor(container) {
    this._container = container;
    this._filterComponent = new FilterComponent(filters);
    this._sortingComponent = new SortingComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(filmsData) {
    renderHtmlPart(Nodes.MAIN, createFragment([this._filterComponent.getElement(), this._sortingComponent.getElement(), this._container]), RenderPosition.BEFOREEND);

    if (filmsData.length > 0) {
      const filmsContainer = Nodes.MAIN.querySelector(`.films`);
      const filmsList = Nodes.MAIN.querySelector(`.films-list`);
      const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);
      const cardsOnStart = filmsData.slice(0, Count.SHOWING_CARDS_ON_START);
      let showingTasksCount = Count.SHOWING_CARDS_ON_START;

      const renderShowMoreButton = () => {

        if (showingTasksCount >= filmsData.length) {
          return;
        }

        renderHtmlPart(filmsList, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

        const showMoreButtonClickHandler = () => {
          const prevTasksCount = showingTasksCount;
          showingTasksCount += Count.SHOWING_CARDS_BY_BUTTON;

          const unrenderedCards = filmsData.slice(prevTasksCount, showingTasksCount);

          renderHtmlPart(filmsListContainer, createFilmCardFragment(unrenderedCards), RenderPosition.BEFOREEND);

          if (showingTasksCount >= filmsData.length) {
            remove(this._showMoreButtonComponent);
            this._showMoreButtonComponent.removeClickHandler(showMoreButtonClickHandler);
          }
        };
        this._showMoreButtonComponent.setClickHandler(showMoreButtonClickHandler);
      };
      renderShowMoreButton();
      renderHtmlPart(filmsListContainer, createFilmCardFragment(cardsOnStart), RenderPosition.BEFOREEND);

      renderHtmlPart(filmsContainer, createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);
      renderFilmListExtra(filmsContainer, filmsData);

      this._sortingComponent.setSortTypeChangeHandler((sortType) => {
        let sortedFilms = [];
        switch (sortType) {
          case SortType.DATE:
            sortedFilms = sortingFilms(filmsData, SortType.DATE);
            break;
          case SortType.RATING:
            sortedFilms = sortingFilms(filmsData, SortType.RATING);
            break;
          case SortType.DEFAULT:
            sortedFilms = filmsData.slice(0, showingTasksCount);
            break;
        }
        filmsListContainer.innerHTML = ``;

        renderHtmlPart(filmsListContainer, createFilmCardFragment(sortedFilms), RenderPosition.BEFOREEND);

        if (sortType === SortType.DEFAULT) {
          renderShowMoreButton();
        } else {
          remove(this._showMoreButtonComponent);
        }
      });
    }
  }
}
