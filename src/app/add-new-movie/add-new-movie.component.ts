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

  genres: { name: string; isChecked: boolean }[] = [
    { name: 'Action', isChecked: false },
    { name: 'Adventure', isChecked: false },
    { name: 'Comedy', isChecked: false },
    { name: 'Drama', isChecked: false },
    { name: 'Fantasy', isChecked: false },
    { name: 'Horror', isChecked: false },
    { name: 'Mystery', isChecked: false },
    { name: 'Romance', isChecked: false },
    { name: 'Sci-Fi', isChecked: false },
    { name: 'Thriller', isChecked: false },
  ];

  countries$: Observable<Country[]> | undefined;
  isPopupVisible = false;
  showMovieLength = false;

  movieInfo$: Observable<Movie> | undefined;
  isMovie$: Observable<boolean> | undefined;
  isSeries: boolean = false;
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
      rating: ['', Validators.required],
      minutes: ['', [Validators.required]],
      // isMovie: [false, Validators.required],
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
        console.log('is');
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
      if (this.isMovie$) {
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
  }

  onMovieTypeChange() {
    const isMovie = this.addMovieForm.get('isMovie')?.value;
    this.showMovieLength = isMovie;
    if (isMovie === true) {
      this.addMovieForm
        .get('minutes')
        ?.setValidators([Validators.required, this.minutesValidator]);
    } else if (isMovie === false) {
      this.addMovieForm.get('minutes')?.clearValidators();
    }
    this.addMovieForm.get('minutes')?.updateValueAndValidity();
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
    console.log(this.addMovieForm.errors);
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
      console.log('movie added');
    }
  }
}
