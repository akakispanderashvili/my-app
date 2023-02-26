import { Component } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, tap } from 'rxjs';
import { MovieService } from '../movie-service.service';
import { Movie } from '../../assets/interfaces/movie.interface';
import { Country } from '../../assets/interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { FavoriteMovie } from '../../assets/interfaces/favouriteMovie.interface';

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
  favorites: any;

  constructor(private movieService: MovieService, private http: HttpClient) {
    this.favorites = [];
  }
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

  addToFavorites() {
    this.isPopupVisible = !this.isPopupVisible;
    this.movieInfo$?.subscribe((data: Movie) => {
      this.countries$?.subscribe((countries: Country[]) => {
        this.http
          .get<FavoriteMovie[]>('http://localhost:3000/movies')
          .subscribe((favorites) => {
            const existingFavorite = favorites.find(
              (f) => f.title === data.Title
            );
            if (existingFavorite) {
              const updatedFavorite: FavoriteMovie = {
                ...existingFavorite,
                rating: this.rating,
                comment: this.comment,
              };
              this.http
                .put(
                  `http://localhost:3000/movies/${existingFavorite.id}`,
                  updatedFavorite
                )
                .subscribe(() => {
                  const index = this.favorites.findIndex(
                    (f: { title: string }) => f.title === data.Title
                  );
                  this.favorites.splice(index, 1, updatedFavorite);
                });
            } else {
              const newFavorite: FavoriteMovie = {
                id: favorites.length + 1,
                title: data.Title,
                year: parseInt(data.Year),
                actors: data.Actors,
                countries: countries,
                rating: this.rating,
                comment: this.comment,
              };
              this.http
                .post('http://localhost:3000/movies', newFavorite)
                .subscribe(() => {
                  this.favorites.push(newFavorite);
                });
            }
          });
      });
    });
  }
}
