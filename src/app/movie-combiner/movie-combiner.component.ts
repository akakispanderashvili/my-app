import { Component } from '@angular/core';
import { MovieService } from '../movie-service.service';
import { forkJoin, from, concatMap, reduce } from 'rxjs';

interface MovieInfo {
  Title: string;
  Runtime: string;
  Country: string;
}

@Component({
  selector: 'app-movie-combiner',
  templateUrl: './movie-combiner.component.html',
  styleUrls: ['./movie-combiner.component.css'],
})
export class MovieCombinerComponent {
  movieName1 = '';
  movieName2 = '';
  movieName3 = '';
  combinedInfo = false;
  combinedLength: number = 0;
  combinedPopulation: number = 0;

  constructor(private movieService: MovieService) {}

  combineMovies() {
    const movieNames = [this.movieName1, this.movieName2, this.movieName3];

    forkJoin(
      movieNames.map((name) => this.movieService.getMovieInfo(name))
    ).subscribe((movieData: any[]) => {
      this.combinedLength = movieData
        .map((data: any) => parseInt(data.Runtime))
        .reduce((acc: number, length: number) => acc + length, 0);

      const country = movieData.map((data: any) => data.Country.split(',')[0]);
      from(country)
        .pipe(
          concatMap((code) => this.movieService.getCountryInfo(code)),
          reduce((acc: number, country: any) => acc + country[0].population, 0)
        )
        .subscribe((population: number) => {
          this.combinedPopulation = population;
          this.combinedInfo = true;
        });
    });
  }
}
