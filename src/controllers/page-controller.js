import {Nodes, Count, ExtraTitles, SortType} from '../constants.js';
import {renderHtmlPart, RenderPosition, createFragment, remove} from '../utils/render.js';
import {sortFilms} from '../utils/common.js';
import SortingComponent from '../components/sorting.js';
import MovieController from '../controllers/movie-сontroller.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import ExtraListComponent from '../components/extra-list.js';
import {bindAll} from '../utils/common.js';

const createFilmCardFragment = (cardsData, onDataChange, onViewChange) => {
  const fragment = document.createDocumentFragment();
  cardsData.forEach((filmData) => {
    const movieController = new MovieController(fragment, onDataChange, onViewChange);
    movieController.render(filmData);
  });
  return fragment;
};

const renderExtraFilmCard = (data, node, onDataChange, onViewChange) => {
  renderHtmlPart(node.querySelector(`.films-list__container`), createFilmCardFragment(data, onDataChange, onViewChange), RenderPosition.BEFOREEND);
};

const renderFilmListExtra = (node, data, onDataChange, onViewChange) => {
  const ratingSortedFilms = sortFilms(data, SortType.RATING).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortFilms(data, SortType.COMMENTS).slice(0, Count.EXTRA_FILMS);

  const isFilmsUnRated = ratingSortedFilms.every((film) => film.rating === 0);
  const isFilmsUnComment = ratingSortedFilms.every((comment) => comment.comments === 0);

  const filmListsExtra = node.querySelectorAll(`.films-list--extra`);

  if (isFilmsUnRated) {
    filmListsExtra[0].remove();
  } else {
    renderExtraFilmCard(ratingSortedFilms, filmListsExtra[0], onDataChange, onViewChange);
  }
  if (isFilmsUnComment) {
    filmListsExtra[1].remove();
  } else {
    renderExtraFilmCard(commentsSortedFilms, filmListsExtra[1], onDataChange, onViewChange);
  }
};

export default class PageController {
  constructor(container, filmModel) {
    this._container = container;
    this._filmModel = filmModel;

    this._nodesMain = Nodes.MAIN;
    this._filmsList = null;
    this._filmsListContainer = null;

    this._showedFilmControllers = [];
    this._showingFilmsCount = Count.SHOWING_CARDS_ON_START;
    this._sortingComponent = new SortingComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    bindAll(this, [`_onDataChange`, `_onSortTypeChange`, `_onViewChange`, `_onFilterChange`, `showMoreButtonClickHandler`]);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
    this._sortingComponent.hide();
  }

  show() {
    this._container.show();
    this._sortingComponent.show();
  }

  render() {
    const filmCards = this._filmModel.getMovies();

    renderHtmlPart(this._nodesMain, createFragment([this._sortingComponent.getElement(), this._container.getElement()]), RenderPosition.BEFOREEND);

    if (filmCards.length > 0) {
      this._filmsList = this._container.getElement().querySelector(`.films-list`);
      this._filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);

      const cardsOnStart = filmCards.slice(0, this._showingFilmsCount);
      renderHtmlPart(this._filmsListContainer, createFilmCardFragment(cardsOnStart, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);
      this._renderShowMoreButton();

      renderHtmlPart(this._container.getElement(), createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);
      renderFilmListExtra(this._container.getElement(), filmCards, this._onDataChange, this._onViewChange);
    }
  }

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._filmModel.getMovies().slice(0, count));
    this._renderShowMoreButton();
  }

  _renderCards(films) {
    renderHtmlPart(this._filmsListContainer, createFilmCardFragment(films, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);
    this._showedFilmControllers = this._filmsListContainer.querySelectorAll(`.film-card`);
    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _removeCards() {
    this._filmsListContainer.innerHTML = ``;
    this._showedFilmControllers = [];
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmModel.getMovies().length) {
      return;
    }

    renderHtmlPart(this._filmsList, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this.showMoreButtonClickHandler);
  }

  showMoreButtonClickHandler() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount += Count.SHOWING_CARDS_BY_BUTTON;

    const unrenderedCards = this._filmModel.getMovies().slice(prevFilmsCount, this._showingFilmsCount);

    renderHtmlPart(this._filmsListContainer, createFilmCardFragment(unrenderedCards, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);

    if (this._showingFilmsCount >= this._filmModel.getMoviesAll().length) {
      remove(this._showMoreButtonComponent);
      this._showMoreButtonComponent.removeClickHandler(this.showMoreButtonClickHandler);
    }
  }

  _onSortTypeChange(sortType) {
    const filmCards = this._filmModel.getMoviesAll();
    let sortedFilms = [];

    this._sortingComponent.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    const setActiveSortButton = () => this._sortingComponent.getElement().querySelector(`.sort__button[data-sort-type="${sortType}"]`).classList.add(`sort__button--active`);

    if (sortType === SortType.DEFAULT) {
      sortedFilms = filmCards.slice(0, this._showingFilmsCount);
    } else {
      sortedFilms = sortFilms(filmCards, sortType);
    }
    setActiveSortButton();

    this._removeCards();
    this._renderCards(sortedFilms);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      this._updateCards(this._showingFilmsCount);
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((controller) => controller.setDefaultView());
  }

  _onFilterChange() {
    this._updateCards(Count.SHOWING_CARDS_ON_START);
  }
}
