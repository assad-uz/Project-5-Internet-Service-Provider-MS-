import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axios'; // আপনার axios ইনস্ট্যান্স

const Edit = () => {
    // URL থেকে ID নেওয়া
    const { id } = useParams();
    const navigate = useNavigate();

    const [customerField, setCustomerField] = useState({
        name: '',
        email: '',
        address: '',
    });
    const [loading, setLoading] = useState(true);

    // ডেটা ফেচ করার ফাংশন (useEffect এর ভেতরে ডিফাইন করা হয়েছে)
    useEffect(() => {
        // ✅ Cannot access variable before it is declared ত্রুটি এড়াতে ফাংশনটি ভেতরে ডিফাইন করা হলো
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                // API কল: http://127.0.0.1:8000/api/customers/6
                const result = await api.get(`/api/customers/${id}`); 
                // ডেটা লোড হওয়ার পর স্টেট আপডেট করা
                setCustomerField(result.data); 
            } catch (err) {
                console.error("Error fetching single customer:", err); 
                alert("Could not load customer data."); //
                navigate('/'); // ব্যর্থ হলে লিস্ট পেজে ফিরে যাওয়া
            } finally {
                setLoading(false);
            }
        };
        
        fetchCustomer(); 
    }, [id, navigate]); // ID বা navigate পরিবর্তন হলে রি-ফেচ হবে

    // ফর্ম ফিল্ড পরিবর্তন হ্যান্ডেল করা
    const changeUserFieldHandler = (e) => {
        setCustomerField({
            ...customerField,
            [e.target.name]: e.target.value,
        });
    };

    // ফর্মে সাবমিট হলে ডেটা আপডেট করা
    const onSubmitChange = async (e) => {
        e.preventDefault();
        try {
            // API কল: PUT রিকোয়েস্ট দিয়ে ডেটা আপডেট করা
            await api.put(`/api/customers/${id}`, customerField);
            alert("Customer data updated successfully!");
            navigate('/'); // আপডেটের পর লিস্ট পেজে ফিরে যাওয়া
        } catch (err) {
            console.error("Error updating customer:", err);
            alert('Failed to update customer data.');
        }
    };
    
    if (loading) {
        return <div className="container mt-5">Loading Customer Data...</div>;
    }


    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Customer (ID: {id})</h2>
            <form onSubmit={onSubmitChange}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">ID:</label>
                    <input type="text" id="id" className="form-control" value={id} disabled />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="form-control" 
                        value={customerField.name} 
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
                        value={customerField.email} 
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
                        value={customerField.address} 
                        onChange={changeUserFieldHandler}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary me-2">Update Customer</button>
                <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Back To List</button>
            </form>
        </div>
    );
};

export default Edit;