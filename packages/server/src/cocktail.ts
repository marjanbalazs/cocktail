import express from "express";
import axios from 'axios';
import { logger } from "./util"; 
import type { CocktailApiResponse, Cocktail, CocktailIngredientAndMeasure, CocktailRaw } from "./types";

const COCKTAIL_URL = process.env.COCKTAIL_URL;
const COCKTAIL_API_KEY = process.env.COCKTAIL_API_KEY;

const apiRouter = express.Router();

const mapCocktailRowToCocktail = (cocktail: CocktailRaw): Cocktail => {
    const newCocktail: any = { ...cocktail };
    newCocktail.ingredientsAndMeasures = collectIngredientsAndMesures(cocktail);
    Object.keys(newCocktail).forEach(key => {
        if (key.startsWith('strIngredient') || key.startsWith('strMeasure')) {
            delete newCocktail[key];
        }
    });
    return newCocktail as Cocktail;
}

const collectIngredientsAndMesures = (cocktail: CocktailRaw): CocktailIngredientAndMeasure[] => {
    const ingredientKeys = Object.entries(cocktail).filter(([key, val]) => key.startsWith('strIngredient') && val);
    return ingredientKeys.map(([key, val]) => {
        const measureIndex = key.split('strIngredient')[1];
        return {
            name: val,
            measure: cocktail[`strMeasure${measureIndex}` as keyof CocktailRaw] ?? undefined,
        }
    })
}

apiRouter.get('/cocktail', (req, res) => {
    const queryParams = req.query;
    if (queryParams.name) {
        logger.debug("Requesting cocktail with name:", queryParams.name)
        axios.get<CocktailApiResponse>(`${COCKTAIL_URL}/${COCKTAIL_API_KEY}/search.php`, {
            params: {
                s: queryParams.name,
            }
        })
        .then((resp) => res.json(resp.data.drinks.map(mapCocktailRowToCocktail)))
        .catch((err) => {
            logger.error(JSON.stringify(err, null ,2));
            res.status(500);
        });
    } else {
        logger.debug("Requesting random cocktail...");
        axios.get<CocktailApiResponse>(`${COCKTAIL_URL}/${COCKTAIL_API_KEY}/random.php`)
        .then((resp) => res.json(resp.data.drinks.map(mapCocktailRowToCocktail)))
        .catch((err) => {
            logger.error(JSON.stringify(err, null ,2));
            res.status(500);
        });
    }
});



export default apiRouter;