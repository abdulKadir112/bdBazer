import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import Header from './Header';
import { Trash2, Plus, Download, Save } from 'lucide-react';

// বাংলা সংখ্যা কনভার্ট
const convertToBangla = (num) => {
  if (num === null || num === undefined || num === '') return '';
  const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return num.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
};

const convertBanglaToEnglish = (str) => {
  const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return str.split('').map((char) => {
    const idx = banglaDigits.indexOf(char);
    return idx !== -1 ? idx : char;
  }).join('');
};

const CashMemo = ({ className }) => {
  const [items, setItems] = useState(Array.from({ length: 5 }, () => ({ item: '', quantity: '', rate: '', taka: '' })));
  const [tax, setTax] = useState('');
  const [availableItems, setAvailableItems] = useState([]);
  const [rowSuggestions, setRowSuggestions] = useState(Array.from({ length: 5 }, () => []));
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [currentBillNo, setCurrentBillNo] = useState(1);

  const olRef = useRef(null);
  const lastItemRef = useRef(null); // স্ক্রল করার জন্য রেফারেন্স

  useEffect(() => {
    fetch('/item.json')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setAvailableItems([...new Set(data)]); })
      .catch(() => setAvailableItems([]));

    const lastNo = localStorage.getItem('lastBillNo');
    if (lastNo) setCurrentBillNo(parseInt(lastNo) + 1);
  }, []);

  // রো যোগ করার ফাংশন ও স্ক্রল লজিক
  const addNewRow = () => {
    setItems((prev) => [...prev, { item: '', quantity: '', rate: '', taka: '' }]);
    setRowSuggestions((prev) => [...prev, []]);
    
    // নতুন রো তৈরি হওয়ার ঠিক পর স্ক্রল হবে
    setTimeout(() => {
      lastItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    const convertedValue = (field === 'quantity' || field === 'rate' || field === 'taka') ? convertBanglaToEnglish(value) : value;
    updatedItems[index][field] = convertedValue;

    if (field === 'item') {
      const searchTerm = convertedValue.trim();
      if (!searchTerm) {
        const newSug = [...rowSuggestions]; newSug[index] = []; setRowSuggestions(newSug);
      } else {
        const filtered = availableItems.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);
        const newSug = [...rowSuggestions]; newSug[index] = filtered; setRowSuggestions(newSug);
      }
    }

    const qty = parseFloat(convertBanglaToEnglish(updatedItems[index].quantity)) || 0;
    const rate = parseFloat(convertBanglaToEnglish(updatedItems[index].rate)) || 0;
    updatedItems[index].taka = qty > 0 && rate > 0 ? (qty * rate).toFixed(2) : '';
    setItems(updatedItems);
  };

  const calculateTotalPrice = () => items.reduce((total, row) => total + (parseFloat(row.taka) || 0), 0).toFixed(2);
  const calculateNetPrice = () => (parseFloat(calculateTotalPrice()) - (parseFloat(tax) || 0)).toFixed(2);

  const saveBillLogic = () => {
    const billData = {
      id: currentBillNo,
      savedAt: new Date().toLocaleString('bn-BD'),
      customer: { name: customerName || "সাধারণ কাস্টমার", mobile: customerMobile, address: customerAddress },
      items: items.filter(row => row.item.trim() !== ''),
      total: calculateTotalPrice(),
      net: calculateNetPrice()
    };
    const previous = JSON.parse(localStorage.getItem('savedCashMemos') || '[]');
    localStorage.setItem('savedCashMemos', JSON.stringify([...previous, billData]));
    localStorage.setItem('lastBillNo', currentBillNo.toString());
  };

  const downloadAsImage = async () => {
    if (!olRef.current) return;
    try {
      const dataUrl = await toPng(olRef.current, { backgroundColor: '#ffffff', pixelRatio: 3 });
      saveAs(dataUrl, `Bill-${currentBillNo}.png`);
      saveBillLogic();
      setCurrentBillNo(prev => prev + 1);
      alert('বিল সফলভাবে ডাউনলোড ও সেভ হয়েছে!');
    } catch (err) { alert('ডাউনলোডে সমস্যা হয়েছে'); }
  };

  return (
    <div className={`min-h-screen bg-slate-50 py-10 px-4 ${className}`}>
      <Container className="max-w-[800px] mx-auto">
        
        <div ref={olRef} className="bg-white shadow-2xl border border-gray-200 p-6 md:p-10 rounded-sm mb-32 relative overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <h1 className="text-9xl font-bold -rotate-45">CASH MEMO</h1>
          </div>

          <Header 
            customerName={customerName} setCustomerName={setCustomerName}
            customerMobile={customerMobile} setCustomerMobile={setCustomerMobile}
            customerAddress={customerAddress} setCustomerAddress={setCustomerAddress}
            serialNumber={currentBillNo}
          />

          <div className="mt-2 border-b-2 border-gray-800 flex bg-gray-100 font-bold py-2 px-1 text-sm md:text-base">
            <div className="w-[10%] text-center">নং</div>
            <div className="w-[40%] px-2">বিবরণ</div>
            <div className="w-[15%] text-center">পরিমাণ</div>
            <div className="w-[15%] text-center">দর</div>
            <div className="w-[20%] text-right pr-2">মোট টাকা</div>
          </div>

          <div className="flex flex-col min-h-[300px]">
            {items.map((row, index) => (
              <div 
                key={index} 
                // শেষ রো হলে রেফারেন্স সেট হবে
                ref={index === items.length - 1 ? lastItemRef : null}
                className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors group relative"
              >
                <div className="w-[10%] py-3 text-center border-r text-gray-400 font-medium">
                  {convertToBangla(index + 1)}
                </div>
                
                <div className="w-[40%] relative border-r">
                  <input
                    className={`w-full h-full px-3 outline-none bg-transparent transition-opacity ${!row.item ? 'opacity-30' : 'opacity-100'}`}
                    value={row.item}
                    onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                    placeholder="পণ্যের নাম"
                  />
                  {rowSuggestions[index]?.length > 0 && (
                    <ul className="absolute z-20 left-0 top-full w-full bg-white shadow-xl border rounded-b-md overflow-hidden">
                      {rowSuggestions[index].map((sug, i) => (
                        <li key={i} onClick={() => {
                          handleInputChange(index, 'item', sug);
                          const ns = [...rowSuggestions]; ns[index]=[]; setRowSuggestions(ns);
                        }} className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors border-b last:border-0 text-sm">
                          {sug}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="w-[15%] border-r">
                  <input
                    className={`w-full h-full text-center outline-none bg-transparent transition-opacity ${!row.quantity ? 'opacity-30' : 'opacity-100'}`}
                    value={convertToBangla(row.quantity)}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                    placeholder="০"
                  />
                </div>

                <div className="w-[15%] border-r">
                  <input
                    className={`w-full h-full text-center outline-none bg-transparent transition-opacity ${!row.rate ? 'opacity-30' : 'opacity-100'}`}
                    value={convertToBangla(row.rate)}
                    onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                    placeholder="০.০০"
                  />
                </div>

                <div className="w-[20%] relative group">
                  <div className="w-full h-full flex items-center justify-end pr-3 font-semibold text-gray-700">
                    {convertToBangla(row.taka)}
                  </div>
                  <button 
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-col md:flex-row justify-between items-start gap-6 border-t-1 border-gray-600 pt-6">
            <div className="flex flex-col gap-4 w-full md:w-1/2">
               <div className="hidden md:flex h-20 w-44 border border-dashed border-gray-400  items-end justify-center pb-2 rounded">
                  <span className="text-xs text-gray-300">ক্রেতার স্বাক্ষর</span>
               </div>
               <p className="text-xs text-gray-400 italic">* বিক্রিত মাল ফেরত নেওয়া হয় না।</p>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm font-bold text-gray-600">মোট টাকা:</span>
                <span className="font-bold text-lg">{convertToBangla(calculateTotalPrice())} ৳</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm font-bold text-gray-600">জমা/ডিসকাউন্ট:</span>
                <input 
                  className={`w-24 border-b border-gray-400 outline-none text-right font-bold text-red-500 transition-opacity ${!tax ? 'opacity-30' : 'opacity-100'}`}
                  value={convertToBangla(tax)}
                  onChange={(e) => setTax(convertBanglaToEnglish(e.target.value))}
                  placeholder="০.০০"
                />
              </div>
              <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-md shadow-lg">
                <span className="font-bold">নিট প্রদেয়:</span>
                <span className="text-xl font-black">{convertToBangla(calculateNetPrice())} ৳</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[700px] px-4 z-50">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex flex-wrap gap-3 justify-center">
            <button
              onClick={addNewRow} // নতুন ফাংশন ব্যবহার করছি
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all font-medium"
            >
              <Plus size={20} /> রো যোগ করুন
            </button>
            <button
              onClick={() => { saveBillLogic(); alert('সেভ হয়েছে!'); }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-500 transition-all font-medium"
            >
              <Save size={20} /> সেভ করুন
            </button>
            <button
              onClick={downloadAsImage}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-500 transition-all font-medium"
            >
              <Download size={20} /> ডাউনলোড করুন
            </button>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default CashMemo;