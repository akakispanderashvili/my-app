import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewMovie } from '../../assets/interfaces/newMovie.interface';

@Component({
  selector: 'app-new-movie',
  templateUrl: './new-movie.component.html',
  styleUrls: ['./new-movie.component.css'],
})
export class NewMovieComponent {
  movies: NewMovie[] = [];

  constructor(private http: HttpClient) {
    this.http
      .get<NewMovie[]>('http://localhost:3000/newMovies')
      .subscribe((movies) => {
        this.movies = movies;
      });
  }
}
