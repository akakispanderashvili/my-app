import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from 'src/assets/interfaces/movie.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  getMovieByName(name: any) {
    throw new Error('Method not implemented.');
  }
  private omdbApiKey = 'c9fd1f5d';

  constructor(private http: HttpClient) {}

  getMovieInfo(movieName: string): Observable<Movie> {
    return this.http.get<Movie>(
      `https://www.omdbapi.com/?t=${movieName}&apikey=${this.omdbApiKey}`
    );
  }

  getCountryInfo(countryCode: string) {
    return this.http.get(
      `https://restcountries.com/v3.1/name/${countryCode}?fullText=true`
    );
  }
}
