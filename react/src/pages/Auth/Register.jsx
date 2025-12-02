import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'; // আপনার axios ইনস্ট্যান্স

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Password confirmation does not match.');
            return;
        }

        try {
            // ১. CSRF কুকি ফেচ করা (Sanctum SPA Auth এর জন্য আবশ্যক)
            await api.get('/sanctum/csrf-cookie'); 

            // ২. রেজিস্ট্রেশন ডেটা পোস্ট করা
            const response = await api.post('/register', formData);
            
            // ✅ সফল হলে
            if (response.status === 201 || response.status === 200) {
                // রেজিস্ট্রেশনের পর Laravel স্বয়ংক্রিয়ভাবে লগইন করিয়ে দেয়
                navigate('/');
            }

        } catch (err) {
            console.error("Registration Error:", err);
            // 422 Validation Error হ্যান্ডেল করা (Laravel Validation Rules)
            if (err.response && err.response.data && err.response.data.errors) {
                // Laravel থেকে আসা প্রথম এররটি দেখানো
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError('Registration failed. Check server.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-success text-white">Register</div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleRegister}>
                                
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" name="name" onChange={handleChange} required/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" id="password_confirmation" name="password_confirmation" onChange={handleChange} required/>
                                </div>
                                
                                <button type="submit" className="btn btn-success">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;