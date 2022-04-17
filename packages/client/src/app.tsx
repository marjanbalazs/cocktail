import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import type { Cocktail } from './types';

interface CocktailViewProps {
    cocktail: Cocktail;
}

const CocktailView: React.FC<CocktailViewProps> = ({ cocktail }) => (
  <div>
    <div>
      {cocktail.strDrink}
    </div>
    <ul>
      {cocktail.ingredientsAndMeasures.map((obj) => (
        <li>
          {`${obj.name}`}
          {obj?.measure ? `: ${obj.measure}` : ''}
        </li>
      ))}
    </ul>
    <div>
      {cocktail.strInstructions}
    </div>
    <img alt="cocktail" style={{ maxHeight: 300, maxWidth: 400 }} src={cocktail.strDrinkThumb} />
  </div>
);

const getCocktailSearch = async (name: string): Promise<Cocktail[]> => {
  const resp = await axios.get<Cocktail[]>(`${window.location.origin}/api/cocktail`, {
    params: {
      name,
    },
  });
  return resp.data;
};

const getRandomCocktail = async (): Promise<Cocktail> => {
  const resp = await axios.get<Cocktail[]>(`${window.location.origin}/api/cocktail`);
  return resp.data[0];
};

type DisplayMode = 'RandomCocktail' | 'SearchResults';

function App() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>();
  const [currentCocktail, setCurrentCocktail] = useState<Cocktail>();
  const [searchName, setSearchName] = useState<string>();
  const [cocktailSearchResults, setCocktailSearchResult] = useState<Cocktail[]>();

  useEffect(() => {
    setDisplayMode('RandomCocktail');
    getRandomCocktail().then((cocktail) => setCurrentCocktail(cocktail));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchName) {
      getCocktailSearch(searchName)
        .then((cocktails) => {
          setCocktailSearchResult(cocktails);
          setDisplayMode('SearchResults');
        });
    }
  };

  const handleGetCocktail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    getRandomCocktail()
      .then((cocktail) => {
        setCurrentCocktail(cocktail);
        setDisplayMode('RandomCocktail');
      });
  };

  return (
    <div>
      <h2>Cocktail App</h2>
      <form onSubmit={handleSearchSubmit}>
        <input type="search" name="name" onChange={(e) => setSearchName(e.target.value)} />
        <input type="submit" value="Submit" />
      </form>
      {
                displayMode === 'RandomCocktail' ? (
                  <div>
                    {currentCocktail && <CocktailView cocktail={currentCocktail} />}
                  </div>
                )
                  : (
                    <div>
                      {
                        cocktailSearchResults?.length ? (
                          <ul>
                            {cocktailSearchResults.map((cocktail) => (
                              <li>
                                <a onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentCocktail(cocktail);
                                  setDisplayMode('RandomCocktail');
                                }}
                                >
                                  {cocktail.strDrink}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : <p>No results</p>
                     }
                    </div>
                  )
            }
      <button type="button" onClick={handleGetCocktail}>Get Random cocktail</button>
    </div>

  );
}

ReactDOM.render(<App />, document.getElementById('root'));
