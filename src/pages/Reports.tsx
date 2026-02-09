import { useEffect, useState } from 'react';

export default function Reports() {
  const [data, setData] = useState<any>(null);

  // Load the shared mock data
  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error loading data:", err));
  }, []);

  if (!data) return <div className="p-8">Loading Report Data...</div>;

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-4xl mx-auto border">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Site Status Report</h1>
          <p className="text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
        </div>
        {/* Print Button - Hides itself when printing */}
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold print:hidden hover:bg-blue-700 transition"
        >
          Print Report (Ctrl+P)
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-3 uppercase tracking-wide">Project Details</h2>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <p><span className="font-semibold">Project Name:</span> {data.projectDetails.name}</p>
            <p><span className="font-semibold">Weather Condition:</span> {data.projectDetails.weather}</p>
            <p><span className="font-semibold">Location:</span> {data.projectDetails.location.lat}, {data.projectDetails.location.lng}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-3 uppercase tracking-wide">Inventory Status</h2>
          <table className="w-full text-left border-collapse border rounded">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-3 border">Material</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.materials.map((m: any) => (
                <tr key={m.id} className="border-b">
                  <td className="p-3 border-r font-medium">{m.name}</td>
                  <td className="p-3 border-r">{m.quantity} {m.unit}</td>
                  <td className={`p-3 font-bold ${m.quantity < m.minLevel ? 'text-red-600' : 'text-green-600'}`}>
                    {m.quantity < m.minLevel ? '⚠ Low Stock' : '✔ Sufficient'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-400 text-sm">
          <p>End of Report | Internal Use Only</p>
        </div>
      </div>
    </div>
  );
}