import React from "react";
import { useNavigate } from "react-router-dom";

export function FrontPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-100">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-lg p-6 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                            AI Assisted Workflow
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-6">
                            Streamline your work with intelligent automation, collaboration, and productivity tools powered by AI.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                            <button
                                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold text-lg hover:bg-indigo-50 transition"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <img
                            src="https://cdn.jsdelivr.net/gh/flowforge/branding@main/flowforge-ai.svg"
                            alt="AI Workflow Illustration"
                            className="max-w-full h-auto rounded-xl shadow-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
