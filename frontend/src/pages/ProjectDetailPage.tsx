import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../services/projectService'; // tämä pitää tehdä myös
import { Navbar } from '../components/Navbar';

interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    is_completed: boolean;
    created_at: string;
}

interface Project {
    id: number;
    name: string;
    description?: string;
    progress: number;
    created_at: string;
    tasks: Task[];
}

export function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    console.log("Project ID from URL:", projectId);
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const data = await getProjectById(Number(projectId));
            setProject(data);
        } catch (error) {
            console.error("Failed to fetch project:", error);
        }
    };

    if (!project) return <div className="p-6">Loading...</div>;

    return (
    <div className='min-h-screen bg-gray-100'>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <div className="mb-4">Progress: {project.progress}%</div>

            <h2 className="text-2xl font-semibold mb-2">Tasks</h2>
            {project.tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet.</p>
            ) : (
                <ul className="space-y-3">
                    {project.tasks.map(task => (
                        <li key={task.id} className="bg-white p-4 shadow rounded">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-600">{task.description}</div>
                            <div className="text-sm text-gray-500">Status: {task.status}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
    );
}