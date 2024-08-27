import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import CarDetails from './CarDetails';
import DeviceStatus from './DeviceStatus';
import About from './About';
import Login from './Login';
function App()
{
    return (
        <div>
          <BrowserRouter>
             <Routes>
                < Route path='/' element={<Login/>}/>
                <Route path='/details' element={<CarDetails/>} />
                <Route path='/about' element={<About/>} />
                <Route path="/device-status" element={<DeviceStatus />} />
            </Routes> 
            </BrowserRouter>                          
        </div>
    )
}
export default App;