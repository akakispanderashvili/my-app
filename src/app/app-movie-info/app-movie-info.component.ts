import { Component } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, tap } from 'rxjs';
import { MovieService } from '../movie-service.service';
import { Movie } from '../../assets/interfaces/movie.interface';
import { Country } from '../../assets/interfaces/country.interface';

@Component({
  selector: 'app-movie-info',
  templateUrl: './app-movie-info.component.html',
  styleUrls: ['./app-movie-info.component.css'],
})
export class MovieInfoComponent {
  movieName = '';
  movieInfo$: Observable<Movie> | undefined;
  movie!: Movie;
  // yearsAgo$: Observable<number> | undefined;
  // actorNames$: Observable<string> | undefined;
  countries$: Observable<Country[]> | undefined;
  currencies$: Observable<string[]> | undefined;

  rating: number = 0;
  comment: string = '';
  isPopupVisible = false;

  constructor(private movieService: MovieService) {}
  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }
  fetchData() {
    this.fetchMovie();
    this.fetchCountries();
    this.fetchCurrencies();
  }

  fetchMovie() {
    this.movieInfo$ = this.movieService.getMovieInfo(this.movieName).pipe(
      map((movie: Movie) => {
        this.movie = {
          ...movie,
          actorNames: movie.Actors.split(',')
            .map((actorNames: string) => actorNames.trim().split(' ')[0])
            .join(', '),
          yearsAgo:
            new Date().getFullYear() - new Date(movie.Year).getFullYear(),
        };
        return { ...this.movie };
      })
    );
  }

  fetchCountries() {
    this.countries$ = this.movieInfo$?.pipe(
      map((data: Movie) =>
        data.Country.split(',').map((code: string) => code.trim())
      ),
      mergeMap((codes: string[]) => {
        const observables = codes.map((code) =>
          this.movieService.getCountryInfo(code)
        );
        return forkJoin(observables);
      }),
      map((countries: any[]) => countries.map((country) => country[0]))
    );
  }

  fetchCurrencies() {
    this.currencies$ = this.countries$?.pipe(
      map((countries) =>
        countries.map(
          (country) =>
            country.currencies[Object.keys(country.currencies)[0]].name
        )
      )
    );
  }

  // addToFavorites() {
  //   const movie = {
  //     title: this.movieInfo$.Title,
  //     year: this.movieInfo$.Year,
  //     actors: this.movieInfo$.Actors,
  //     countries: this.countries$,
  //     rating: this.rating,
  //     comment: this.comment,
  //   };
  // }
}
