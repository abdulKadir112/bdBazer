import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // সার্ভারে বিল সেভ করার ফাংশন
  const saveBill = async (billData) => {
    setLoading(true);
    try {
      const response = await api.post('/bills', billData);
      alert('বিল ডাটাবেজে সেভ হয়েছে!');
      return response.data;
    } catch (error) {
      console.error("Save Error:", error);
      alert('সেভ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // নির্দিষ্ট ইউজারের সব বিল নিয়ে আসার ফাংশন
  const fetchMyBills = async (userId) => {
    try {
      const response = await api.get(`/bills/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <BillContext.Provider value={{ saveBill, fetchMyBills, loading }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => useContext(BillContext);