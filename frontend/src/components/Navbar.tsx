import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import { logout } from '../services/authService';

export function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate("/");
    }

    const goBack = () => {
        navigate(-1);
    }

    return (
        <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <button
                    onClick={goBack}
                    className="text-gray-600 hover:text-blue-600 font-medium"
                >
                    ← Takaisin
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`hover:text-blue-600 ${location.pathname === '/dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => navigate('/workflowEditor')}
                    className={`hover:text-blue-600 ${location.pathname === '/workflowEditor' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                    Workflow
                </button>
                <button
                    onClick={() => navigate('/settings')}
                    className={`hover:text-blue-600 ${location.pathname === '/settings' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                    Asetukset
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
                >
                    Kirjaudu ulos
                </button>
            </div>
        </nav>
    );
};