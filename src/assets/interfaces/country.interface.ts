export interface Country {
  name: { common: string };
  cca2: string;
  currencies: { [key: string]: { name: string } };
}
