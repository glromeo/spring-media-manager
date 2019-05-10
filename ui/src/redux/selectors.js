import memoizeOne from "memoize-one";

export function includesTorrents(store) {
    return /torrent/.test(store.getState().search.include);
}

export const filterList = memoizeOne(function (list, [regexp]) {
    return list.filter(function (media) {
        if (media.movie) {
            return media.movie.title.match(regexp);
        } else {
            return media.path.match(regexp);
        }
    })
});

export function filteredMediaList(state) {
    return filterList(state.media.list, state.search.words);
}

export function searchText(state) {
    return state.search.text;
}


function groupMediaByGenre(media) {
    return media.map(m => m.movie).reduce((mediaByGenre, movie) => {
        if (movie && movie.genre_ids) movie.genre_ids.forEach(genreId => {
            const group = mediaByGenre[genreId] || (mediaByGenre[genreId] = []);
            group.push(movie);
        });
        return mediaByGenre;
    }, {});
}

function applyMovieCount(visibleGroups = {}, allGroups = {}) {
    return function (genre) {
        genre.count = visibleGroups[genre.id] ? visibleGroups[genre.id].length : 0;
        genre.total = allGroups[genre.id] ? allGroups[genre.id].length : 0;
        return genre;
    }
}

export function movieGenres(state) {
    const {list: genres = []} = state.genre;
    const {list: media = []} = state.media;
    const filtered = filteredMediaList(state);
    return genres.map(applyMovieCount(
        groupMediaByGenre(filtered),
        groupMediaByGenre(media)
    )).map(g => ({...g, name: g.name.replace(" ", "_")}));
}