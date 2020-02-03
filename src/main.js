import API from './api.js';
import {Nodes, RenderPosition} from './constants.js';
import {renderHtmlPart} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilterController from './controllers/filter.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
// import {generateFilmCardsData} from './mock.js';
import PageController from './controllers/page-controller.js';

const AUTHORIZATION = `Basic dXNlckBwYZFad28yAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

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

// const cardsData = generateFilmCardsData(Count.CARD);
const moviesModel = new MoviesModel();
// moviesModel.setMovies(cardsData);

const pasteElements = () => {
  const api = new API(END_POINT, AUTHORIZATION);

  api.getFilms()
    .then((films) => {
      moviesModel.setMovies(films);
      const filmListComponent = new FilmListComponent(moviesModel.getMoviesAll());
      const pageController = new PageController(filmListComponent, moviesModel, api);
      const statisticsComponent = new StatisticsComponent(moviesModel);

      renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(moviesModel.getMoviesAll().length).getElement(), RenderPosition.BEFOREEND);

      const filterController = new FilterController(Nodes.MAIN, moviesModel, showStatisticHandler(pageController, statisticsComponent));
      filterController.render();

      renderHtmlPart(filmListComponent.getElement().querySelector(`.films-list`), new FilmListTitleComponent(moviesModel.getMoviesAll()).getElement(), RenderPosition.AFTERBEGIN);
      renderHtmlPart(Nodes.MAIN, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
      statisticsComponent.hide();
      Nodes.FOOTER_STATISTIC.textContent = `${moviesModel.getMoviesAll().length} movies inside`;

      const arrayOfPromises = films.map((film) => api.getComments(film[`id`]).then((comments) => comments));
      Promise.all(arrayOfPromises).then((comments) => {
        moviesModel.setComments(comments);
        pageController.render();
      });
    });
};

pasteElements();
