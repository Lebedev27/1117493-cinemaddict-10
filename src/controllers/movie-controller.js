import {Nodes, KeyCode, Mode} from '../constants.js';
import {renderHtmlPart, RenderPosition, remove} from '../utils/render.js';
import MovieModel from '../models/movie.js';
import FilmCardComponent from '../components/film-card.js';
import FilmPopupComponent from '../components/film-popup.js';
import FilmPopupBgComponent from '../components/film-popup-bg.js';
import {bindAll} from '../utils/common.js';

const Handler = {
  CARD_CLICK_HANDLER: `_cardClickHandler`,
  REMOVE_POPUP_CLICK_HANDLER: `_removePopupCkickHandler`,
  REMOVE_POPUP_KEYDOWN_HANDLER: `_removePopupKeydownHandler`,
  WATCHLIST_BUTTON_CLICK_HANDLER: `watchListButtonClickHandler`,
  WATCHED_BUTTON_CLICK_HANDLER: `watchedButtonClickHandler`,
  FAVORITES_BUTTON_CLICK_HANDLER: `favoritesButtonClickHandler`,
  SUBMIT_COMMENT_KEYDOWN_HANDLER: `submitCommentKeydownHandler`
};
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

    bindAll(this, [Handler.CARD_CLICK_HANDLER, Handler.REMOVE_POPUP_CLICK_HANDLER, Handler.REMOVE_POPUP_KEYDOWN_HANDLER, Handler.WATCHLIST_BUTTON_CLICK_HANDLER, Handler.WATCHED_BUTTON_CLICK_HANDLER, Handler.FAVORITES_BUTTON_CLICK_HANDLER, Handler.SUBMIT_COMMENT_KEYDOWN_HANDLER]);
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

  _removePopup() {
    if (this._filmCardPopupComponent.getElement()) {
      this._filmCardPopupComponent.removeClickHandler(this._removePopupCkickHandler);
      document.removeEventListener(`keydown`, this._removePopupKeydownHandler);
      document.removeEventListener(`keydown`, this.submitCommentKeydownHandler);

      this._mode = Mode.DEFAULT;

      remove(this._filmCardPopupComponent);
      remove(this._filmCardPopupBgComponent);
    }
  }

  _cardClickHandler(evt) {
    const filmTitle = this._filmCardComponent.getElement().querySelector(`h3`);
    const filmImage = this._filmCardComponent.getElement().querySelector(`img`);
    const filmComments = this._filmCardComponent.getElement().querySelector(`a`);

    if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
      this._onViewChange();
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

  watchListButtonClickHandler() {
    const newFilm = MovieModel.clone(this._cardData);
    newFilm.isWatchlist = !newFilm.isWatchlist;

    this._onDataChange(this._cardData, newFilm);
  }

  watchedButtonClickHandler() {
    const newFilm = MovieModel.clone(this._cardData);
    newFilm.isWatched = !newFilm.isWatched;
    newFilm.personalRating = 0;
    newFilm.watchingDate = newFilm.isWatched ? new Date() : newFilm.watchingDate;

    this._onDataChange(this._cardData, newFilm);

  }

  favoritesButtonClickHandler() {
    const newFilm = MovieModel.clone(this._cardData);
    newFilm.isFavorite = !newFilm.isFavorite;

    this._onDataChange(this._cardData, newFilm);
  }

  submitCommentKeydownHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER) {
      this._filmCardPopupComponent.addCommentStyles();

      const data = this._filmCardPopupComponent.getData();
      if (data.userEmoji && data.userComment) {
        this._cardData.newComment = {
          emotion: String(data.userEmoji),
          comment: String(data.userComment),
          date: String(new Date())
        };

        this._onDataChange(this._cardData, null, this._filmCardPopupComponent, this._cardData.newComment);

        delete data.userEmoji;
        delete data.userComment;
        delete this._cardData.newComment;
      }
    }
  }

  _removePopupCkickHandler() {
    this._removePopup();
  }

  _removePopupKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      this._removePopup();
    }
  }
}
