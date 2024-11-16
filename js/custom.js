const cocktailList = document.getElementById("cocktail-list");
const searchBar = document.getElementById("search-bar");
const modal = document.getElementById("cocktail-modal");
const modalDetails = document.getElementById("modal-details");

const fetchCocktails = async (query = "") => {
  try {
    const apiURL = query
      ? `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
      : "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=g";

    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data.drinks)) {
      displayCocktails(data.drinks);
    } else {
      cocktailList.innerHTML = `<p>No drinks found. Please try another search.</p>`;
    }
  } catch (error) {
    console.error("Error fetching cocktail data:", error);
    cocktailList.innerHTML = `<p>Error fetching data. Please check your connection and try again.</p>`;
  }
};

const displayCocktails = (cocktails) => {
  cocktailList.innerHTML = "";

  const cocktailsToShow = cocktails.slice(0, 12);

  cocktailsToShow.forEach((cocktail) => {
    const cocktailCard = document.createElement("div");
    cocktailCard.classList.add("col-lg-3");

    cocktailCard.innerHTML = ` 
          <div class="cocktail-box">
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <div class="cocktail-info">
                <h2>${cocktail.strDrink}</h2>
                <p>${cocktail.strCategory}</p>
            </div>
          </div>
        `;

    cocktailCard.onclick = () => fetchCocktailDetails(cocktail.idDrink);

    cocktailList.appendChild(cocktailCard);
  });
};

const fetchCocktailDetails = async (id) => {
  try {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    if (data.drinks && data.drinks.length > 0) {
      showModal(data.drinks[0]);
    }
  } catch (error) {
    console.error("Error fetching cocktail details:", error);
  }
};

const showModal = (cocktail) => {
  let ingredients = "";
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];
    if (ingredient) {
      ingredients += `<li>${measure ? measure : ""} ${ingredient}</li>`;
    }
  }

  modalDetails.innerHTML = `
    <div class="modal-main">
      <div class="left">
          <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      </div>
      <div class="right">
          
          <h2>${cocktail.strDrink}</h2>
          <p><strong>Ingredients:</strong></p>
          <ul>${ingredients}</ul>
          <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
          <p><strong>Category:</strong> ${cocktail.strCategory}</p>
          <p><strong>Alcoholic:</strong> ${cocktail.strAlcoholic}</p>
          <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
          

      </div>
    </div>
  `;

  modal.style.display = "block";
};

const closeModal = () => {
  modal.style.display = "none";
};

const searchCocktails = () => {
  const query = searchBar.value.trim();
  if (query) {
    fetchCocktails(query);
  } else {
    fetchCocktails();
  }
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    searchCocktails();
  }
};
window.onclick = (event) => {
  if (event.target == modal) {
    closeModal();
  }
};

window.onload = () => fetchCocktails();
