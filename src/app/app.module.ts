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

@NgModule({
  declarations: [
    AppComponent,
    MovieInfoComponent,
    MovieCombinerComponent,
    MovieRatingComponent,
    FavouritesComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
