import {Nodes, Count, ExtraTitles, SortType, ContainerTitle, SortFlag} from '../constants.js';
import {renderHtmlPart, RenderPosition, createFragment, remove} from '../utils/render.js';
import {sortFilms} from '../utils/common.js';
import MovieController from './movie-controller.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import ExtraListComponent from '../components/extra-list.js';
import {bindAll} from '../utils/common.js';

const Handler = {
  ON_DATA_CHANGE: `_onDataChange`,
  ON_SORT_TYPE_CHANGE: `_onSortTypeChange`,
  ON_VIEW_CHANGE: `_onViewChange`,
  ON_FILTER_CHANGE: `_onFilterChange`,
  SHOW_MORE_BUTTON_CLICK_HANDLER: `showMoreButtonClickHandler`
};

const createFilmCardFragment = (cardsData, onDataChange, onViewChange) => {
  const fragment = document.createDocumentFragment();

  cardsData.forEach((filmData) => {
    const movieController = new MovieController(fragment, onDataChange, onViewChange);

    movieController.render(filmData);
  });
  return fragment;
};

const renderExtraFilmCard = (data, node, onDataChange, onViewChange) => {
  const createdFragment = createFilmCardFragment(data, onDataChange, onViewChange);
  renderHtmlPart(node.querySelector(`.films-list__container`), createdFragment, RenderPosition.BEFOREEND);
};

const renderFilmListExtra = (node, data, onDataChange, onViewChange) => {
  const ratingSortedFilms = sortFilms(data, SortType.RATING).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortFilms(data, SortType.COMMENTS, SortFlag.LENGTH).slice(0, Count.EXTRA_FILMS);

  const isUnRated = ratingSortedFilms.every((film) => film.totalRating === 0);
  const isUnComment = ratingSortedFilms.every((comment) => comment.comments === 0);

  const filmListsExtra = node.querySelectorAll(`.films-list--extra`);

  if (isUnRated) {
    filmListsExtra[0].remove();
  } else {
    renderExtraFilmCard(ratingSortedFilms, filmListsExtra[0], onDataChange, onViewChange);
  }
  if (isUnComment) {
    filmListsExtra[1].remove();
  } else {
    renderExtraFilmCard(commentsSortedFilms, filmListsExtra[1], onDataChange, onViewChange);
  }
};

export default class PageController {
  constructor(container, sortingComponent, filmModel, api) {
    this._container = container;
    this._filmModel = filmModel;
    this._api = api;

    this._nodesMain = Nodes.MAIN;
    this._filmsList = null;
    this._filmsListContainer = null;

    this._showedFilmControllers = [];
    this._showingFilmsCount = Count.SHOWING_CARDS_ON_START;
    this._sortingComponent = sortingComponent;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._extraListComponents = null;

    bindAll(this, [Handler.ON_DATA_CHANGE, Handler.ON_SORT_TYPE_CHANGE, Handler.ON_VIEW_CHANGE, Handler.ON_FILTER_CHANGE, Handler.SHOW_MORE_BUTTON_CLICK_HANDLER]);

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

    if (filmCards.length > 0) {
      const containerTitle = this._container.selectNode(`.films-list__title`);
      this._filmsList = this._container.selectNode(`.films-list`);
      this._filmsListContainer = this._container.selectNode(`.films-list__container`);

      containerTitle.classList.add(ContainerTitle.CLASS);
      containerTitle.textContent = ContainerTitle.TEXT_CONTENT;

      const cardsOnStart = filmCards.slice(0, this._showingFilmsCount);
      renderHtmlPart(this._filmsListContainer, createFilmCardFragment(cardsOnStart, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);
      this._renderShowMoreButton();

      renderHtmlPart(this._container.getElement(), createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);
      renderFilmListExtra(this._container.getElement(), filmCards, this._onDataChange, this._onViewChange, this._filmModel);

      this._extraListComponents = this._container.getElement().querySelectorAll(`.films-list--extra`);
    }
  }

  _updateCards(count) {
    this._removeCards();
    this._renderShowMoreButton();
    this._renderCards(this._filmModel.getMovies().slice(0, count));
  }

  _renderCards(films) {
    renderHtmlPart(this._filmsListContainer, createFilmCardFragment(films, this._onDataChange, this._onViewChange), RenderPosition.BEFOREEND);
    this._showedFilmControllers = this._filmsListContainer.querySelectorAll(`.film-card`);
    renderHtmlPart(this._container.getElement(), createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);

    renderFilmListExtra(this._container.getElement(), this._filmModel.getMoviesAll(), this._onDataChange, this._onViewChange, this._filmModel);
    this._showingFilmsCount = this._showedFilmControllers.length;
    this._extraListComponents = this._container.getElement().querySelectorAll(`.films-list--extra`);
  }

  _removeCards() {
    this._filmsListContainer.innerHTML = ``;
    this._showedFilmControllers = [];
    if (this._extraListComponents.length > 0) {
      this._extraListComponents.forEach((component) => {
        component.innerHTML = ``;
        component.remove();
      });
      this._extraListComponents = null;
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmModel.getMovies().length) {
      return;
    }

    renderHtmlPart(this._filmsList, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this.showMoreButtonClickHandler);
  }

  _onSortTypeChange(sortType) {
    const filmCards = this._filmModel.getMovies();
    let sortedFilms = [];

    this._sortingComponent.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    const setActiveSortButton = () => this._sortingComponent.getElement().querySelector(`.sort__button[data-sort-type="${sortType}"]`).classList.add(`sort__button--active`);

    if (sortType === SortType.DEFAULT) {
      sortedFilms = filmCards.slice(0, this._showingFilmsCount);
    } else {
      sortedFilms = sortFilms(filmCards, sortType).slice(0, this._showingFilmsCount);
    }
    setActiveSortButton();

    this._removeCards();
    this._renderCards(sortedFilms);
  }

  _onDataChange(oldData, newData, filmPopup, newComment, deleteCommentId, newDataFromPopup) {
    if (newComment) {
      let film;
      this._api.addComment(oldData.id, newComment)
        .then((filmModel) => {
          film = filmModel;
        })
        .then(() => this._api.getComments(film.id))
        .then((comments) => {
          film.comments = comments;
          return this._updateCommentsData(film, filmPopup);
        })
        .catch(() => {
          filmPopup.removeCommentStyles();
          filmPopup.shake(filmPopup.getElement().querySelector(`.film-details__comment-input`));
        });
    } else if (deleteCommentId) {
      this._api.deleteComment(oldData.id, deleteCommentId)
        .then(() => this._updateCommentsData(newDataFromPopup, filmPopup))
        .catch(() => filmPopup.unSetDisabledDeleteButton());
    } else {
      let film;
      this._api.updateFilm(oldData.id, newData)
        .then((filmModel) => {
          film = filmModel;
        })
        .then(() => this._api.getComments(film.id))
        .then((comments) => {
          film.comments = comments;
          const isSuccess = this._filmModel.updateMovie(oldData.id, film);

          if (isSuccess) {
            this._updateCards(this._showingFilmsCount);
            if (filmPopup) {
              filmPopup.rerender(film);
            }
          }
        })
        .catch(() => {
          if (filmPopup.clickedRatingIcon) {
            filmPopup.shake(filmPopup.getElement().querySelector(`.film-details__user-score`));
            filmPopup.removeRatingStyles();
            filmPopup.unSetDisabledUndoButton();
          }
        });
    }
  }

  _onViewChange() {
    const openPopup = document.querySelector(`.film-details`);
    if (openPopup) {
      openPopup.remove();
    }
  }

  _onFilterChange() {
    this._sortingComponent.setSortTypeDefault();
    this._showingFilmsCount = Count.SHOWING_CARDS_ON_START;
    this._updateCards(Count.SHOWING_CARDS_ON_START);
  }

  _updateCommentsData(data, filmPopup) {
    const isSuccess = this._filmModel.updateMovie(data.id, data);

    if (isSuccess) {
      this._updateCards(this._showingFilmsCount);
      this._filmModel.updateComments(data.id, data.comments);
      if (filmPopup) {
        filmPopup.rerender(data);
      }
    }
  }

  showMoreButtonClickHandler() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount += Count.SHOWING_CARDS_BY_BUTTON;

    const unrenderedCards = this._filmModel.getMovies().slice(prevFilmsCount, this._showingFilmsCount);

    renderHtmlPart(this._filmsListContainer, createFilmCardFragment(unrenderedCards, this._onDataChange, this._onViewChange, this._filmModel), RenderPosition.BEFOREEND);

    if (this._showingFilmsCount >= this._filmModel.getMovies().length) {
      remove(this._showMoreButtonComponent);
      this._showMoreButtonComponent.removeClickHandler(this.showMoreButtonClickHandler);
    }
  }
}
