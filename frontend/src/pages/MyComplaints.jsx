import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import toast from 'react-hot-toast';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try { const res = await complaintsAPI.getMyComplaints(); setComplaints(res.data); }
    catch (e) { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  };

  const statusColor = (s) => ({ PENDING: 'bg-yellow-100 text-yellow-800', ASSIGNED: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-indigo-100 text-indigo-800', RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-600' }[s] || 'bg-gray-100');
  const priorityColor = (p) => ({ URGENT: 'bg-red-100 text-red-700', HIGH: 'bg-orange-100 text-orange-700', MEDIUM: 'bg-blue-100 text-blue-700', LOW: 'bg-green-100 text-green-700' }[p] || 'bg-gray-100');
  const categoryLabel = (c) => ({ ROAD: '🛣️ Road', WATER: '💧 Water', ELECTRICITY: '⚡ Electricity', GARBAGE: '🗑️ Garbage', DRAINAGE: '🌊 Drainage', STREET_LIGHT: '💡 Street Light', PUBLIC_SAFETY: '🛡️ Safety', OTHER: '📋 Other' }[c] || c);

  const filtered = complaints.filter(c => {
    const matchFilter = filter === 'ALL' || c.status === filter;
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.complaintId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Complaints</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title or ID..."
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none flex-1" />
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <Link key={c.id} to={`/complaint/${c.id}`} className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition border hover:border-blue-200">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500">{c.complaintId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status.replace('_', ' ')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(c.priority)}`}>{c.priority}</span>
                    {c.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">OVERDUE</span>}
                  </div>
                  <h3 className="font-semibold text-gray-800">{c.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{categoryLabel(c.category)} &middot; {c.location}</p>
                  {c.assignedWorkerName && <p className="text-sm text-blue-600 mt-1">Assigned to: {c.assignedWorkerName}</p>}
                </div>
                <div className="text-right text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
