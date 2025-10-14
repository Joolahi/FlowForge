import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { isLoggedIn } from '../utils/tokenUtils';
/* 
interface Props{
    children?: React.ReactNode;
}
*/
export const ProtectedRoute = () => {
    return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
};