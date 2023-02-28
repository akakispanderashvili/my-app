export interface NewMovie {
  name: string;
  country: string;
  premiereEventPlace?: string;
  releaseDate: Date;
  isMovie: boolean | null;
  minutes?: number;
  numberOfSeries?: number;
  rating?: number;
}
