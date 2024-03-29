import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {isLoggedIn} from "../auth/authContainer";


const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isLoggedIn() ?
                <Component {...props} />
                : <Redirect to="/signin" />
        )} />
    );
};

export default PrivateRoute;
