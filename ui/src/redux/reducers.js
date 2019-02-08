import {combineReducers} from "redux";
import {
    APPLY_SEARCH,
    FETCHED_GENRES,
    FETCHED_MEDIA,
    FETCHING_GENRES,
    FETCHING_MEDIA,
    PLAYBACK_MEDIA,
    SELECT_MEDIA
} from "./actions";

function Reducer(target) {
    return function (state = {all:[], playback:{}}, action) {
        const reducer = target[action.type];
        return reducer ? Object.assign({}, state, reducer(state, action)) : state;
    }
}

function filterMedia(search = "") {
    const regex = new RegExp(search, "i");
    return function (media) {
        if (media.movie) {
            return media.movie.title.match(regex);
        } else {
            return media.path.match(regex);
        }
    };
}

const media = Reducer({

    [FETCHING_MEDIA]: (state, action) => ({
        isFetching: true,
        all: [],
        visible: []
    }),

    [FETCHED_MEDIA]: (state, action) => ({
        isFetching: false,
        all: action.media,
        visible: action.media,
        lastUpdated: action.receivedAt
    }),

    [SELECT_MEDIA]: (state, action) => ({
        selected: state.selected === action.media ? null : action.media
    }),

    [APPLY_SEARCH]: (state, action) => ({
        search: action.search,
        visible: media.visible = action.search ? state.all.filter(filterMedia(action.search)) : state.all
    })

});

function groupMediaByGenre(media) {
    return media.map(m => m.movie).reduce((mediaByGenre, movie, index) => {
        if (movie) movie.genre_ids.forEach(genreId => {
            const group = mediaByGenre[genreId] || (mediaByGenre[genreId] = []);
            group.push(movie);
        });
        return mediaByGenre;
    }, {});
}

function applyMovieCount(visibleGroups, allGroups) {
    return function (genre) {
        genre.count = visibleGroups[genre.id] ? visibleGroups[genre.id].length : 0;
        genre.total = allGroups[genre.id] ? allGroups[genre.id].length : 0;
        return genre;
    }
}

const genre = Reducer({

    [FETCHING_MEDIA]: (state, action) => ({
        mediaByGenre: {}
    }),

    [FETCHED_MEDIA]: (state, action) => ({
        mediaByGenre: groupMediaByGenre(action.media)
    }),

    [FETCHING_GENRES]: (state, action) => ({
        all: [],
        visible: []
    }),

    [FETCHED_GENRES]: (state, action) => ({
        all: action.genres,
        visible: action.genres,
        lastUpdated: action.receivedAt
    }),

    [APPLY_SEARCH]: (state, action) => ({
        visible: state.all
            .map(applyMovieCount(action.search ? groupMediaByGenre(media.visible) : state.mediaByGenre, state.mediaByGenre))
            .filter(genre => genre.count > 0)
    })
});

const search = Reducer({

    [APPLY_SEARCH]: (state, action) => ({
        text: action.search
    }),

});

const playback = Reducer({

    [PLAYBACK_MEDIA]: (state, action) => ({
        movie: action.movie,
        media: action.media
    }),

});

export default combineReducers({media, genre, search, playback});