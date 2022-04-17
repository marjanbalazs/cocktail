export interface CocktailIngredientAndMeasure {
  name: string;
  measure: string;
}

export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate: string;
  strTags: string;
  strVideo: string;
  strCategory: string;
  strIBA: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strInstructionsES: string;
  strInstructionsDE: string;
  strInstructionsFR: string;
  strInstructionsIT: string;
  "strInstructionsZH-HANS": string;
  "strInstructionsZH-HANT": string;
  strDrinkThumb: string;
  ingredientsAndMeasures: CocktailIngredientAndMeasure[];
  strImageSource: string;
  strImageAttribution: string;
  strCreativeCommonsConfirmed: string;
  dateModified: string;
}
