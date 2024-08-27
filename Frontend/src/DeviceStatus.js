import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DeviceStatus() {
    const [slots, setSlots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get("http://localhost:4000/slots");
                setSlots(response.data);
            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        };

        fetchSlots();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Device Status</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Slot Number</th>
                        <th className="border border-gray-300 p-2">Vehicle Number</th>
                        <th className="border border-gray-300 p-2">Node Name</th>
                        <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot._id}>
                            <td className="border border-gray-300 p-2">{slot.slot}</td>
                            <td className="border border-gray-300 p-2">{slot.vehiclenumber}</td>
                            <td className="border border-gray-300 p-2">{slot.nodename}</td>
                            <td className="border border-gray-300 p-2">{slot.devicestatus ? "Device is Running" : "Device is not running"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate('/details')}
            >
                Return to Home
            </button>
        </div>
    );
}

export default DeviceStatus;
