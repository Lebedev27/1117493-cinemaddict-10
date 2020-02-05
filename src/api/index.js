import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const HEADER_CONTENT_TYPE = {'Content-Type': `application/json`};
const HEADER_AUTHORIZATION = `Authorization`;

const Url = {
  MOVIES: `movies`,
  COMMENTS: `comments`,
  SYNC: `movies/sync`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: Url.MOVIES})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(id) {
    return this._load({url: `${Url.COMMENTS}/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  addComment(id, comment) {
    return this._load({
      url: `${Url.COMMENTS}/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers(HEADER_CONTENT_TYPE)
    })
      .then((response) => response.json())
      .then((result) => result.comments)
      .then(Comment.parseComments);
  }

  updateFilm(id, data) {
    return this._load({
      url: `${Url.MOVIES}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers(HEADER_CONTENT_TYPE)
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  deleteComment(commentId) {
    return this._load({url: `${Url.COMMENTS}/${commentId}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: Url.SYNC,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers(HEADER_CONTENT_TYPE)
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(HEADER_AUTHORIZATION, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
