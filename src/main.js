import {Nodes, Count, RenderPosition} from './constants.js';
import {renderHtmlPart} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilterController from './controllers/filter.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import {generateFilmCardsData} from './mock.js';
import PageController from './controllers/page-controller.js';

const mainNavigationAdditionalItemClassName = `main-navigation__item--additional`;

const showStatisticHandler = (pageController, statisticsComponent) => {
  return (evt) => {
    if (evt.target.className.includes(mainNavigationAdditionalItemClassName)) {
      pageController.hide();
      statisticsComponent.show();
    } else {
      pageController.show();
      statisticsComponent.hide();
    }
  };
};

const cardsData = generateFilmCardsData(Count.CARD);
const moviesModel = new MoviesModel();
moviesModel.setMovies(cardsData);

const pasteElements = () => {
  const filmListComponent = new FilmListComponent(cardsData);
  const pageController = new PageController(filmListComponent, moviesModel);
  const statisticsComponent = new StatisticsComponent(moviesModel);

  renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(cardsData.length).getElement(), RenderPosition.BEFOREEND);

  const filterController = new FilterController(Nodes.MAIN, moviesModel, showStatisticHandler(pageController, statisticsComponent));
  filterController.render();

  renderHtmlPart(filmListComponent.getElement().querySelector(`.films-list`), new FilmListTitleComponent(cardsData).getElement(), RenderPosition.AFTERBEGIN);

  pageController.render();
  renderHtmlPart(Nodes.MAIN, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
  statisticsComponent.hide();

  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
};

pasteElements();
