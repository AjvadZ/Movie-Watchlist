export function renderPlot(movie){
        const fullPlot =  movie.Plot || '';
        return {
                fullPlot,
                shortPlot : fullPlot.length > 120 ? fullPlot.slice(0,120) + "..." : fullPlot
            }
}
