import {Nodes, Count, RenderPosition} from './constants.js';
import {renderHtmlPart} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilterController from './controllers/filter.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import MoviesModel from './models/movies.js';
import {generateFilmCardsData} from './mock.js';
import PageController from './controllers/page-controller.js';

const cardsData = generateFilmCardsData(Count.CARD);
const moviesModel = new MoviesModel();
moviesModel.setMovies(cardsData);

const pasteElements = () => {
  const filmListComponent = new FilmListComponent(cardsData).getElement();
  renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(cardsData.length).getElement(), RenderPosition.BEFOREEND);
  const filterController = new FilterController(Nodes.MAIN, moviesModel);
  filterController.render();

  renderHtmlPart(filmListComponent.querySelector(`.films-list`), new FilmListTitleComponent(cardsData).getElement(), RenderPosition.AFTERBEGIN);

  const pageController = new PageController(filmListComponent, moviesModel);
  pageController.render();

  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
};

pasteElements();
