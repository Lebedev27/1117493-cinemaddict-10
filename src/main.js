import {Nodes, Count, RenderPosition} from './constants.js';
import {renderHtmlPart} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import {generateFilmCardsData} from './mock.js';
import PageController from './controllers/page-controller.js';

const cardsData = generateFilmCardsData(Count.CARD);


const pasteElements = () => {
  const filmListComponent = new FilmListComponent(cardsData).getElement();
  renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(cardsData.length).getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(filmListComponent.querySelector(`.films-list`), new FilmListTitleComponent(cardsData).getElement(), RenderPosition.AFTERBEGIN);

  const pageController = new PageController(filmListComponent);
  pageController.render(cardsData);

  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
};

pasteElements();
