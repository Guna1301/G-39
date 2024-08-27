import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginVideo from "./assests/login_video.mp4";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:4000/login";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            navigate("/details");
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className="login-page">
            <video className="video-background" autoPlay loop muted>
                <source src={loginVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="wrapper">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label className="block text-sm font-medium text-white">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label className="block text-sm font-medium text-white">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                        />
                    </div>
                    {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
                    <button type="submit" className="w-full bg-white text-gray-800 p-2 rounded hover:bg-gray-100 transition">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
