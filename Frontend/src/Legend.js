import React from 'react';
import greencar from "./assests/GREENCAR.jpg";
import redcar from "./assests/REDCAR.jpg";
import orangecar from "./assests/ORANGECAR.jpg";

function Legend() {
    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg border border-gray-200">
            
            <div className="flex items-center mb-2">
                <img src={greencar} alt="Green Car" className="w-6 h-6 mr-2"/>
                <span>Slot is empty</span>
            </div>
            <div className="flex items-center mb-2">
                <img src={redcar} alt="Red Car" className="w-6 h-6 mr-2"/>
                <span>Wrong car is parked</span>
            </div>
            <div className="flex items-center">
                <img src={orangecar} alt="Orange Car" className="w-6 h-6 mr-2"/>
                <span>Correct car is parked</span>
            </div>
        </div>
    );
}

export default Legend;
