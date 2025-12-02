import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'; 

const Insert = () => {
    const navigate = useNavigate();
    const [customerField, setCustomerField] = useState({
        name: '',
        email: '',
        address: '',
    });

    // ফর্ম ফিল্ড পরিবর্তন হ্যান্ডেল করা
    const changeUserFieldHandler = (e) => {
        setCustomerField({
            ...customerField,
            [e.target.name]: e.target.value,
        });
    };

    // ফর্মে সাবমিট হলে নতুন ডেটা তৈরি করা
    const onSubmitChange = async (e) => {
        e.preventDefault();
        try {
            // API কল: POST রিকোয়েস্ট দিয়ে নতুন কাস্টমার ডেটা তৈরি করা
            await api.post(`/api/customers`, customerField);
            alert("Customer added successfully!");
            navigate('/'); // ডেটা যুক্ত হওয়ার পর লিস্ট পেজে ফিরে যাওয়া
        } catch (err) {
            console.error("Error creating new customer:", err);
            alert('Failed to add new customer.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add New Customer</h2>
            <form onSubmit={onSubmitChange}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="form-control" 
                        onChange={changeUserFieldHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="form-control" 
                        onChange={changeUserFieldHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        className="form-control" 
                        onChange={changeUserFieldHandler}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success me-2">Add Customer</button>
                <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Back To List</button>
            </form>
        </div>
    );
};

export default Insert;