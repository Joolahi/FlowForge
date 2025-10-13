import {Routes, Route} from 'react-router-dom';

// Import page components
import {DashboardPage} from '../pages/DashboardPage';
import {NotFoundPage} from '../pages/NotFoundPage';
import {LoginPage} from '../pages/LoginPage';
import {RegisterPage} from '../pages/RegisterPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { FrontPage } from  '../pages/FrontPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/*All routes without login */}
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/*Routes with login*/}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage/>} />
            </Route>

            {/*404 route */}
            <Route path="*" element={<NotFoundPage/>} />

            
        </Routes>
    );
};

