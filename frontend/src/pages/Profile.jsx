import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, complaintsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', village: '', address: '', avatarUrl: '' });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setFormData({ fullName: user.fullName || '', phone: user.phone || '', village: user.village || '', address: user.address || '', avatarUrl: user.avatarUrl || '' });
      const res = await complaintsAPI.getMyComplaints();
      setComplaints(res.data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileAPI.update(formData);
      updateUser(formData);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (e) { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover" /> : user.fullName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
            <p className="text-gray-600">{user.email}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 inline-block">{user.role}</span>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            {[{ name: 'fullName', label: 'Full Name' }, { name: 'phone', label: 'Phone' }, { name: 'village', label: 'Village' }, { name: 'address', label: 'Address' }, { name: 'avatarUrl', label: 'Avatar URL' }].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type="text" value={formData[f.name]} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => { setEditing(false); loadData(); }} className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-xl font-medium transition">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-xl"><span className="text-sm text-gray-500">Phone</span><p className="font-medium">{user.phone || '-'}</p></div>
              <div className="bg-gray-50 p-4 rounded-xl"><span className="text-sm text-gray-500">Village</span><p className="font-medium">{user.village || '-'}</p></div>
              <div className="bg-gray-50 p-4 rounded-xl"><span className="text-sm text-gray-500">Address</span><p className="font-medium">{user.address || '-'}</p></div>
            </div>
            <button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition">Edit Profile</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: 'Total Complaints', value: stats.total, color: 'text-blue-600' }, { label: 'Resolved', value: stats.resolved, color: 'text-green-600' }, { label: 'Pending', value: stats.pending, color: 'text-yellow-600' }].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {!loading && complaints.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Complaint History</h2>
          <div className="space-y-2">
            {complaints.slice(0, 10).map((c) => (
              <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <span className="font-mono text-xs text-gray-500">{c.complaintId}</span>
                  <p className="text-sm font-medium">{c.title}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'RESOLVED' || c.status === 'CLOSED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
