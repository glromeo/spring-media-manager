import palette from "../palette";
import {HTTP_HEADERS} from "../util/constants";

export const CONFIGURATION_FETCH = "CONFIGURATION_FETCH";
export const CONFIGURATION_FETCH_SUCCESS = "CONFIGURATION_FETCH_SUCCESS";
export const CONFIGURATION_FETCH_FAILURE = "CONFIGURATION_FETCH_FAILURE";

export function fetchConfiguration() {
    return dispatch => {
        dispatch({
            type: CONFIGURATION_FETCH
        });
        return fetch("/api/configuration", {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(config => dispatch({
                type: CONFIGURATION_FETCH_SUCCESS,
                config,
                receivedAt: Date.now()
            }))
            .catch(error => dispatch({
                type: CONFIGURATION_FETCH_FAILURE,
                error,
                receivedAt: Date.now()
            }));
    }
}

export const MOVIE_DETAILS_FETCH = "MOVIE_DETAILS_FETCH";
export const MOVIE_DETAILS_FETCH_SUCCESS = "MOVIE_DETAILS_FETCH_SUCCESS";
export const MOVIE_DETAILS_FETCH_FAILURE = "MOVIE_DETAILS_FETCH_FAILURE";

export function fetchMovieDetailsByTitle(title) {
    return dispatch => {
        dispatch({
            type: MOVIE_DETAILS_FETCH,
            title
        });
        return fetch(`/api/movie?title=${encodeURIComponent(title)}`, {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(page => page.results[0])
            .then(details => dispatch({
                type: MOVIE_DETAILS_FETCH_SUCCESS,
                title,
                details,
                receivedAt: Date.now()
            }))
            .catch(error => dispatch({
                type: MOVIE_DETAILS_FETCH_FAILURE,
                error,
                receivedAt: Date.now()
            }));
    }
}

export const MOVIE_GENRES_FETCH = "MOVIE_GENRES_FETCH";
export const MOVIE_GENRES_FETCH_SUCCESS = "MOVIE_GENRES_FETCH_SUCCESS";
export const MOVIE_GENRES_FETCH_FAILURE = "MOVIE_GENRES_FETCH_FAILURE";

export function fetchMovieGenres() {
    return (dispatch, getState) => {
        dispatch({type: MOVIE_GENRES_FETCH});
        return fetch("/api/genre/movie/list", {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(json => dispatch({
                type: MOVIE_GENRES_FETCH_SUCCESS,
                genres: json.genres,
                receivedAt: Date.now()
            }))
            .catch(error => dispatch({
                type: MOVIE_GENRES_FETCH_FAILURE,
                error,
                receivedAt: Date.now()
            }));
    }
}

export const MEDIA_FETCH = "MEDIA_FETCH";
export const MEDIA_FETCH_SUCCESS = "MEDIA_FETCH_SUCCESS";
export const MEDIA_FETCH_FAILURE = "MEDIA_FETCH_FAILURE";

export function fetchMedia(searchFilters) {
    return (dispatch, getState) => {
        dispatch(deselectMedia());
        dispatch({type: MEDIA_FETCH});
        return fetch("/api/media", {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(list => dispatch({
                type: MEDIA_FETCH_SUCCESS,
                media: list.map(function (entry) {
                    const {color: rgb} = entry;
                    return rgb ? {
                        ...entry,
                        color: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
                    } : {
                        ...entry,
                        color: palette.random()
                    };
                }),
                receivedAt: Date.now()
            }))
            .catch(error => dispatch({
                type: MEDIA_FETCH_FAILURE,
                error,
                receivedAt: Date.now()
            }));
    }
}

export const MEDIA_SELECT = "MEDIA_SELECT";
export const MEDIA_DESELECT = "MEDIA_DESELECT";

export function selectMedia(media) {
    return {
        type: MEDIA_SELECT,
        media: media
    }
}

export function deselectMedia() {
    return {
        type: MEDIA_DESELECT
    }
}

export const SEARCH_APPLY = "SEARCH_APPLY";

export function applySearch(search = "") {
    return {
        type: SEARCH_APPLY,
        search: search
    }
}

export const MEDIA_PLAYBACK = "MEDIA_PLAYBACK";

export function playbackMedia(media) {
    return {
        type: MEDIA_PLAYBACK,
        media: media
    }
}

export const TORRENTS_SEARCH = "TORRENTS_SEARCH";

export function searchTorrents() {
    return {
        type: TORRENTS_SEARCH
    }
}
