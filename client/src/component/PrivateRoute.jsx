import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import isValidUser from './isValidUser';

const PrivateRoute = ({component: Component, path, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isValidUser() ?
            <Component {...props} />
            : <Navigate to=""/>
        )} />
        )
}

export default PrivateRoute;