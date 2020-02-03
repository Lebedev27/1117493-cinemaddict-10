import {Nodes, Count, ExtraTitles, SortType} from '../constants.js';
import {renderHtmlPart, RenderPosition, createFragment, remove} from '../utils/render.js';
import {sortingFilms} from '../utils/common.js';
import {generateFilters} from '../mock.js';
import FilterComponent from '../components/filter.js';
import SortingComponent from '../components/sorting.js';
import MovieController from '../controllers/movie-сontroller.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import ExtraListComponent from '../components/extra-list.js';

const filters = generateFilters();

const createFilmCardFragment = (cardsData, onDataChange, onViewChange) => {
  const fragment = document.createDocumentFragment();
  cardsData.forEach((filmData) => {
    const movieController = new MovieController(fragment, onDataChange, onViewChange);
    movieController.render(filmData);

    // return cardsData.map((filmData) => {
    //   const movieController = new MovieController(container);
    //   movieController.render(filmData);
    //   return movieController;
    // });

    //   const filmCardElement = new FilmCardComponent(card);
    //   const filmPopupElement = new FilmPopupComponent(card);

    //   const filmTitle = filmCardElement.getElement().querySelector(`h3`);
    //   const filmImage = filmCardElement.getElement().querySelector(`img`);
    //   const filmComments = filmCardElement.getElement().querySelector(`a`);

    //   const getCardClickHandler = (evt) => {
    //     if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
    //       renderHtmlPart(Nodes.BODY, filmPopupElement.getElement(), RenderPosition.BEFOREEND);
    //       filmPopupElement.setClickHandler(removePopupCkickHandler);
    //       document.addEventListener(`keydown`, removePopupKeydownHandler);
    //     }
    //   };

    //   const popupRemove = () => {
    //     if (filmPopupElement.getElement()) {
    //       remove(filmPopupElement);
    //       filmPopupElement.removeClickHandler(removePopupCkickHandler);
    //       document.removeEventListener(`keydown`, removePopupKeydownHandler);
    //     }
    //   };

    //   const removePopupCkickHandler = () => {
    //     popupRemove();
    //   };

    //   const removePopupKeydownHandler = (evt) => {
    //     if (evt.keyCode === KeyCode.ESC) {
    //       popupRemove();
    //     }
    //   };

    //   filmCardElement.setClickHandler(getCardClickHandler);

    //   fragment.appendChild(filmCardElement.getElement());
    // });
  });
  return fragment;
};

const renderExtraFilmCard = (data, node, onDataChange, onViewChange) => {
  renderHtmlPart(node.querySelector(`.films-list__container`), createFilmCardFragment(data, onDataChange, onViewChange), RenderPosition.BEFOREEND);
};

const renderFilmListExtra = (node, data, onDataChange) => {
  const ratingSortedFilms = sortingFilms(data, SortType.RATING).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortingFilms(data, SortType.COMMENTS).slice(0, Count.EXTRA_FILMS);

  const isFilmsUnRated = ratingSortedFilms.every((film) => film.rating === 0);
  const isFilmsUnComment = ratingSortedFilms.every((comment) => comment.comments === 0);

  const filmListsExtra = node.querySelectorAll(`.films-list--extra`);

  if (isFilmsUnRated) {
    filmListsExtra[0].remove();
  } else {
    renderExtraFilmCard(ratingSortedFilms, filmListsExtra[0], onDataChange);
  }
  if (isFilmsUnComment) {
    filmListsExtra[1].remove();
  } else {
    renderExtraFilmCard(commentsSortedFilms, filmListsExtra[1], onDataChange);
  }
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._cardsData = [];
    this._nodesMain = Nodes.MAIN;
    this._filmsList = null;
    this._filmsListContainer = null;

    this._showedFilmControllers = [];
    this._showingTasksCount = Count.SHOWING_CARDS_ON_START;
    this._filterComponent = new FilterComponent(filters);
    this._sortingComponent = new SortingComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cardsData) {
    this._cardsData = cardsData;

    renderHtmlPart(this._nodesMain, createFragment([this._filterComponent.getElement(), this._sortingComponent.getElement(), this._container]), RenderPosition.BEFOREEND);

    if (this._cardsData.length > 0) {
      this._filmsList = this._container.querySelector(`.films-list`);
      this._filmsListContainer = this._container.querySelector(`.films-list__container`);

      const cardsOnStart = this._cardsData.slice(0, this._showingTasksCount);
      renderHtmlPart(this._filmsListContainer, createFilmCardFragment(cardsOnStart, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);
      this._renderShowMoreButton();

      renderHtmlPart(this._container, createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);
      renderFilmListExtra(this._container, this._cardsData, this._onDataChange, this._onViewChange);
    }
  }

  _renderShowMoreButton() {

    if (this._showingTasksCount >= this._cardsData.length) {
      return;
    }

    renderHtmlPart(this._filmsList, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    const showMoreButtonClickHandler = () => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount += Count.SHOWING_CARDS_BY_BUTTON;

      const unrenderedCards = this._cardsData.slice(prevTasksCount, this._showingTasksCount);

      renderHtmlPart(this._filmsListContainer, createFilmCardFragment(unrenderedCards, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);

      if (this._showingTasksCount >= this._cardsData.length) {
        remove(this._showMoreButtonComponent);
        this._showMoreButtonComponent.removeClickHandler(showMoreButtonClickHandler);
      }
    };
    this._showMoreButtonComponent.setClickHandler(showMoreButtonClickHandler);
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];
    this._sortingComponent.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    const setActiveSortButton = () => this._sortingComponent.getElement().querySelector(`.sort__button[data-sort-type="${sortType}"]`).classList.add(`sort__button--active`);
    sortedFilms = sortingFilms(this._cardsData, sortType);
    if (sortType === SortType.DEFAULT) {
      sortedFilms = this._cardsData.slice(0, this._showingTasksCount);
    }
    setActiveSortButton();

    this._filmsListContainer.innerHTML = ``;

    renderHtmlPart(this._filmsListContainer, createFilmCardFragment(sortedFilms, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);
    this._showedFilmControllers = this._filmsListContainer.querySelectorAll(`.film-card`);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cardsData.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cardsData = [].concat(this._cardsData.slice(0, index), newData, this._cardsData.slice(index + 1));

    movieController.render(this._cardsData[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((controller) => controller.setDefaultView());
  }
}
