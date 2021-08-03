import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {isLoggedIn} from "../auth/authContainer";



const PublicRoute = ({component: Component, restricted, ...rest}) => {

    return (
        <Route {...rest} render={props => (
            isLoggedIn()  && restricted ?
                <Redirect to={"/buy"} />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;
