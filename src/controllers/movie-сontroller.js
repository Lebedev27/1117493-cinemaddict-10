import {Nodes, KeyCode, Mode} from '../constants.js';
import {renderHtmlPart, RenderPosition, remove} from '../utils/render.js';
import MovieModel from '../models/movie';
import FilmCardComponent from '../components/film-card.js';
import FilmPopupComponent from '../components/film-popup.js';
import FilmPopupBgComponent from '../components/film-popup-bg.js';
import {bindAll} from '../utils/common.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardData = [];

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardPopupBgComponent = null;
    this._filmCardPopupComponent = null;

    bindAll(this, [`_cardClickHandler`, `_removePopupCkickHandler`, `_removePopupKeydownHandler`, `watchListButtonClickHandler`, `watchedButtonClickHandler`, `favoritesButtonClickHandler`, `submitCommentKeydownHandler`]);
  }

  render(filmCardData) {
    this._cardData = filmCardData;
    this._filmCardComponent = new FilmCardComponent(this._cardData);
    this._filmCardPopupBgComponent = new FilmPopupBgComponent(this._cardData);
    this._filmCardPopupComponent = new FilmPopupComponent(this._cardData, this._onDataChange);

    this._filmCardComponent.setClickHandler(this._cardClickHandler);
    this._filmCardComponent.setWatchListButtonClickHandler(this.watchListButtonClickHandler);
    this._filmCardComponent.setWatchedButtonClickHandler(this.watchedButtonClickHandler);
    this._filmCardComponent.setFavoritesButtonClickHandler(this.favoritesButtonClickHandler);

    this._container.appendChild(this._filmCardComponent.getElement());
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupRemove();
    }
  }

  _cardClickHandler(evt) {
    const filmTitle = this._filmCardComponent.getElement().querySelector(`h3`);
    const filmImage = this._filmCardComponent.getElement().querySelector(`img`);
    const filmComments = this._filmCardComponent.getElement().querySelector(`a`);

    if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
      const filmCardPopupBg = this._filmCardPopupBgComponent.getElement();

      renderHtmlPart(Nodes.BODY, filmCardPopupBg, RenderPosition.BEFOREEND);
      renderHtmlPart(filmCardPopupBg, this._filmCardPopupComponent.getElement(), RenderPosition.BEFOREEND);

      this._filmCardPopupComponent.setClickHandler(this._removePopupCkickHandler);
      this._filmCardPopupComponent.recoverListeners();
      document.addEventListener(`keydown`, this._removePopupKeydownHandler);
      document.addEventListener(`keydown`, this.submitCommentKeydownHandler);

      this._mode = Mode.POPUP;
    }
  }

  watchListButtonClickHandler(evt) {
    evt.preventDefault();
    const newFilm = MovieModel.clone(this._cardData);
    newFilm.isWatchlist = !newFilm.isWatchlist;

    this._onDataChange(this._cardData, newFilm);
  }

  watchedButtonClickHandler(evt) {
    evt.preventDefault();
    const newFilm = MovieModel.clone(this._cardData);
    newFilm.isWatched = !newFilm.isWatched;
    newFilm.personalRating = 0;
    newFilm.watchingDate = newFilm.isWatched ? new Date() : newFilm.watchingDate;

    this._onDataChange(this._cardData, newFilm);

  }

  favoritesButtonClickHandler(evt) {
    evt.preventDefault();
    const newFilm = MovieModel.clone(this._cardData);
    newFilm.isFavorite = !newFilm.isFavorite;

    this._onDataChange(this._cardData, newFilm);
  }

  submitCommentKeydownHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER) {
      const data = this._filmCardPopupComponent.getData();

      if (data.userEmoji && data.userComment) {
        this._cardData.comments.push({
          emotion: String(data.userEmoji),
          comment: String(data.userComment),
          date: String(new Date())
        });
        delete data.userEmoji;
        delete data.userComment;

        const newFilm = MovieModel.clone(this._cardData);
        newFilm.comments = data.comments;

        this._onDataChange(this._cardData, newFilm);
        this._filmCardPopupComponent.rerender();
      }
    }
  }

  _popupRemove() {
    if (this._filmCardPopupComponent.getElement()) {
      this._filmCardPopupComponent.removeClickHandler(this._removePopupCkickHandler);
      document.removeEventListener(`keydown`, this._removePopupKeydownHandler);
      document.removeEventListener(`keydown`, this.submitCommentKeydownHandler);

      this._mode = Mode.DEFAULT;

      remove(this._filmCardPopupComponent);
      remove(this._filmCardPopupBgComponent);
    }
  }

  _removePopupCkickHandler() {
    this._popupRemove();
  }

  _removePopupKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      this._popupRemove();
    }
  }
}
