import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import isValidUser from './isValidUser.js';

const PublicRoute = ({component: Component, restricted, path, ...rest}) => {
    // restricted
    // 1) true : 로그인한 상태에서는 접근 불가능 (로그인이나 회원가입)
    // 2) false : 로그인 여부와 관계없이 접근 가능한 페이지
    return (
        <Route {...rest} render={props => (
            isValidUser() && restricted ?
            <Navigate to="/landing" />
            : <component {...props} />
        )} />
        )
}

export default PublicRoute;