// API KEY 4bb20c9d
import { renderPlot } from "./Data/renderPlot.js";
const form = document.getElementById('movie-form')
let moviesArr = []
const mainBody = document.querySelector('main')
let myWatchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];



form.addEventListener('submit', (e)=>{
    moviesArr = []
    e.preventDefault();
    
    const formData = new FormData(form);
    let movieName = formData.get('movie')

    
fetch(`http://www.omdbapi.com/?s=${movieName}&apikey=4bb20c9d&plot=full`)
.then(res => res.json())
    .then(data => {
        if (data.Response === "True"){
            mainBody.classList.remove('main-start')
            mainBody.classList.add('main')
        let tempMoviesArr = data.Search

            const promises = tempMoviesArr.map( movie => 
                fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=4bb20c9d&plot=full`)
                .then(res => res.json())
            )
            Promise.all(promises).then(results =>{
                    moviesArr = results;
                    renderMovie()
            })
        }else{
            mainBody.classList.remove('main')
            mainBody.classList.add('main-start')
            mainBody.innerHTML = `<div class='not-found-text'>Unable to find what you’re looking for.<br> Please try another search.</div>`
        }

    })                         
})

function renderMovie(){
    let moviesList = ''
    for (let movie of moviesArr){

        const{fullPlot, shortPlot} = renderPlot(movie)
        moviesList += `
        <div class='movie-container'>    
            <img src="${movie.Poster}" onerror="this.onerror=null; this.src='./assets/img-unavailable.jpg';" alt="Image" />        
            <div>
                <h3 class='movie-title'>${movie.Title}<i class="fa-solid fa-star"></i> <span class='rating'>${movie.imdbRating}</span></h3>
                <p class='movie-info'>${movie.Runtime}  
                <span class='movie-genre'>${movie.Genre}</span> 
                <button class='add-to-watchlist-btn' data-movie=${movie.imdbID}>
                <i class="fa-solid fa-circle-plus" data-movie=${movie.imdbID}></i> Watchlist</button>
                </p> 
                <p class='movie-plot' id=${movie.imdbID}>
                    ${shortPlot}
                    ${fullPlot.length > 120 ? `<button class='read-more-btn' data-readplot=${movie.imdbID}>Read more</button>` : '' }
                </p>
            </div>
        </div> 
        <hr>
        `
    } 
     document.querySelector('main').innerHTML  = moviesList
}


    document.body.addEventListener('click', (e)=>{
        
        if(e.target.dataset.readplot){
            const tagetMovie = e.target.dataset.readplot
            const moviePlot = document.getElementById(tagetMovie)
            moviesArr.forEach((movie)=>{
                if(tagetMovie === movie.imdbID){
                    moviePlot.innerHTML = `${movie.Plot} <button class='read-less-btn' data-collapsePlot=${tagetMovie}> Read Less</button>`
                }
            })
        }
        else if (e.target.dataset.collapseplot){  
            const tagetMovie = e.target.dataset.collapseplot

            const moviePlot = document.getElementById(tagetMovie)

            moviesArr.forEach((movie)=>{
                if(tagetMovie === movie.imdbID){
                    const{fullPlot, shortPlot} = renderPlot(movie)
                    moviePlot.innerHTML = `
                        ${shortPlot}
                        ${fullPlot.length > 120 ? `<button class='read-more-btn' data-readplot=${movie.imdbID}>Read more</button>` : '' }

                    `
                }
            })
        }
        else if(e.target.dataset.movie){
            const movieId = e.target.dataset.movie
            const movieToAdd = moviesArr.find(movie => movie.imdbID === movieId)

            if (movieToAdd) {
                const isAlreadyInWatchlist = myWatchlist.some(movie => movie.imdbID === movieId)

                if (!isAlreadyInWatchlist) {
                    myWatchlist.push(movieToAdd)
                    alert('Added to watchlist!')

                } else {
                    alert('Movie already added to watchlist')
                }
            }
            localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist))
        }
    })

  
