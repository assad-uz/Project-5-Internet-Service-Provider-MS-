import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../axios'; // ✅ আপনার axios ইনস্ট্যান্স ইমপোর্ট করা হয়েছে

const List = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ডেটা ফেচ করার ফাংশন (useCallback ব্যবহার করা হলো Eslint সমস্যার জন্য)
    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            // ✅ API কল: http://127.0.0.1:8000/api/customers
            const res = await api.get('/api/customers'); 
            setCustomers(res.data);
        } catch (err) {
            console.error("Error fetching customers:", err);
            // Auth ব্যর্থ হলে 401 আসতে পারে
            if (err.response && err.response.status === 401) {
                alert('Authentication required. Please log in.');
            } else {
                alert('Failed to load customer data.');
            }
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ২. ডেটা ডিলিট করার ফাংশন
    const deleteCustomer = async (id) => {
        if (!window.confirm(`Are you sure you want to delete customer ID: ${id}?`)) {
            return;
        }

        try {
            await api.delete(`/api/customers/${id}`); 
            alert(`Customer ID ${id} deleted successfully!`);
            fetchCustomers(); // ডেটা ডিলিট হওয়ার পর লিস্ট আপডেট করা
        } catch (err) {
            console.error("Error deleting customer:", err);
            alert('Failed to delete customer.');
        }
    };

    // ৩. কম্পোনেন্ট লোড হওয়ার পর ডেটা ফেচ করা
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]); // useCallback ব্যবহারের কারণে fetchCustomers ডিপেন্ডেন্সি হিসেবে যুক্ত

    if (loading) {
        return <div className="container mt-5">Loading Customers...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Customer Details</h2>
            <NavLink to="/insert" className="btn btn-success mb-3">Add New Customer</NavLink>

            {customers.length === 0 ? (
                <p>No customers found. Please add a new customer.</p>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{index + 1}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                                <td>
                                    <button 
                                        onClick={() => deleteCustomer(customer.id)}
                                        className="btn btn-danger btn-sm me-2"
                                    >
                                        Delete
                                    </button>
                                    <NavLink 
                                        to={`/edit/${customer.id}`} 
                                        className="btn btn-info btn-sm"
                                    >
                                        Edit
                                    </NavLink>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default List;