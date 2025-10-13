import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getProjects } from '../services/projectService';

interface Project {
    id: number;
    name: string;
    description: string;
    progress: number;
}

export function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">Your Projects</h1>
                    <div className="space-x-2">
                        <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
                        <button onClick={() => navigate('/register')} className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
                        <button onClick={() => {logout(); navigate('/login')}} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white p-5 rounded shadow hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold text-gray-700">{project.name}</h2>
                            <p className="text-gray-600 mt-1">{project.description}</p>
                            <div className="mt-3 text-sm text-gray-500">Progress: {project.progress}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
