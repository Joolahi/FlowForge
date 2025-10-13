import React, { useState } from 'react';
import { login } from '../services/authService';
import {useNavigate} from 'react-router-dom';
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const data = await login(username, password);
            console.log('Login successful:', data);
            navigate("/dashboard")
        } catch (err) {
            console.error('Login failed:', err);
            setError("Login failed. Please check your credentials.");
        }

    };

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white shadow-md p-6 rounded w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full border px-3 py-2 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />

                    {/* Salasanakenttä silmäikonilla */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border px-3 py-2 rounded pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute inset-y-0 right-2 flex items-center px-1 text-gray-500 hover:text-gray-700"
                            tabIndex={-1} // estää fokuksen nappiin kun käyttäjä tabulaa kentän läpi
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}