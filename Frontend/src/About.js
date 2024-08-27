import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center h-screen p-4">
            <div className="max-w-md text-center mb-4">
                <h2 className="text-lg font-semibold mb-2">About Us</h2>
                <p>
                    Create a comprehensive visitor management system for residential complexes, office buildings, or any secured facility. The system will utilize face recognition for visitor authentication and number plate detection for vehicle tracking.
                </p>
                <button 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/details')}
                >
                    Return to Home
                </button>
            </div>
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>Guna Sai</div>
                    <div>Bhanu Prakash</div>
                    <div>Ansh Kumar Yadav</div>
                    <div>Deepthi</div>
                    <div>Gokul Kashyap</div>
                    <div>Gayathri</div>
                </div>
            </div>
        </div>
    );
}

export default About;