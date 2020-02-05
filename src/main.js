import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {Nodes, RenderPosition} from './constants.js';
import {renderHtmlPart, createFragment} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilterController from './controllers/filter.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import StatisticsComponent from './components/statistics/statistics.js';
import MoviesModel from './models/movies.js';
import PageController from './controllers/page-controller.js';

const StoreName = {
  MOVIES: `cinemaddict-movies-localstorage-v1`,
  COMMENTS: `cinemaddict-comments-localstorage-v1`
};
const AUTHORIZATION = `Basic dXNlckBwYZFad28yAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const MAIN_NAVIGATION_ADDITIONAL_CLASS = `main-navigation__item--additional`;

const showStatisticHandler = (pageController, statisticsComponent) => {
  return (evt) => {
    if (evt.target.className.includes(MAIN_NAVIGATION_ADDITIONAL_CLASS)) {
      pageController.hide();
      statisticsComponent.show();
    } else {
      pageController.show();
      statisticsComponent.hide();
    }
  };
};

const getPromisesList = (films, api) => films.map((film) => api.getComments(film[`id`]).then((comments) => comments));

const moviesModel = new MoviesModel();

const pasteElements = () => {
  const api = new Api(END_POINT, AUTHORIZATION);
  const moviesStore = new Store(StoreName.MOVIES, window.localStorage);
  const commentsStore = new Store(StoreName.COMMENTS, window.localStorage);
  const apiWithProvider = new Provider(api, moviesStore, commentsStore);

  apiWithProvider.getFilms()
    .then((films) => {
      moviesModel.setMovies(films);
      const allMovies = moviesModel.getMoviesAll();
      const filmListComponent = new FilmListComponent(allMovies);
      const sortingComponent = new SortingComponent();
      const pageController = new PageController(filmListComponent, sortingComponent, moviesModel, apiWithProvider);
      const statisticsComponent = new StatisticsComponent(moviesModel);

      renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(moviesModel).getElement(), RenderPosition.BEFORE_END);

      const filterController = new FilterController(Nodes.MAIN, moviesModel, showStatisticHandler(pageController, statisticsComponent));
      filterController.render();

      renderHtmlPart(filmListComponent.getElement().querySelector(`.films-list`), new FilmListTitleComponent(allMovies).getElement(), RenderPosition.AFTERBEGIN);
      renderHtmlPart(Nodes.MAIN, createFragment([sortingComponent.getElement(), filmListComponent.getElement()]), RenderPosition.BEFORE_END);
      renderHtmlPart(Nodes.MAIN, statisticsComponent.getElement(), RenderPosition.BEFORE_END);
      statisticsComponent.hide();

      Nodes.FOOTER_STATISTIC.textContent = `${allMovies.length} movies inside`;

      const arrayOfCommentsPromises = getPromisesList(films, apiWithProvider);
      Promise.all(arrayOfCommentsPromises).then((comments) => {
        moviesModel.setComments(comments);
      });
      pageController.render();
    });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);

    if (!apiWithProvider.getSynchronize()) {
      apiWithProvider.sync()
        .then(() => {
          // Действие, в случае успешной синхронизации
        })
        .catch(() => {
          // Действие, в случае ошибки синхронизации
        });
    }
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
};

pasteElements();
