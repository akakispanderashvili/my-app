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
import { MovieService } from '../movie-service.service';
import { Observable, debounceTime, map, forkJoin, mergeMap } from 'rxjs';

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
      premiereEventPlace: [{ value: '', disabled: true }],
      releaseDate: ['', Validators.required, this.futureDateValidator],
      genres: this.fb.array([], Validators.required),
      isMovie: [true],
      minutes: [{ value: '', disabled: false }],
      numberOfSeries: [{ value: '', disabled: true }],
      rating: [''],
    });
  }

  futureDateValidator(control: FormControl) {
    const date = control.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      return { futureDate: true };
    }
    return null;
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
      const selectedGenres = formValue.genres
        .map((checked: any, i: number) => (checked ? this.genres[i] : null))
        .filter((value: any) => value !== null);
      const newMovie = {
        name: formValue.name,
        country: formValue.country,
        premiereEventPlace: formValue.premiereEventPlace,
        releaseDate: formValue.releaseDate,
        genres: selectedGenres,
        isMovie: formValue.isMovie,
        minutes: formValue.minutes,
        numberOfSeries: formValue.numberOfSeries,
        rating: formValue.rating,
      };
      this.addMovieForm.reset();
    }
  }
}
