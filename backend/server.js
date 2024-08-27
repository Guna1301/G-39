const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const upload = require('./middleware/upload')
const axios = require('axios')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 

mongoose.connect(process.env.dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

    const slotschema = new mongoose.Schema({
        slot: {
            type: String,
            required: true,
            unique: true
        },
        vehiclenumber: {
            type: String,
            required: true,
            unique: true
        },
        nodename: {
            type: String,
            required: true,
            unique: true 
        },
        Status: {
            type: Boolean,
            default: null
        },
        devicestatus: {
            type: Boolean,
            default: true
        },
        name:{
            type: String,
            required : true
        },
        face: {
            data: Buffer,
            contentType: String
        },
        time:{
            type: Date,
            default: null
        }

    });

// const adminschema = new mongoose.Schema({

//     name: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         unique: true
//     }

// })
// const Admin = mongoose.model('admins',adminschema);
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "7d" });
    return token;
};

const Admin = mongoose.model('Admin', adminSchema);

const Slot = mongoose.model('slots', slotschema);


// app.post('/login', async (req, res) => {
//     const { name, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ name });
//         if (!admin || admin.password !== password) {
//             return res.status(401).send({ message: 'Invalid credentials' });
//         }
//         res.status(200).send({ message: 'Login successful' });
//     } catch (error) {
//         console.error("Error during login:", error);
//         res.status(500).send({ message: 'Server error' });
//     }
// });

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data);
};

app.post("/register", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await Admin.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new Admin({ ...req.body, password: hashPassword });
        await newUser.save();

        res.status(201).send(newUser);
    } catch (err) {
        console.error(err);  // Log the error details
        res.status(500).send({ message: "Internal error" });
    }
});

const validatelogin = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        password: Joi.string().required().label("Password") 
    });
    return schema.validate(data);
}

app.post('/login', async(req,res)=> {
    try{
        const {error} = validatelogin(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await Admin.findOne({username: req.body.username});
        if(!user){
            return res.status(401).send({message:"Invalid username"});
        }
        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );
        if(!validPassword){
            return res.status(401).send({message: "Invalid password"})
        }

        const token = user.generateAuthToken();
        res.status(200).send({data: token, user});
    }catch(err){
        res.status(500).send({message:"internal error"});
    }
})
app.post('/slots', upload.single('face'), async (req, res) => {
    try {
        const { slot, vehiclenumber, nodename, name } = req.body;

        // const url=`http://192.168.254.122/broadcast?plain={"nodename":"${String(nodename)}", "vehiclenumber":"${String(vehiclenumber)}"}`      
        //     const espResponse = await axios.post(url, {
        //         headers: { 'Content-Type': 'application/json' }
        //     });
            
        //     console.log("Sending data:");
        //     if (espResponse.status == 200) {
        //         console.log('Data sent to ESP32 successfully');
    
        //     } else {
        //         console.error('Failed to send data to ESP32');
        //         // console.log(espResponse);
        //     }

        // Check for duplicate slot number
        const existingSlot = await Slot.findOne({ slot });
        if (existingSlot) {
            return res.status(400).send({ message: 'Slot number already taken' });
        }

        // Check for duplicate vehicle number
        const existingVehicle = await Slot.findOne({ vehiclenumber });
        if (existingVehicle) {
            return res.status(400).send({ message: 'Vehicle number already present' });
        }

        // Check for duplicate device ID
        const existingDevice = await Slot.findOne({ nodename });
        if (existingDevice) {
            return res.status(400).send({ message: 'Node Name already present' });
        }

        const existingname = await Slot.findOne({ name });
        if (existingname) {
            return res.status(400).send({ message: 'user name already present' });
        }
        const newSlot = new Slot({
            slot, vehiclenumber, nodename, name,
            face: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } });
        await newSlot.save();
        res.status(201).send(newSlot);
    } catch (error) {
        console.error("Error saving slot:", error);
        res.status(400).send(error);
    }
});

// app.get('/slots', async (req, res) => {
//     try {
//         const slots = await Slot.find();
//         res.status(200).send(slots);
//     } catch (error) {
//         console.error("Error fetching slots:", error);
//         res.status(400).send(error);
//     }
// });
// Your backend route to get slots
app.get('/slots', async (req, res) => {
    try {
        const slots = await Slot.find({});
        const slotsWithBase64Images = slots.map(slot => ({
            ...slot.toObject(),
            face: slot.face.data ? `data:${slot.face.contentType};base64,${slot.face.data.toString('base64')}` : null,
        }));
        res.json(slotsWithBase64Images);
    } catch (error) {
        res.status(500).json({ message: "Error fetching slots" });
    }
});




app.put('/slots', async (req,res) => {
    try{
        const {nodename, status } = req.body;
        
        const slot = await Slot.findOne({nodename: nodename});
        if (!slot) {
            return res.status(404).send({ message: "Slot not found" });
        }
        slot.set({
            Status : status
        })

        if(status == true){
            slot.set({
                time : Date.now()
            })
        } 

        if(status == null){
            slot.set({
                time : null
            })
        }

        await slot.save();
        res.status(200).send(slot);
    } catch(err){
        console.error("Error fetching slots", err);
        res.status(400).send(err);
    }
})



app.delete('/slots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Slot.findByIdAndDelete(id);
        res.status(200).send({ message: 'Slot deleted successfully' });
    } catch (error) {
        console.error("Error deleting slot:", error);
        res.status(400).send(error);
    }
});

app.get('/device-status', async (req, res) => {
    try {
        const slots = await Slot.find({}, { nodename: 1, slot: 1, deviceStatus: 1 });
        res.status(200).send(slots);
    } catch (error) {
        console.error("Error fetching device statuses:", error);
        res.status(400).send(error);
    }
});

// app.get('/getIp', async (req, res) => {
//     try {
//         const device = await Device.findOne({ vehicle: null });

//         if (device) {
//             res.json({ ipAddress: device.nodename });
//         } else {
//             res.status(404).json({ message: "No available IP address found" });
//         }
//     } catch (err) {
//         console.log('Error:', err);
//         res.status(500).json('Internal error');
//     }
// });


// app.post('/ipaddress', async (req, res) => {
//     try{
//         const {ipAddress, slot} = req.body;
//         const newdevice = new Device({nodename:ipAddress,slot:slot, status: true})
//         await newdevice.save();
//         res.json(newdevice);

//     } catch(err){
//         res.status(404).json({message: "coundn't add ip address"});
//     }
// });


const port = 4000;
app.listen(port, () => {
    console.log("Server is listening on port", port);
});