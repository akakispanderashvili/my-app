import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MovieInfoComponent } from './app-movie-info/app-movie-info.component';
import { MovieCombinerComponent } from './movie-combiner/movie-combiner.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MovieRatingComponent } from './movie-rating/movie-rating.component';
import { AppRoutingModule } from './app-routing.module';
import { FavouritesComponent } from './favourites/favourites.component';
import { NewMovieComponent } from './new-movie/new-movie.component';
import { AddNewMovieComponent } from './add-new-movie/add-new-movie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxStarRatingModule } from 'ngx-star-rating';

@NgModule({
  declarations: [
    AppComponent,
    MovieInfoComponent,
    MovieCombinerComponent,
    MovieRatingComponent,
    FavouritesComponent,
    NewMovieComponent,
    AddNewMovieComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxStarRatingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
