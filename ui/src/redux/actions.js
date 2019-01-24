import base64 from "base-64";
import palette from "../palette";

export const HTTP_HEADERS = new Headers();
const username = 'proxy_username';
const password = 'proxy_password';
HTTP_HEADERS.append('Authorization', `Basic ${base64.encode(username + ":" + password)}`);

export const FETCHING_CONFIG = Symbol("FETCHING_CONFIG");
export const FETCHED_CONFIG = Symbol("FETCHED_CONFIG");

export function fetchConfiguration() {
    return dispatch => {
        dispatch({
            type: FETCHING_CONFIG
        });
        return fetch("/api/configuration", {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(config => dispatch({
                type: FETCHED_CONFIG,
                config,
                receivedAt: Date.now()
            }));
    }
}

export const FETCHING_MOVIE_INFO = Symbol("FETCHING_MOVIE_INFO");
export const FETCHED_MOVIE_INFO = Symbol("FETCHED_MOVIE_INFO");

export function fetchMovieInfoByTitle(title) {
    return dispatch => {
        dispatch({
            type: FETCHING_MOVIE_INFO,
            title
        });
        return fetch(`/api/movie?title=${encodeURIComponent(title)}`, {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(page => page.results[0])
            .then(movieInfo => dispatch({
                type: FETCHED_MOVIE_INFO,
                title,
                movieInfo,
                receivedAt: Date.now()
            }));
    }
}

export const FETCHING_GENRES = Symbol("FETCHING_GENRES");
export const FETCHED_GENRES = Symbol("FETCHED_GENRES");

export function fetchMovieGenres() {
    return (dispatch, getState) => {
        dispatch({type: FETCHING_GENRES});
        return fetch("/api/genre/movie/list", {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(json => dispatch({
                type: FETCHED_GENRES,
                genres: json.genres,
                receivedAt: Date.now()
            }))
            .then(() => dispatch(applySearch(getState().search.text)));
    }
}

export const FETCHING_MEDIA = Symbol("FETCHING_MEDIA");
export const FETCHED_MEDIA = Symbol("FETCHED_MEDIA");

function fetchMedia(searchFilters) {
    return (dispatch, getState) => {
        dispatch({type: FETCHING_MEDIA, searchFilters});
        return fetch("/api/media", {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(list => dispatch({
                type: FETCHED_MEDIA,
                searchFilters: searchFilters,
                media: list.map(function (entry) {
                    const {color: rgb} = entry;
                    return rgb ? {
                        ...entry,
                        color: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.33)`
                    } : {
                        ...entry,
                        color: palette.random()
                    };
                }),
                receivedAt: Date.now()
            }))
            .then(() => dispatch(applySearch(getState().search.text)));
    }
}

function shouldFetchMedia(state, searchFilters) {
    return true;
}

export function fetchMediaIfNeeded(searchFilters) {
    return (dispatch, getState) => {
        if (shouldFetchMedia(getState(), searchFilters)) {
            return dispatch(fetchMedia(searchFilters))
        }
    }
}

export const SELECT_MEDIA = Symbol.for("SELECT_MEDIA");
export const CLEAR_MEDIA_SELECTION = Symbol.for("CLEAR_MEDIA_SELECTION");

export function selectMedia(media) {
    return {
        type: SELECT_MEDIA,
        media: media
    }
}

export function clearMediaSelection() {
    return {
        type: CLEAR_MEDIA_SELECTION
    }
}

export const APPLY_SEARCH = Symbol.for("APPLY_SEARCH");

export function applySearch(search = "") {
    return {
        type: APPLY_SEARCH,
        search: search
    }
}
