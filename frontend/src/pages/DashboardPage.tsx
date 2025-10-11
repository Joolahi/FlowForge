import React from 'react';
import { useNavigate } from 'react-router-dom';
import {logout} from '../services/authService';

function DashboardPage() {
    const navigate = useNavigate();
    return(
    <div>
        <div>Workflow Page</div>
    <div>
        <button onClick={() => navigate('/login')}>
            login
        </button>
        <button onClick={() => navigate('/register')}>
            register
        </button>
        <button onClick={() => logout()}>
            logout
        </button>
    </div>
    </div>
    );
}

export {DashboardPage}