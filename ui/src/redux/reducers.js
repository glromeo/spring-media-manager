import {combineReducers} from "redux";
import {
    MEDIA_DESELECT,
    MEDIA_FETCH,
    MEDIA_FETCH_FAILURE,
    MEDIA_FETCH_SUCCESS, MEDIA_PLAYBACK,
    MEDIA_SELECT, MOVIE_GENRES_FETCH, MOVIE_GENRES_FETCH_FAILURE,
    MOVIE_GENRES_FETCH_SUCCESS,
    SEARCH_APPLY, TORRENTS_SEARCH
} from "./actions";

const urlSearchParams = new URLSearchParams(window.location.search);

function withURLSearchParams(names, callback) {
    return callback(names.map(name => urlSearchParams.get(name)));
}

function Reducer(target, defaultState) {
    return function (state = defaultState, action) {
        const reducer = target[action.type];
        return reducer ? Object.assign({}, state, reducer(state, action)) : state;
    }
}

const media = Reducer({

    [MEDIA_FETCH]: (state, action) => ({
        isFetching: true,
        list: [],
        error: false
    }),

    [MEDIA_FETCH_SUCCESS]: (state, action) => ({
        isFetching: false,
        list: action.media,
        lastUpdated: action.receivedAt
    }),

    [MEDIA_FETCH_FAILURE]: (state, action) => ({
        isFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
    }),

    [MEDIA_SELECT]: (state, action) => ({
        selected: state.selected === action.media ? null : action.media
    }),

    [MEDIA_DESELECT]: (state, action) => ({
        selected: null
    }),

}, {list: []});

const genre = Reducer({

    [MOVIE_GENRES_FETCH]: (state, action) => ({
        isFetching: true,
        list: [],
        error: false
    }),

    [MOVIE_GENRES_FETCH_SUCCESS]: (state, action) => ({
        isFetching: false,
        list: action.genres,
        lastUpdated: action.receivedAt
    }),

    [MOVIE_GENRES_FETCH_FAILURE]: (state, action) => ({
        isFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
    }),

}, {list: []});

const search = Reducer({

    [SEARCH_APPLY]: (state, action) => ({
        text: action.search,
        words: action.search ? [new RegExp(action.search, "i")] : []
    }),

    [TORRENTS_SEARCH]: (state, action) => ({
        torrents: true
    }),

}, withURLSearchParams(["query", "include"], ([query, include]) => ({
    text: query,
    words: query ? [new RegExp(query, "i")] : [],
    include: /torrent/.test(include)
})));

const playback = Reducer({

    [MEDIA_PLAYBACK]: (state, action) => ({
        media: action.media
    }),

}, {});

export default combineReducers({media, genre, search, playback});