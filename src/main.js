import {Nodes, Count} from './constants.js';
import {renderHtmlPart, RenderPosition, createFragment} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilterComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import {generateFilters, generateFilmCardsData} from './mock.js';
import PageController from './controllers/page-controller.js';

const cardsData = generateFilmCardsData(Count.CARD);

const filters = generateFilters();

const pasteElements = () => {
  const filmListComponent = new FilmListComponent(cardsData).getElement();
  renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(cardsData.length).getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(Nodes.MAIN, createFragment([new FilterComponent(filters).getElement(), new SortingComponent().getElement(), filmListComponent]), RenderPosition.BEFOREEND);
  renderHtmlPart(filmListComponent.querySelector(`.films-list`), new FilmListTitleComponent(cardsData).getElement(), RenderPosition.AFTERBEGIN);

  const pageController = new PageController(filmListComponent);
  pageController.render(cardsData);

  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
};

pasteElements();
