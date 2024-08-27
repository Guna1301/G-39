    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import Userimg from "./assests/user-solid.svg";
    import ham from "./assests/burger-bar.jpg";
    import { FaTrash, FaSignOutAlt } from "react-icons/fa";
    import greencar from "./assests/GREENCAR.jpg";
    import redcar from "./assests/REDCAR.jpg";
    import orangecar from "./assests/ORANGECAR.jpg";
    import Legend from "./Legend";

    function CarDetails() {
        const navigate = useNavigate();
        const [vis, setVis] = useState(window.innerWidth >= 768);
        const [slots, setSlots] = useState([]);
        const [isFormVisible, setFormVisible] = useState(false);
        const [vehicleNumber, setVehicleNumber] = useState("");
        const [slotNumber, setSlotNumber] = useState("");
        const [nodeName, setNodeName] = useState("");
        const [name, setName] = useState("");
        const [faceFile, setFaceFile] = useState(null);
        const [errorMessage, setErrorMessage] = useState("");
        const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
        const [slotToDelete, setSlotToDelete] = useState(null);
        const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false); 

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

            const handleResize = () => {
                setVis(window.innerWidth >= 768);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }, []);


        

        const handleNewSlotClick = () => {
            setFormVisible(true);
            setErrorMessage("");
        };

        const handleFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('slot', slotNumber);
            formData.append('vehiclenumber', vehicleNumber);
            formData.append('nodename', nodeName);
            formData.append('name', name);
            formData.append('face', faceFile);

            try {
                const response = await axios.post("http://localhost:4000/slots", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSlots([...slots, response.data]);
                setFormVisible(false);
                setVehicleNumber("");
                setSlotNumber("");
                setNodeName("");
                setName("");
                setFaceFile(null);
                setErrorMessage("");
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    console.error("Error adding slot:", error);
                }
            }
        };

        const handleDeleteClick = (slot) => {
            setSlotToDelete(slot);
            setDeletePopupVisible(true);
        };

        const handleDeleteConfirm = async () => {
            try {
                await axios.delete(`http://localhost:4000/slots/${slotToDelete._id}`);
                setSlots(slots.filter(slot => slot._id !== slotToDelete._id));
                setDeletePopupVisible(false);
                setSlotToDelete(null);
            } catch (error) {
                console.error("Error deleting slot:", error);
            }
        };

        const handleDeleteCancel = () => {
            setDeletePopupVisible(false);
            setSlotToDelete(null);
        };

        const getSlotStatus = (status) => {
            return status ? "Device is Running" : "Device is not running";
        };

        const handleDeviceStatusClick = () => {
            navigate('/device-status');
        };

        const handleLogoutClick = () => {
            setLogoutPopupVisible(true);
        };

        const handleLogout = () => {
            localStorage.removeItem("token");
            navigate("/");
        };

        const handleLogoutCancel = () => {
            setLogoutPopupVisible(false);
        };

        const imgVis = () => {
            setVis(!vis);
        };


        function getElapsedTime(startTime) {
            const currentTime = new Date();
        
            if (startTime === null) {
                return `Parked at ${currentTime.toLocaleString()}`;
            }
        
            const start = new Date(startTime);
            const diff = currentTime - start; 
        
            const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);
        
            if (diffDays > 0) {
                return `Parked ${diffDays} days ago`;
            } else if (diffHours > 0) {
                return `Parked ${diffHours} hours ago`;
            } else if (diffMinutes > 0) {
                return `Parked ${diffMinutes} minutes ago`;
            } else {
                return `Parked ${diffSeconds} seconds ago`;
            }
        }
        
        

        return (
            <div className="flex flex-col min-h-screen max-w-full">
                <div className="bg-green-700 p-4 text-white flex justify-between items-center">
                    <button onClick={imgVis}><img className="w-7 md:hidden" src={ham} alt="Menu" /></button>
                    <h1 className="text-lg font-bold">VEHICLE DETECTION</h1>
                    <div className="flex-row flex gap-5 items-center">
                        <button className="font-semibold hover:underline" onClick={() => navigate('/about')}>About</button>
                        <h1 className="font-semibold">Admin</h1>
                        <img src={Userimg} className="w-7" alt="User" />    
                        <FaSignOutAlt className="cursor-pointer" onClick={handleLogoutClick} title="Logout" />
                    </div>
                </div>
                <div className="flex flex-grow mt-4">
                    {vis ? (
                        <div className="flex flex-col w-1/4 p-4 bg-white shadow-lg max-w-[270px] space-y-4">
                            <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600" onClick={handleNewSlotClick}>New Slot</button>
                            {/* <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600">Visitor Details</button> */}
                            <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600" onClick={handleDeviceStatusClick}>Device Status</button>
                        </div>
                    ) : null}
                   <div className={`flex-grow p-8 flex flex-col items-center ${vis ? "" : "ml-20"}`}>
                   <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto ${vis ? "ml-0" : "ml-20"}`}>
                        {slots.map((slot, index) => {
                        let carImage;
                        if (slot.Status === null) {
                            carImage = greencar;
                        } else if (slot.Status === true) {
                            carImage = orangecar;
                        } else if (slot.Status === false) {
                            carImage = redcar;
                        }

        return (
            <div key={index} className="flex flex-col items-center justify-center gap-2  max-w-[260px] min-w-[210px]  bg-slate-100 border-slate-200 bo hover:shadow-md rounded-md ">
                <span className=" bg-blue-400 w-full text-center font-bold text-[42px] px-4 "> {slot.slot}</span>
                <span className="mt-[-10px] py-1 bg-blue-200 w-full  text-center font-semibold">      {   getSlotStatus(slot.devicestatus)}</span>
                <img className="w-25 h-25 p-5 mb-10" src={carImage} alt='Car' />
                
                <div className="flex mt-[-45px] p-2">
                    {slot.face && (
                        <img
                            src={slot.face}
                            alt="Face ID"
                            className="w-16 h-16 rounded-full ml-[-40px]"
                        />
                    )}
                    <div className="flex-col mt-[0px] flex mt-1 ml-2">
                        <span className="mt-[-5px] text-left uppercase font-semibold  text-[27px]"> {slot.vehiclenumber} </span>
                        <span className="mt-[-5px]  text-[14px] font-light w-fit">{slot.name}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center p-2 w-full">
                    <div className="mt-[-20px]">
                    
                        <span className="font-light text-sm">   {carImage===orangecar ?  getElapsedTime(slot.time) : "-" }   </span>
                    </div>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(slot)}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        );
    })}

                        </div>
                    </div>
                </div>
                {isFormVisible && (
                   <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                   <div className="bg-white p-8 rounded shadow-md w-full max-w-lg mx-auto">               
                            <h2 className="text-xl font-bold mb-4">Add New Slot</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Vehicle Number:</label>
                                    <input
                                        type="text"
                                        value={vehicleNumber}
                                        onChange={(e) => setVehicleNumber(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Slot Number:</label>
                                    <input
                                        type="text"
                                        value={slotNumber}
                                        onChange={(e) => setSlotNumber(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Node Name:</label>
                                    <input
                                        type="text"
                                        value={nodeName}
                                        onChange={(e) => setNodeName(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Face ID:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFaceFile(e.target.files[0])}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                {errorMessage && (
                                    <div className="mb-4 text-red-500">{errorMessage}</div>
                                )}
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                                        onClick={() => setFormVisible(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                                    >
                                        Add Slot
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {isDeletePopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-8 rounded shadow-md w-[40%] max-w-lg mx-auto">
                            <h2 className="text-xl font-bold mb-4">Delete Slot</h2>
                            <p>Are you sure you want to delete this slot?</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                                    onClick={handleDeleteCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isLogoutPopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-8 rounded shadow-md w-[40%] max-w-lg mx-auto">
                            <h2 className="text-xl font-bold mb-4">Logout</h2>
                            <p>Are you sure you want to logout?</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                                    onClick={handleLogoutCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <Legend />
            </div>
        );
    }

    export default CarDetails;