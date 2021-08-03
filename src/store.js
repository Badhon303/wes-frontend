import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers'

const configureStore = () => {
  const composeEnhancers = process.env.NODE_ENV !== 'production'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      shouldHotReload: false,
    })
    : compose

  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

  if (module.hot) {
    // Enable webpack hot module replacement for reducers
    module.hot.accept(
      './reducers',
      () => {
        const rootReducer = require('./reducers').default
        store.replaceReducer(rootReducer)
      },
    )
  }

  return store
}

export default configureStore
