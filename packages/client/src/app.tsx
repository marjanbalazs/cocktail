import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

interface Cocktail {
    idDrink:                     string;
    strDrink:                    string;
    strDrinkAlternate:           string;
    strTags:                     string;
    strVideo:                    string;
    strCategory:                 string;
    strIBA:                      string;
    strAlcoholic:                string;
    strGlass:                    string;
    strInstructions:             string;
    strInstructionsES:           string;
    strInstructionsDE:           string;
    strInstructionsFR:           string;
    strInstructionsIT:           string;
    "strInstructionsZH-HANS":    string;
    "strInstructionsZH-HANT":    string;
    strDrinkThumb:               string;
    strIngredient1:              string;
    strIngredient2:              string;
    strIngredient3:              string;
    strIngredient4:              string;
    strIngredient5:              string;
    strIngredient6:              string;
    strIngredient7:              string;
    strIngredient8:              string;
    strIngredient9:              string;
    strIngredient10:             string;
    strIngredient11:             string;
    strIngredient12:             string;
    strIngredient13:             string;
    strIngredient14:             string;
    strIngredient15:             string;
    strMeasure1:                 string;
    strMeasure2:                 string;
    strMeasure3:                 string;
    strMeasure4:                 string;
    strMeasure5:                 string;
    strMeasure6:                 string;
    strMeasure7:                 string;
    strMeasure8:                 string;
    strMeasure9:                 string;
    strMeasure10:                string;
    strMeasure11:                string;
    strMeasure12:                string;
    strMeasure13:                string;
    strMeasure14:                string;
    strMeasure15:                string;
    strImageSource:              string;
    strImageAttribution:         string;
    strCreativeCommonsConfirmed: string;
    dateModified:                string;
}

interface CocktailViewProps {
    cocktail: Cocktail;
}

interface CocktailIngredientAndMeasure {
    name: string;
    measure: string;
}

const collectIngredientsAndMesures = (cocktail: Cocktail): CocktailIngredientAndMeasure[] => {
    const ingredientKeys = Object.entries(cocktail).filter(([key, val]) => key.startsWith('strIngredient') && val);
    return ingredientKeys.map(([key, val]) => {
        const measureIndex = key.split('strIngredient')[1];
        return {
            name: val,
            measure: cocktail[`strMeasure${measureIndex}` as keyof Cocktail] ?? undefined,
        }
    })
}

const CocktailView: React.FC<CocktailViewProps> = ({ cocktail }) => {
    const collectedIngredients = collectIngredientsAndMesures(cocktail);
    return (
        <div>
            <div>
                {cocktail.strDrink}
            </div>
            <ul>
                {collectedIngredients.map((obj) => <li>{`${obj.name}`}{obj?.measure ? `: ${obj.measure}`: ''}</li>)}   
            </ul>
            <div>
                {cocktail.strInstructions}
            </div>
            <img style={{ maxHeight: 300, maxWidth: 400 }} src={cocktail.strDrinkThumb} />
        </div>
    )
}

const getCocktailSearch = async (name: string): Promise<Cocktail[]> => {
    const resp = await axios.get<{ drinks: Cocktail[] }>("http://localhost:3000/api/cocktail", {
        params: {
            name,
        }
    });
    return resp.data.drinks;
};

const getRandomCocktail = async (): Promise<Cocktail> => {
    const resp = await axios.get<{ drinks: Cocktail[] }>("http://localhost:3000/api/cocktail");
    return resp.data.drinks[0];
};

type DisplayMode = 'RandomCocktail' | 'SearchResults';

const App = () => {

    const [displayMode, setDisplayMode] = useState<DisplayMode>();
    const [currentCocktail, setCurrentCocktail] = useState<Cocktail>();
    const [searchName, setSearchName] = useState<string>();
    const [cocktailSearchResults, setCocktailSearchResult] = useState<Cocktail[]>();

    useEffect(() => {
        setDisplayMode('RandomCocktail');
        getRandomCocktail().then(cocktail => setCurrentCocktail(cocktail));
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchName) {
            getCocktailSearch(searchName)
                .then(cocktails => {
                    setCocktailSearchResult(cocktails);
                    setDisplayMode('SearchResults');
                });
        }
    }

    const handleGetCocktail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        getRandomCocktail()
            .then(cocktail => {
                setCurrentCocktail(cocktail);
                setDisplayMode('RandomCocktail');
            });
    };

    return (
        <div>
            <h2>Cocktail App</h2>
            <form onSubmit={handleSearchSubmit}>
                <input type="search" name="name" onChange={(e) => setSearchName(e.target.value)}/>
                <input type="submit" value="Submit" />
            </form>
            {
                displayMode === 'RandomCocktail' ? (
                    <div>
                        {currentCocktail && <CocktailView cocktail={currentCocktail}/>}
                        <button onClick={handleGetCocktail}>Get another cocktail</button>
                    </div>
                 ) :
                 <div>
                     {
                        cocktailSearchResults?.length ? <ul>{cocktailSearchResults.map(cocktail => <li><a onClick={(e) => {
                            e.preventDefault();
                            setCurrentCocktail(cocktail);
                            setDisplayMode('RandomCocktail');
                        }}>{cocktail.strDrink}</a></li>)}</ul> : <p>No results</p>
                     }
                 </div>
            }
        </div>

    );
}

ReactDOM.render(<App />, document.getElementById("root"));