import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface FavoriteMovie {
  id: number;
  title: string;
  year: number;
  actors: string;
  countries: string[];
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent {
  movies: FavoriteMovie[] | undefined;
  selectedMovie: FavoriteMovie | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<FavoriteMovie[]>('http://localhost:3000/movies')
      .subscribe((movies) => (this.movies = movies));
  }

  showMovieDetails(movie: FavoriteMovie) {
    this.selectedMovie = movie;
  }

  hideMovieDetails() {
    this.selectedMovie = undefined;
  }
}
