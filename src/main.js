import {createProfileStatusTemplate} from './components/profile-status.js';
import {createFilterTemplate} from './components/filter.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/film-list.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createExtraListTemplate} from './components/extra-list.js';
import {createFilmPopupTemplate} from './components/film-popup.js';

const Count = {
  CARD: 5,
  EXTRA: 2,
  EXTRA_FILMS: 2
};

const Nodes = {
  BODY: document.querySelector(`body`),
  HEADER: document.querySelector(`.header`),
  MAIN: document.querySelector(`.main`)
};

const renderHtmlPart = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmListExtra = (node) => {
  const filmListsExtra = node.querySelectorAll(`.films-list--extra`);
  const filmCardTemplate = createFilmCardTemplate().repeat(Count.EXTRA_FILMS);
  filmListsExtra.forEach((item) => {
    renderHtmlPart(item.querySelector(`.films-list__container`), filmCardTemplate, `beforeend`);
  });
};

const pasteElements = () => {
  renderHtmlPart(Nodes.HEADER, createProfileStatusTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilterTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createSortingTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilmListTemplate(), `beforeend`);

  const filmsContainer = Nodes.MAIN.querySelector(`.films`);
  const filmsList = Nodes.MAIN.querySelector(`.films-list`);
  const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);
  renderHtmlPart(filmsListContainer, createFilmCardTemplate().repeat(Count.CARD), `beforeend`);
  renderHtmlPart(filmsList, createShowMoreButtonTemplate(), `beforeend`);

  renderHtmlPart(filmsContainer, createExtraListTemplate().repeat(Count.EXTRA), `beforeend`);

  renderFilmListExtra(filmsContainer);
  renderHtmlPart(Nodes.BODY, createFilmPopupTemplate(), `beforeend`);
};

pasteElements();
