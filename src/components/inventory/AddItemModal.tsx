import { X } from 'lucide-react';
import { useState } from 'react';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
}

export default function AddItemModal({ isOpen, onClose, onSave }: AddItemModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        quantity: '',
        unit: '',
        threshold: '',
        status: 'in-stock',
        po: '',
        lastReceipt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: `CAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            quantity: Number(formData.quantity),
            threshold: Number(formData.threshold)
        });
        onClose();
        setFormData({
            name: '',
            code: '',
            quantity: '',
            unit: '',
            threshold: '',
            status: 'in-stock',
            po: '',
            lastReceipt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 className="font-bold text-lg">Add New Material</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Material Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="e.g. Portland Cement"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="CAT-..."
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            >
                                <option value="">Select Unit</option>
                                <option value="Bags">Bags</option>
                                <option value="Tons">Tons</option>
                                <option value="Units">Units</option>
                                <option value="kg">kg</option>
                                <option value="m³">m³</option>
                                <option value="m">m</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Min Threshold</label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="0"
                                value={formData.threshold}
                                onChange={e => setFormData({ ...formData, threshold: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Initial Status</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="in-stock">In Stock</option>
                            <option value="low">Low Stock</option>
                        </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                        >
                            Add Material
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
