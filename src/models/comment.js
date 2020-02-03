import moment from 'moment';

export default class Comment {
  constructor(data) {
    this.id = data[`movie`][`id`];
    this.comments = data[`comments`];
    this.title = data[`movie`][`film_info`][`title`];
    this.alternativeTitle = data[`movie`][`film_info`][`alternative_title`];
    this.totalRating = data[`movie`][`film_info`][`total_rating`];
    this.poster = data[`movie`][`film_info`][`poster`];
    this.ageRating = data[`movie`][`film_info`][`age_rating`];
    this.director = data[`movie`][`film_info`][`director`];
    this.writers = data[`movie`][`film_info`][`writers`];
    this.actors = data[`movie`][`film_info`][`actors`];
    this.releaseDate = moment(data[`movie`][`film_info`][`release`][`date`]).toDate();
    this.releaseCountry = data[`movie`][`film_info`][`release`][`release_country`];
    this.runtime = data[`movie`][`film_info`][`runtime`];
    this.genre = data[`movie`][`film_info`][`genre`];
    this.description = data[`movie`][`film_info`][`description`];
    this.personalRating = data[`movie`][`user_details`][`personal_rating`];
    this.isWatchlist = Boolean(data[`movie`][`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`movie`][`user_details`][`already_watched`]);
    this.watchingDate = moment(data[`movie`][`user_details`][`watching_date`]).toDate();
    this.isFavorite = Boolean(data[`movie`][`user_details`][`favorite`]);
  }

  getCommentsId() {
    return this.comments.map((comment) => comment.id);
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.getCommentsId(),
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'total_rating': this.totalRating,
        'poster': this.poster,
        'age_rating': this.ageRating,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.releaseDate,
          'release_country': this.releaseCountry
        },
        'runtime': this.runtime,
        'genre': this.genre,
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.isWatchlist,
        'already_watched': this.isWatched,
        'watching_date': this.watchingDate,
        'favorite': this.isFavorite
      }
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
