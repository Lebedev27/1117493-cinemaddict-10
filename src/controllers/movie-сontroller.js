import {Nodes, KeyCode, Mode} from '../constants.js';
import {renderHtmlPart, RenderPosition, remove} from '../utils/render.js';
import FilmCardComponent from '../components/film-card.js';
import FilmPopupComponent from '../components/film-popup.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardData = [];

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardPopupComponent = null;

    this._getCardClickHandler = this._getCardClickHandler.bind(this);
    this._removePopupCkickHandler = this._removePopupCkickHandler.bind(this);
    this._removePopupKeydownHandler = this._removePopupKeydownHandler.bind(this);
  }

  render(filmCardData) {
    this._cardData = filmCardData;
    this._filmCardComponent = new FilmCardComponent(this._cardData);
    this._filmCardPopupComponent = new FilmPopupComponent(this._cardData);
    this._filmCardComponent.setClickHandler(this._getCardClickHandler);

    // this._filmCardComponent.setWatchListButtonClickHandler((evt) => {
    //   evt.preventDefault();
    //   this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
    //     isWatchList: !this._cardData.isWatchList,
    //   }));
    // });

    // this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
    //   evt.preventDefault();
    //   this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
    //     isWatched: !this._cardData.isWatched,
    //   }));
    // });

    // this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
    //   evt.preventDefault();
    //   this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
    //     isFavorite: !this._cardData.isFavorite,
    //   }));
    // });

    this._container.appendChild(this._filmCardComponent.getElement());
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupRemove();
    }
  }

  _getCardClickHandler(evt) {
    const filmTitle = this._filmCardComponent.getElement().querySelector(`h3`);
    const filmImage = this._filmCardComponent.getElement().querySelector(`img`);
    const filmComments = this._filmCardComponent.getElement().querySelector(`a`);

    if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
      renderHtmlPart(Nodes.BODY, this._filmCardPopupComponent.getElement(), RenderPosition.BEFOREEND);

      this._filmCardPopupComponent.setClickHandler(this._removePopupCkickHandler);

      this._filmCardPopupComponent.recoveryListeners();

      // this._filmCardPopupComponent.setWatchListButtonClickHandler(() => {
      //   this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
      //     isWatchList: !this._cardData.isWatchList,
      //   }));
      //   this._filmCardPopupComponent.rerender();
      // });

      // this._filmCardPopupComponent.setWatchedButtonClickHandler(() => {
      //   this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
      //     isWatched: !this._cardData.isWatched,
      //   }));
      //   this._filmCardPopupComponent.rerender();
      // });

      // this._filmCardPopupComponent.setFavoritesButtonClickHandler(() => {
      //   this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
      //     isFavorite: !this._cardData.isFavorite,
      //   }));
      //   this._filmCardPopupComponent.rerender();
      // });

      document.addEventListener(`keydown`, this._removePopupKeydownHandler);
      this._mode = Mode.POPUP;
    }
  }

  _popupRemove() {
    if (this._filmCardPopupComponent.getElement()) {
      remove(this._filmCardPopupComponent);
      this._filmCardPopupComponent.removeClickHandler(this._removePopupCkickHandler);
      document.removeEventListener(`keydown`, this._removePopupKeydownHandler);
      this._mode = Mode.DEFAULT;
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
