import {combineReducers} from "redux";
import {FETCHED_GENRES, FETCHED_MEDIA, FETCHING_GENRES, FETCHING_MEDIA} from "./actions";

function Reducer(target) {
    return function (state = {}, action) {
        const reducer = target[action.type];
        return reducer ? Object.assign({}, state, reducer(state, action)) : state;
    }
}

const media = Reducer({

    [FETCHING_MEDIA]: (state, action) => ({
        isFetching: true
    }),

    [FETCHED_MEDIA]: (state, action) => ({
        isFetching: false,
        list: action.media,
        lastUpdated: action.receivedAt
    })

});

const genre = Reducer({

    [FETCHING_GENRES]: (state, action) => ({
        list: []
    }),

    [FETCHED_GENRES]: (state, action) => ({
        list: action.genres,
        lastUpdated: action.receivedAt
    })

});

export default combineReducers({media, genre});