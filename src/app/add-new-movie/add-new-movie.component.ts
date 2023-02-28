import { Component, OnInit, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../assets/interfaces/country.interface';
import { Movie } from '../../assets/interfaces/movie.interface';
import { CountryInfo } from '../../assets/interfaces/countryInfo.interface';

import { MovieService } from '../movie-service.service';
import { Observable, debounceTime, map, forkJoin, mergeMap, tap } from 'rxjs';
import { NgxStarRatingModule } from 'ngx-star-rating';

@Component({
  selector: 'app-add-new-movie',
  templateUrl: './add-new-movie.component.html',
  styleUrls: ['./add-new-movie.component.css'],
})
export class AddNewMovieComponent implements OnInit {
  addMovieForm: FormGroup;

  genres: string[] = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ];
  countries$: Observable<Country[]> | undefined;
  isPopupVisible = false;
  movieInfo$: Observable<Movie> | undefined;
  isMovie$: Observable<boolean> | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private movieService: MovieService,
    private elementRef: ElementRef
  ) {
    this.addMovieForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      country: ['', Validators.required],
      releaseDate: ['', Validators.required, this.futureDateValidator],
      isMovie: [null],
    });
  }

  futureDateValidator(control: FormControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      const date = control.value;
      const today = new Date();
      const selectedDate = new Date(date);
      if (selectedDate < today) {
        resolve({ pastDate: true });
      } else {
        resolve(null);
      }
    });
  }
  minutesValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      const minutes = control.value;
      if (minutes < 60 || minutes > 190) {
        resolve({ range: true });
      } else {
        resolve(null);
      }
    });
  }

  ngOnInit(): void {
    this.addMovieForm
      .get('name')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((name: string) => {
        if (name) {
          this.movieInfo$ = this.movieService.getMovieInfo(name);
          this.fetchCountries();
        }
      });

    const isMovieControl = this.addMovieForm.get('isMovie');
    if (isMovieControl) {
      this.isMovie$ = isMovieControl.valueChanges;
      this.isMovie$.subscribe((value: boolean) => {
        if (value === true) {
          this.addMovieForm.get('minutes')?.enable();
          this.addMovieForm.get('numberOfSeries')?.disable();
        } else if (value === false) {
          this.addMovieForm.get('minutes')?.disable();
          this.addMovieForm.get('numberOfSeries')?.enable();
        }
      });
    }
  }

  onMovieTypeChange() {
    const isMovieControl = this.addMovieForm.get('isMovie');
    if (isMovieControl?.value === true) {
      this.addMovieForm.get('minutes')?.enable();
      this.addMovieForm.get('numberOfSeries')?.disable();
    } else if (isMovieControl?.value === false) {
      this.addMovieForm.get('minutes')?.disable();
      this.addMovieForm.get('numberOfSeries')?.enable();
    }
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

  onSubmit() {
    if (this.addMovieForm.valid) {
      const formValue = this.addMovieForm.value;
      const newMovie = {
        name: formValue.name,
        country: formValue.country,
        premiereEventPlace: formValue.premiereEventPlace,
        releaseDate: formValue.releaseDate,
        isMovie: formValue.isMovie,
        minutes: formValue.minutes,
        numberOfSeries: formValue.numberOfSeries,
        rating: formValue.rating,
      };
      this.http
        .post('http://localhost:3000/newMovies', newMovie)
        .subscribe(() => {});
      this.addMovieForm.reset();
    }
  }
}
