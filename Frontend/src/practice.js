// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Userimg from "./assests/user-solid.svg";
// import ham from "./assests/burger-bar.jpg";
// import { FaTrash } from "react-icons/fa";
// import greencar from "./assests/GREENCAR.png"


// import { FaSignOutAlt } from "react-icons/fa";

// function CarDetails() {
//     const navigate = useNavigate();
//     const [vis, setVis] = useState(window.innerWidth >= 768);
//     const [slots, setSlots] = useState([]);
//     const [isFormVisible, setFormVisible] = useState(false);
//     const [vehicleNumber, setVehicleNumber] = useState("");
//     const [slotNumber, setSlotNumber] = useState("");
//     const [nodeName, setNodeName] = useState("");
//     const [name, setName] = useState("");
//     const [faceFile, setFaceFile] = useState(null);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
//     const [slotToDelete, setSlotToDelete] = useState(null);

//     useEffect(() => {
//         const fetchSlots = async () => {
//             try {
//                 const response = await axios.get("http://localhost:4000/slots");
//                 setSlots(response.data);
//             } catch (error) {
//                 console.error("Error fetching slots:", error);
//             }
//         };

//         fetchSlots();

//         const handleResize = () => {
//             setVis(window.innerWidth >= 768);
//         };

//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//         };
//     }, []);

//     const handleNewSlotClick = () => {
//         setFormVisible(true);
//         setErrorMessage(""); // Reset error message
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('slot', slotNumber);
//         formData.append('vehiclenumber', vehicleNumber);
//         formData.append('nodename', nodeName);
//         formData.append('name', name);
//         formData.append('face', faceFile);

//         try {
//             const response = await axios.post("http://localhost:4000/slots", formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             setSlots([...slots, response.data]);
//             setFormVisible(false);
//             setVehicleNumber("");
//             setSlotNumber("");
//             setNodeName("");
//             setName("");
//             setFaceFile(null);
//             setErrorMessage("");
//         } catch (error) {
//             if (error.response && error.response.data && error.response.data.message) {
//                 setErrorMessage(error.response.data.message);
//             } else {
//                 console.error("Error adding slot:", error);
//             }
//         }
//     };

//     const handleDeleteClick = (slot) => {
//         setSlotToDelete(slot);
//         setDeletePopupVisible(true);
//     };

//     const handleDeleteConfirm = async () => {
//         try {
//             await axios.delete(`http://localhost:4000/slots/${slotToDelete._id}`);
//             setSlots(slots.filter(slot => slot._id !== slotToDelete._id));
//             setDeletePopupVisible(false);
//             setSlotToDelete(null);
//         } catch (error) {
//             console.error("Error deleting slot:", error);
//         }
//     };

//     const handleDeleteCancel = () => {
//         setDeletePopupVisible(false);
//         setSlotToDelete(null);
//     };

//     const getSlotStatus = (status) => {
//         return status ? "Empty Slot" : "Device is not running";
//     };

//     const handleDeviceStatusClick = () => {
//         // Display all device IDs and their statuses
//         navigate('/device-status');
//     };

//     const handleLogout = () => {
//         if (window.confirm("Are you sure you want to logout?")) {
//             localStorage.removeItem("token");
//             navigate("/");
//         }
//     };

//     const imgVis = () => {
//         setVis(!vis);
//     };

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="bg-green-700 p-4 text-white flex justify-between items-center">
//                 <button onClick={imgVis}><img className="w-7 md:hidden" src={ham} alt="Menu" /></button>
//                 <h1 className="text-lg font-bold">COMPANY NAME</h1>
//                 <div className="flex-row flex gap-5 items-center">
//                     <button className="font-semibold hover:underline" onClick={() => navigate('/about')}>About</button>
//                     <h1 className="font-semibold">Admin</h1>
//                     <img src={Userimg} className="w-7" alt="User" />
//                     <FaSignOutAlt className="cursor-pointer" onClick={handleLogout} title="Logout" />
//                 </div>
//             </div>
//             <div className="flex flex-grow mt-4">
//                 {vis ? (
//                     <div className="flex flex-col max-w-[270px] space-y-4 w-1/4 p-4 bg-white shadow-lg">
//                         <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600" onClick={handleNewSlotClick}>New Slot</button>
//                         <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600">Visitor Details</button>
//                         <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600" onClick={handleDeviceStatusClick}>Device Status</button>
//                     </div>
//                 ) : null}
//                 <div className={`flex-grow p-8 ${vis ? "items-center " : "items-start justify-start"} flex flex-col`}>
//                     <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${vis ? "ml-0" : "ml-20"} mx-auto`}>
//                         {slots.map((slot, index) => (
//                             <div key={index} className="flex flex-col items-center justify-center gap-2  max-w-[260px] min-w-[210px]  bg-slate-100 border-slate-200 border-[2px] hover:shadow-md rounded-md ">
//                                                                 <span className=" bg-blue-400 w-full text-center font-bold text-[42px] px-4 "> {slot.slot}</span>
//                                                                 <span className="mt-[-10px] py-1 bg-blue-200 w-full  text-center font-semibold">{getSlotStatus(slot.deviceStatus)}</span>
// <img className="flex  items-center justify-center"  src={greencar} alt='' ></img>

//                                 <span className="mt-1 text-center">{slot.vehiclenumber}</span>
//                                 <span className="mt-1 text-left" > {slot.name} </span>
//                                 <span>
//                                             {slot.face && (
//                                                 <img
//                                                     src={slot.face}
//                                                     alt="Face ID"
//                                                     className="w-16 h-16 rounded-full ml-2"
//                                                 />
//                                             )}
//                             </span>
//                             <div className="flex justify-between items-center p-2 w-full">
//                                     <div className="text-sm">Current Time: {new Date().toLocaleString()}</div>
//                                     <button
//                                         className="text-red-500 hover:text-red-700"
//                                         onClick={() => handleDeleteClick(slot)}
//                                     >
//                                         <FaTrash />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             {isFormVisible && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//                     <div className="bg-white p-8 rounded shadow-lg">
//                         <h2 className="text-lg mb-4">Add New Slot</h2>
//                         <form onSubmit={handleFormSubmit}>
//                             <div className="mb-4">
//                                 <label className="block mb-2">Vehicle Number</label>
//                                 <input
//                                     type="text"
//                                     value={vehicleNumber}
//                                     onChange={(e) => setVehicleNumber(e.target.value)}
//                                     className="border p-2 w-full rounded"
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block mb-2">Slot Number</label>
//                                 <input
//                                     type="text"
//                                     value={slotNumber}
//                                     onChange={(e) => setSlotNumber(e.target.value)}
//                                     className="border p-2 w-full rounded"
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block mb-2">Node Name</label>
//                                 <input
//                                     type="text"
//                                     value={nodeName}
//                                     onChange={(e) => setNodeName(e.target.value)}
//                                     className="border p-2 w-full rounded"
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block mb-2">Name</label>
//                                 <input
//                                     type="text"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     className="border p-2 w-full"
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block mb-2">Face ID</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => setFaceFile(e.target.files[0])}
//                                     className="border p-2 w-full"
//                                     required
//                                 />
//                             </div>
//                             {errorMessage && (
//                                 <div className="mb-4 text-red-500">
//                                     {errorMessage}
//                                 </div>
//                             )}
//                             <div className="flex justify-end">
//                                 <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600">Add Slot</button>
//                                 <button type="button" className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600" onClick={() => setFormVisible(false)}>Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//             {isDeletePopupVisible && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//                     <div className="bg-white p-8 rounded shadow-lg">
//                     <h2 className="text-lg mb-4">Confirm Deletion</h2>
//                         <p className="mb-4">Are you sure you want to delete this slot?</p>
//                         <div className="flex justify-end">
//                             <button
//                                 className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-600"
//                                 onClick={handleDeleteConfirm}
//                             >
//                                 Yes, Delete
//                             </button>
//                             <button
//                                 className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
//                                 onClick={handleDeleteCancel}
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CarDetails;



























import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Userimg from "./assets/user-solid.svg";
import ham from "./assets/burger-bar.png";
import { FaTrash } from "react-icons/fa";
import greencar from "./assets/GREENCAR.png"
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
        setErrorMessage(""); // Reset error message
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const newSlot = { slot: slotNumber, vehiclenumber: vehicleNumber, nodeName, name,faceFile};
            const response = await axios.post("http://localhost:4000/slots", newSlot
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
    }
            );
            setSlots([...slots, response.data]);
            setFormVisible(false);
            setVehicleNumber("");
            setSlotNumber("");
            setNodeName("");
            setName("");
            setFaceFile(null);
            setErrorMessage(""); // Reset error message
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
            console.error("Error adding slot:", error);
        }
    };

    const handleDeleteClick = (slot) => {
        setSlotToDelete(slot);
        setDeletePopupVisible(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(http://localhost:4000/slots/${slotToDelete._id});
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
        return status ? "Empty Slot" : "Device is not running";
    };

    const handleDeviceStatusClick = () => {
        // Display all device IDs and their statuses
        navigate('/device-status');
    };

    const imgVis = () => {
        setVis(!vis);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-green-700 p-4 text-white flex justify-between items-center">
                <button onClick={imgVis}><img className="w-7 md:hidden" src={ham} alt="Menu" /></button>
                <h1 className="text-lg font-bold">COMPANY NAME</h1>
                <div className="flex-row flex gap-5 items-center">
                    <button className="font-semibold hover:underline" onClick={() => navigate('/about')}>About</button>
                    <h1 className="font-semibold">Admin</h1>
                    <img src={Userimg} className="w-7" alt="User" />
                </div>
            </div>
            <div className="flex flex-grow mt-4">
                {vis ? (
                    <div className="flex flex-col max-w-[270px] space-y-4 w-1/4 p-4 bg-white shadow-lg">
                        <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600" onClick={handleNewSlotClick}>New Slot</button>
                        <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600">Visitor Details</button>
                        <button className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600" onClick={handleDeviceStatusClick}>Device Status</button>
                    </div>
                ) : null}
                <div className={flex-grow p-8 ${vis ? "items-center " : "items-start justify-start"} flex flex-col}>
                    <div className={grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${vis ? "ml-0" : "ml-20"} mx-auto}>
                        {slots.map((slot, index) => (
                            <div key={index} className="flex flex-col gap-0  max-w-[260px] min-w-[210px]  bg-slate-100 border-slate-200 border-[2px] hover:shadow-md rounded-md ">
                                                                <span className=" bg-blue-400 w-full text-center font-bold text-[42px] px-4 "> {slot.slot}</span>
                                                                <img className="flex p-4  items-center justify-center"  src={greencar}></img>
                                                                <span className="mt-[-10px] py-1 bg-blue-200 w-full  text-center font-semibold">{getSlotStatus(slot.deviceStatus)}</span>
<div className="flex p-2">
{slot.face && (
                                                <img
                                                    src={slot.face}
                                                    alt="Face ID"
                                                    className="w-16 h-16 rounded-full ml-2"
                                                />
                                            )}
                                            <div className="flex-col flex mt-1 ml-2">
                                <span className="mt-[-5px] text-left  text-[27px]" > {slot.name} </span>
                                <span className="mt-[-5px]  text-[14px] uppercase font-semibold w-fit">{slot.vehiclenumber}</span>
                                </div>
                          </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isFormVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-lg mb-4">Add New Slot</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Vehicle Number</label>
                                <input
                                    type="text"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Slot Number</label>
                                <input
                                    type="text"
                                    value={slotNumber}
                                    onChange={(e) => setSlotNumber(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Node Name</label>
                                <input
                                    type="text"
                                    value={nodeName}
                                    onChange={(e) => setNodeName(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Face ID</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFaceFile(e.target.files[0])}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="mb-4 text-red-500">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600">Add Slot</button>
                                <button type="button" className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600" onClick={() => setFormVisible(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDeletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg">
                    <h2 className="text-lg mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this slot?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-600"
                                onClick={handleDeleteConfirm}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarDetails;