import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import type { Cocktail } from "./types";

interface CocktailViewProps {
  cocktail: Cocktail;
}

const CocktailView: React.FC<CocktailViewProps> = ({ cocktail }) => (
  <div>
    <div>{cocktail.strDrink}</div>
    <ul>
      {cocktail.ingredientsAndMeasures.map((obj) => (
        <li>
          {`${obj.name}`}
          {obj?.measure ? `: ${obj.measure}` : ""}
        </li>
      ))}
    </ul>
    <div>{cocktail.strInstructions}</div>
    <img
      alt="cocktail"
      style={{ maxHeight: 300, maxWidth: 400 }}
      src={cocktail.strDrinkThumb}
    />
  </div>
);

const getCocktailSearch = async (name: string): Promise<Cocktail[]> => {
  const resp = await axios.get<Cocktail[]>(
    `${window.location.origin}/api/cocktail`,
    {
      params: {
        name,
      },
    },
  );
  return resp.data;
};

const getRandomCocktail = async (): Promise<Cocktail> => {
  const resp = await axios.get<Cocktail[]>(
    `${window.location.origin}/api/cocktail`,
  );
  return resp.data[0];
};

// These could be routes...
type DisplayMode = "SpecificCocktail" | "SearchResults";

function App() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>();
  const [currentCocktail, setCurrentCocktail] = useState<Cocktail>();
  const [searchName, setSearchName] = useState<string>();
  const [cocktailSearchResults, setCocktailSearchResult] =
    useState<Cocktail[]>();

  useEffect(() => {
    setDisplayMode("SpecificCocktail");
    getRandomCocktail().then((cocktail) => setCurrentCocktail(cocktail));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchName) {
      getCocktailSearch(searchName).then((cocktails) => {
        setCocktailSearchResult(cocktails);
        setDisplayMode("SearchResults");
      });
    }
  };

  const handleGetCocktail = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    getRandomCocktail().then((cocktail) => {
      setCurrentCocktail(cocktail);
      setDisplayMode("SpecificCocktail");
    });
  };

  const handleCocktailListClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    cocktail: Cocktail,
  ) => {
    e.preventDefault();
    setCurrentCocktail(cocktail);
    setDisplayMode("SpecificCocktail");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr" }}>
      <div />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Cocktail App</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="search"
            name="name"
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
        {displayMode === "SpecificCocktail" ? (
          <div>
            {currentCocktail && <CocktailView cocktail={currentCocktail} />}
          </div>
        ) : (
          <div>
            {cocktailSearchResults?.length ? (
              <ul style={{ paddingLeft: "0px" }}>
                {cocktailSearchResults.map((cocktail) => (
                  <li style={{ listStyle: "none" }}>
                    <button
                      style={{
                        background: "none",
                        color: "blue",
                        border: "none",
                        padding: 0,
                        font: "inherit",
                        cursor: "pointer",
                        outline: "inherit",
                        textDecoration: "underline",
                      }}
                      type="button"
                      onClick={(e) => handleCocktailListClick(e, cocktail)}
                    >
                      {cocktail.strDrink}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No results</p>
            )}
          </div>
        )}
        <button type="button" onClick={handleGetCocktail}>
          Get Random cocktail
        </button>
      </div>
      <div />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
