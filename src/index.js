import React, {Suspense} from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import configureStore from './store'
import App from './App'
import './index.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-multi-carousel/lib/styles.css';
import "react-datetime/css/react-datetime.css";
import ThemedSuspense from "./components/ThemedSuspense";


// import * as serviceWorker from './serviceWorker'

const history = createBrowserHistory()
const store = configureStore()


ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter history={history}>
                <Suspense fallback={<ThemedSuspense/>}>
                   <App/>
                </Suspense>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)


// const render = Component => {
//   ReactDOM.render(
//     <Provider store={store}>
//       <BrowserRouter history={history}>
//         <Component />
//       </BrowserRouter>
//     </Provider>,
//     document.getElementById('root'),
//   )
// }
//
// render(App)
//
// if (module.hot) {
//   module.hot.accept('./App', () => {
//     const App = require('./App').default
//     render(App)
//   })
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// serviceWorker.unregister()
