import React from 'react';
import { User, Phone, MapPin, Globe } from 'lucide-react';

const Header = ({
  customerName = "",
  setCustomerName = () => {},
  customerMobile = "",
  setCustomerMobile = () => {},
  customerAddress = "",
  setCustomerAddress = () => {},
  serialNumber = 1
}) => {
  const today = new Date();

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  const day = toBanglaNumber(today.getDate().toString().padStart(2, "0"));
  const month = toBanglaNumber((today.getMonth() + 1).toString().padStart(2, "0"));
  const year = toBanglaNumber(today.getFullYear());
  const displaySerial = toBanglaNumber(serialNumber.toString().padStart(5, '0'));

  return (
    <div className="pb-2 bg-white">
      {/* Top Welcome Note - আরও ছোট করা হয়েছে */}
      <div className="flex justify-between items-center border-b border-blue-50 pb-1 mb-2 px-1">
        <span className="text-[7px] md:text-xs font-medium text-blue-400 uppercase italic">আপনার প্রয়োজন আমাদের অগ্রাধিকার</span>
        <span className="text-[10px] md:text-lg font-bold text-blue-700">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
        <span className="text-[7px] md:text-xs font-medium text-blue-400 uppercase italic">সেরা সেবার নিশ্চয়তা</span>
      </div>

      {/* Main Branding Section - উচ্চতা কমানো হয়েছে */}
      <div className="flex justify-between items-start gap-2 mb-3 px-1">
        <div className="flex-1">
          <h1 className="text-lg md:text-4xl font-black text-blue-600 leading-tight">
            ভিশন ফ্লো সার্ভিসেস <span className="text-blue-400">লিমিটেড</span>
          </h1>
          <p className="text-[8px] md:text-sm text-gray-400 font-medium flex items-center gap-1">
            <Globe size={10} /> বিশ্বস্ত সেবা ও আধুনিক প্রযুক্তি
          </p>
        </div>
        
        <div className="text-right space-y-0.5">
          <p className="text-[8px] md:text-sm font-bold text-gray-600 flex items-center justify-end gap-1">
            হেমায়েতপুর, চুয়াডাঙ্গা <MapPin size={10} className="text-blue-600" />
          </p>
          <p className="text-[8px] md:text-sm font-semibold text-blue-600">০১৭২৯-৬২৮৪০২</p>
        </div>
      </div>

      {/* Info Grid - অনেক বেশি কমপ্যাক্ট করা হয়েছে */}
      <div className="grid grid-cols-12 gap-2 bg-blue-50/40 p-2 rounded-lg border border-blue-100">
        
        {/* Customer Fields - ২ কলামে ভাগ করা হয়েছে মোবাইলের জন্য */}
        <div className="col-span-7 md:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <User size={14} className="text-blue-600 shrink-0"/>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ক্রেতার নাম"
              className="w-full bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none py-0.5 text-[11px] md:text-base font-semibold text-gray-800" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-600 shrink-0"/>
            <input 
              type="tel" 
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              placeholder="মোবাইল নম্বর"
              className="w-full bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none py-0.5 text-[11px] md:text-base font-semibold text-gray-800" 
            />
          </div>
        </div>

        {/* Serial & Date Box - সাইড বাই সাইড ফিক্সড */}
        <div className="col-span-5 md:col-span-4 flex flex-col justify-between items-end">
          <div className="text-right">
            <p className="text-[7px] uppercase text-gray-400 font-bold">Serial</p>
            <p className="text-xs md:text-xl font-black text-red-500 leading-none">#{displaySerial}</p>
          </div>
          
          <div className="flex shadow-sm rounded overflow-hidden border border-blue-200 mt-1">
            <span className="bg-white px-1 py-0.5 text-[9px] md:text-sm font-bold text-blue-700 border-r border-blue-100">{day}</span>
            <span className="bg-white px-1 py-0.5 text-[9px] md:text-sm font-bold text-blue-700 border-r border-blue-100">{month}</span>
            <span className="bg-blue-600 px-1.5 py-0.5 text-[9px] md:text-sm font-bold text-white">{year}</span>
          </div>
        </div>
      </div>

      {/* Ribbon Title - উচ্চতা কমানো হয়েছে */}
      <div className="relative mt-3">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-blue-100"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-blue-600 px-6 py-1 rounded-full text-white text-[10px] md:text-base font-bold shadow-md">
            নগদ রসিদ / CASH MEMO
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;