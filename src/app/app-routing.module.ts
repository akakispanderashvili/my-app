import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieInfoComponent } from './app-movie-info/app-movie-info.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { MovieCombinerComponent } from './movie-combiner/movie-combiner.component';
const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: MovieInfoComponent },
  { path: 'movie/:id', component: MovieInfoComponent },
  { path: 'favourites', component: FavouritesComponent },

  // { path: 'add-rating', component: MovieRatingComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
