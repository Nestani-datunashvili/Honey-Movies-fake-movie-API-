// ----------Search details --------

const search = document.getElementById("input");
const searchList = document.querySelector(".search_list");
const movieDetails = document.querySelector(".movie_section");

async function loadMovie(searchTerm) {
  const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=cd26d956`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    displayMovieList(data.Search);
  }
}

function findMovies() {
  let searchTerm = search.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide_search_list");
    loadMovie(searchTerm);
  } else {
    searchList.classList.add("hide_search_list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add("search_list_item");
    let moviePoster =
      movies[i].Poster !== "N/A" ? movies[i].Poster : "Not Found";
    movieListItem.innerHTML = `
      <div class="search_item_img">
      <a href="#movie"
    > <img src="${moviePoster}" alt="Movie Poster">
      </a></div>
      <div class="search_item_info">
      <a href="#movie"> <h4>${movies[i].Title}</h4></a>
        <p>${movies[i].Year}</p>
      </div>`;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovie = searchList.querySelectorAll(`.search_list_item`);
  searchListMovie.forEach((movie) => {
    movie.addEventListener(`click`, async () => {
      searchList.classList.add(`hide_search_list`);
      search.textContent = "";
      // console.log(movie.dataset.id);
      const response = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=cd26d956`
      );
      const movieinfo = await response.json();

      displayMovieDetails(movieinfo);
    });
  });
}

// ----------Search result content --------

async function displayMovieDetails(details) {
  movieDetails.classList.remove(`hide_search_list`);
  movieDetails.style.backgroundImage = `url(${details.Poster})`;
  movieDetails.innerHTML = `
  <button class="watchlist back">
  <a href="./index.html"
    ><img src="./img/btn - Previous.png" alt="" />Go back
  </a>
</button>
<div class="content_container">
          <div class="content">
            <h6 class="movie_title">${
              details.Title || "Title not available"
            }</h6>
            <h5 class="movie_title">${
              details.Rated || "Rated not available"
            }</h5>
            <img class="imdb" src="./img/imdb.png" alt="" />
            <p class="movie_plot">
            ${details.Plot || "Plot not available"}
            </p>
            <div class="movie_btn">
              <button class="watchlist">
                <img src="./img/plus.png" alt="" />Watchlist
              </button>
              <button class="watchnow">Watch Now</button>
            </div>
          </div>
          <a href="#movie"><img
            class="poster"
            src="${
              details.Poster !== "N/A" ? details.Poster : `image not found`
            }"
            alt="movie-poster"
          /></a>
  `;
}

// ----------Card Api--------

async function getInfoCard() {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=Title&apikey=cd26d956`
    );
    const data = await response.json();

    console.log("Search response:", data); // Log the search response

    if (data.Search && data.Search.length > 0) {
      displayCard(data.Search);
    } else {
      console.error("No search results found.");
    }
  } catch (error) {
    console.error("Error fetching data from OMDB API:", error);
  }
}

async function displayCard(movies) {
  const carContainer = document.querySelector(".most_rated");

  const numCards = 3;
  const promises = movies.slice(0, numCards).map(async (card) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${card.imdbID}&apikey=cd26d956`
      );
      const data = await response.json();

      console.log("Movie details:", data);

      const ratedCard = document.createElement("div");
      ratedCard.classList.add("toprated-cards");
      ratedCard.innerHTML = `
        <div class="ratedcard_container">
          <div class="ratedcard_img">
            <div class="rating"><h6>${data.imdbRating}</h6></div>
            <img src="${data.Poster}" alt="" />
          </div>
          <div class="ratedcard_content">
            <h3 class="ratedcard_title">${data.Title}</h3>
            <img src="./img/Review.png" alt="" />
            <p class="ratedcard_year">${data.Year}</p>
            <p class="ratedcard_description">${data.Plot}</p>
          </div>
        </div>
      `;
      carContainer.appendChild(ratedCard);
    } catch (error) {
      console.error(
        `Error fetching details for movie ID ${card.imdbID}:`,
        error
      );
    }
  });

  await Promise.all(promises);
}

getInfoCard();

// ----------burgerMenu--------

const burgerMenu = document.getElementById("burger-menu");
const navList = document.querySelector(".navigation-list");

burgerMenu.addEventListener("click", () => {
  navList.classList.toggle("open");
});
