import {Routes, Route} from 'react-router-dom';

// Import page components
import {DashboardPage} from '../pages/DashboardPage';
import {NotFoundPage} from '../pages/NotFoundPage';
import {LoginPage} from '../pages/LoginPage';
import {RegisterPage} from '../pages/RegisterPage';


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage/>} />
            <Route path="*" element={<NotFoundPage/>} />
            <Route path ="/login" element={<LoginPage/>} />
            <Route path ="/register" element={<RegisterPage/>} />
            
        </Routes>
    );
};

