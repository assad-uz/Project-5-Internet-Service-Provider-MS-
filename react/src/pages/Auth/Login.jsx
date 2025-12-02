import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'; // আপনার axios ইনস্ট্যান্স

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // এরর মেসেজ দেখানোর জন্য

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // পূর্বের এরর পরিষ্কার করা

        try {
            // ১. CSRF কুকি ফেচ করা (Sanctum SPA Auth এর জন্য আবশ্যক)
            await api.get('/sanctum/csrf-cookie'); 

            // ২. লগইন ডেটা পোস্ট করা
            const response = await api.post('/login', {
                email: email,
                password: password,
            });
            
            // ✅ সফল হলে
            if (response.status === 204 || response.status === 200) {
                // এরপর আমরা ইউজার ডেটা ফেচ করে কোনো Auth Context এ রাখতে পারি, 
                // কিন্তু আপাতত সরাসরি হোমে রিডাইরেক্ট করছি
                navigate('/');
            }

        } catch (err) {
            console.error("Login Error:", err);
            // 422 Validation Error অথবা 401 Unauthorized Error হ্যান্ডেল করা
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.status === 401) {
                 setError('Invalid credentials. Please try again.');
            } else {
                setError('Login failed. Check server connection.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">Login</div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;