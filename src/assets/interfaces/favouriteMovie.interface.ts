import { Country } from '../../assets/interfaces/country.interface';

export interface FavoriteMovie {
  id: number;
  title: string;
  year: number;
  actors: string;
  countries: Country[];
  rating: number;
  comment: string;
}
