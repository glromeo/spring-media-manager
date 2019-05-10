import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import combinedReducer from './reducers'
import {composeWithDevTools} from 'redux-devtools-extension'

const logger = createLogger();
const middleware = applyMiddleware(thunk, logger);
const enhancer = composeWithDevTools(middleware);

export default function configureStore(preloadedState) {
    return createStore(combinedReducer, preloadedState, enhancer);
}