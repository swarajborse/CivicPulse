import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', priority: 'MEDIUM', location: '', imageUrl: '', latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'ROAD', label: 'Road', icon: '🛣️' }, { value: 'WATER', label: 'Water Supply', icon: '💧' },
    { value: 'ELECTRICITY', label: 'Electricity', icon: '⚡' }, { value: 'GARBAGE', label: 'Garbage', icon: '🗑️' },
    { value: 'DRAINAGE', label: 'Drainage', icon: '🌊' }, { value: 'STREET_LIGHT', label: 'Street Light', icon: '💡' },
    { value: 'PUBLIC_SAFETY', label: 'Public Safety', icon: '🛡️' }, { value: 'OTHER', label: 'Other', icon: '📋' },
  ];

  const priorities = [
    { value: 'LOW', label: 'Low', desc: '7 days', color: 'bg-green-100 border-green-300 text-green-700' },
    { value: 'MEDIUM', label: 'Medium', desc: '5 days', color: 'bg-blue-100 border-blue-300 text-blue-700' },
    { value: 'HIGH', label: 'High', desc: '3 days', color: 'bg-orange-100 border-orange-300 text-orange-700' },
    { value: 'URGENT', label: 'Urgent', desc: '24 hours', color: 'bg-red-100 border-red-300 text-red-700' },
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({ ...formData, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        toast.success('Location captured!');
        setGettingLocation(false);
      },
      () => { toast.error('Could not get location'); setGettingLocation(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await complaintsAPI.create(formData);
      toast.success('Complaint registered successfully!');
      navigate(`/complaint/${res.data.id}`);
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to create complaint'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Register New Complaint</h1>
        <p className="text-gray-600 mb-6">Provide details about the civic issue you want to report</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Brief title for your complaint" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button key={cat.value} type="button" onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-3 rounded-xl border-2 text-center transition ${formData.category === cat.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-2xl">{cat.icon}</div>
                  <div className="text-xs font-medium mt-1">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button key={p.value} type="button" onClick={() => setFormData({ ...formData, priority: p.value })}
                  className={`p-3 rounded-xl border-2 text-center transition ${formData.priority === p.value ? `${p.color} border-current` : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="font-medium text-sm">{p.label}</div>
                  <div className="text-xs opacity-70">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Describe the issue in detail - what, where, when..." rows={4} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address *</label>
            <div className="flex gap-2">
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter location or address" required />
              <button type="button" onClick={getCurrentLocation} disabled={gettingLocation}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition disabled:opacity-50 whitespace-nowrap">
                {gettingLocation ? 'Getting...' : '📍 Use GPS'}
              </button>
            </div>
            {formData.latitude && <p className="text-xs text-green-600 mt-1">GPS: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg" />
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition">Cancel</button>
            <button type="submit" disabled={loading || !formData.category} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
