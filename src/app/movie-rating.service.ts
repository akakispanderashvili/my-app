import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovieRatingService {
  constructor(private http: HttpClient) {}

  postMovieRating(
    id: string,
    title: string,
    year: string,
    actors: string,
    countries: string[],
    currencies: string[],
    rating: number,
    comment: string
  ) {
    const url = 'http://localhost:3000/movies';
    const payload = {
      id: id,
      title: title,
      year: year,
      actors: actors,
      countries: countries,
      currencies: currencies,
      rating: rating,
      comment: comment,
    };
    return this.http.post(url, payload);
  }
}
