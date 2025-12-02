<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
// যেহেতু আমরা API ব্যবহার করছি, তাই Area, CustomerType, এবং Rule এর প্রয়োজন নেই
// কিন্তু আপনার ভবিষ্যতে লাগতে পারে, তাই সেগুলোকে আপাতত বাদ রাখছি না।
use App\Models\Area;
use App\Models\CustomerType;
use Illuminate\Validation\Rule;


class CustomerController extends Controller
{
    // ১. INDEX: সমস্ত কাস্টমার দেখানোর জন্য (List.jsx এর জন্য)
    public function index()
    {
        // React-এর জন্য শুধুমাত্র প্রয়োজনীয় ফিল্ডগুলো দিন
        $customers = Customer::orderBy('id', 'desc')->get();
        
        // ✅ API এর জন্য JSON রেসপন্স
        return response()->json($customers); 
    }

    // ২. STORE: নতুন ডেটা সেভ করার জন্য (Insert.jsx এর জন্য)
    public function store(Request $request)
    {
        // React ফর্ম থেকে প্রয়োজনীয় ডেটা validation
        // এখানে phone, area_id, customer_type_id, status ইত্যাদি বাদ দেওয়া হয়েছে
        // কারণ আপনার React ফর্মে শুধুমাত্র name, email, address আছে।
        // যদি আপনি ফুল ফর্ম তৈরি করেন, তাহলে এই Validation গুলো আবার যোগ করবেন।
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:100|unique:customers,email', // React এ email required
            'address' => 'required|string',
        ]);
        
        Customer::create($validated);

        // ✅ API এর জন্য 201 Created স্ট্যাটাস সহ JSON রেসপন্স
        return response()->json([
            'message' => 'Customer created successfully.', 
            'customer' => $validated
        ], 201);
    }

    // ৩. SHOW: নির্দিষ্ট কাস্টমার দেখানোর জন্য (Edit.jsx এ ডেটা লোড করতে)
    // Model Binding ব্যবহার করা হয়েছে
    public function show(Customer $customer)
    {
        // ✅ API এর জন্য JSON রেসপন্স
        return response()->json($customer);
    }

    // ৪. UPDATE: ডেটা আপডেট করার জন্য (Edit.jsx এর জন্য)
    public function update(Request $request, Customer $customer)
    {
        // validation: বর্তমান কাস্টমারকে বাদ দিয়ে uniqueness চেক
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:100|unique:customers,email,' . $customer->id,
            'address' => 'required|string',
        ]);

        $customer->update($validated);

        // ✅ API এর জন্য 200 OK স্ট্যাটাস সহ JSON রেসপন্স
        return response()->json([
            'message' => 'Customer updated successfully.', 
            'customer' => $customer
        ]);
    }

    // ৫. DESTROY: ডেটা ডিলিট করার জন্য (List.jsx এর জন্য)
    public function destroy(Customer $customer)
    {
        $customer->delete();
        
        // ✅ API এর জন্য 204 No Content স্ট্যাটাস সহ সফল রেসপন্স
        return response()->json(null, 204); 
    }

    // Create এবং Edit মেথডগুলো এখন API-তে দরকার নেই, তাই বাদ দেওয়া হলো।
    // (যদি আপনি সব ডেটা সহ ফুল ফর্ম তৈরি করেন, তবে index বা show মেথডের মাধ্যমে
    // area ও customerType ডেটা লোড করে নিতে পারেন)
}