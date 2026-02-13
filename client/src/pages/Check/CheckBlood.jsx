import React, { useState } from "react";
import { toast } from "react-toastify";
import Header from './../../components/Header';
import { BASE_URL } from "../../Constrants/Constrant";

export default function CheckBlood() {
  const [unit, setUnit] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const callApi = () => {
    if (!unit) return;
    setLoading(true);
    setData(null);

    

    
    // Replace with your actual API endpoint
    fetch(`${BASE_URL}/check-blood?unit=${encodeURIComponent(unit)}`)
      .then((res) => res.json())
      .then((json) => {
        if(json.success){
          setData(json);
        }else{
          toast.error(json.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching API:", err);
        setLoading(false);
      });
  };

  return (
    <>
      
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <h1 className="text-xl font-bold text-gray-800 mb-4">أستعلام عن الوحدات الدموية</h1>

          {/* Input + Button */}
          <div className="flex space-x-2 mb-4 gap-2">
            <select
              type="text"
              value={unit}
              onChange={(e) => {setUnit(e.target.value)}}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">اختر نوع الزمرة المطلوبة</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <button
              onClick={callApi}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              استعلام
            </button>
          </div>

          {/* Loading / Result */}
          {loading && (
            <p className="text-gray-600 text-center">جاري الاستعلام...</p>
          )}

          {data && (
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">نجاح:</span>{" "}
                {data.success ? "تمت العملية بنجاح" : "فشلت العملية"}
              </p>
              <p>
                <span className="font-semibold">عدد الوحدات الدمويةالمتاحة:</span> {data.units}
              </p>
              <p>
                <span className="font-semibold">حجم الوحدات الدموية المتاحة:</span> {data.volume}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}