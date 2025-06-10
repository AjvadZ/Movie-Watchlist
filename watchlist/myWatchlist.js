import { renderPlot } from "../Data/renderPlot.js";
let myWatchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
const mainBody = document.querySelector('main')


function renderMyWatchlist(){
    if(!mainBody) return;
    if(myWatchlist.length > 0){
    let myWatchlistHTML = myWatchlist.map((movie) => {
    const{fullPlot, shortPlot} = renderPlot(movie)
    return` 
    <div class='movie-container'>    
            <img src="${movie.Poster}" onerror="this.onerror=null; this.src='./assets/img-unavailable.jpg';" alt="Image" />        
            <div>
                <h3 class='movie-title'>${movie.Title}<i class="fa-solid fa-star"></i> <span class='rating'>${movie.imdbRating}</span></h3>
                <p class='movie-info'>${movie.Runtime}  
                <span class='movie-genre'>${movie.Genre}</span> 
                <button class='add-to-watchlist-btn' data-movie=${movie.imdbID}>
                <i class="fa-solid fa-circle-minus" data-movie=${movie.imdbID}></i> Watchlist</button>
                
                </p> 
                <p class='movie-plot' id=${movie.imdbID}>
                    ${shortPlot}
                    ${fullPlot.length > 120 ? `<button class='read-more-btn' data-readplot=${movie.imdbID}>Read more</button>` : '' }
                </p>
            </div>
        </div> 
        <hr>
        `
    }).join('')
    mainBody.innerHTML = myWatchlistHTML
    }else {
        mainBody.innerHTML = `
        <div class="welcome-text">
            <p class="info">Your watchlist is looking a little empty...</p>
            <a href="../index.html" class="movie-search"><i class="fa-solid fa-circle-plus"></i> Let's add some movies!</a>
        </div>
        `;
    }
}

document.body.addEventListener('click', (e)=>{
    if(e.target.dataset.movie){
        myWatchlist = myWatchlist.filter((movie)=> movie.imdbID !== e.target.dataset.movie)
        localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist))
        renderMyWatchlist()
    }
})

renderMyWatchlist()
