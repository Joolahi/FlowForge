import React, { Children } from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { isLoggedIn } from '../utils/tokenUtils';

interface Props{
    children?: React.ReactNode;
}

export const ProtectedRoute = ({children} : Props) => {
    if (!isLoggedIn())  {
        return <Navigate to="/login"/>
    }

    if (!children){
        return <Outlet/>
    }

    return <>{children}</>
} 