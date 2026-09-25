import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import toast from 'react-hot-toast';

const WorkerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [statusModal, setStatusModal] = useState(null);
  const [statusData, setStatusData] = useState({ status: '', remarks: '' });

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try { const res = await complaintsAPI.getWorkerComplaints(); setComplaints(res.data); }
    catch (e) { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async () => {
    if (!statusData.status) { toast.error('Select status'); return; }
    try {
      await complaintsAPI.updateStatus(statusModal.id, statusData);
      toast.success('Status updated!');
      setStatusModal(null); setStatusData({ status: '', remarks: '' }); fetchComplaints();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const statusColor = (s) => ({ ASSIGNED: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-indigo-100 text-indigo-800', RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-600' }[s] || '');

  const filtered = complaints.filter(c => filter === 'ALL' || c.status === filter);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Complaints</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>{s === 'ALL' ? 'All' : s.replace('_', ' ')}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center"><p className="text-gray-500">No complaints found</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-sm p-5 border hover:border-blue-200 transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500">{c.complaintId}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(c.status)}`}>{c.status?.replace('_', ' ')}</span>
                    {c.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">OVERDUE</span>}
                  </div>
                  <Link to={`/complaint/${c.id}`} className="font-semibold text-gray-800 hover:text-blue-600">{c.title}</Link>
                  <p className="text-sm text-gray-500 mt-1">{c.location}</p>
                  {c.remarks && <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">Remarks: {c.remarks}</p>}
                </div>
                <div className="flex gap-2">
                  {c.status === 'ASSIGNED' && (
                    <button onClick={() => { setStatusModal(c); setStatusData({ status: 'IN_PROGRESS', remarks: '' }); }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">Start Work</button>
                  )}
                  {c.status === 'IN_PROGRESS' && (
                    <button onClick={() => { setStatusModal(c); setStatusData({ status: 'RESOLVED', remarks: '' }); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">Mark Resolved</button>
                  )}
                  <Link to={`/complaint/${c.id}`} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {statusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Update Status</h2>
            <p className="text-sm text-gray-600 mb-4">{statusModal.complaintId} - {statusModal.title}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={statusData.status} onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl">
                  <option value="">Select...</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={statusData.remarks} onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl" rows={3} placeholder="Add resolution remarks..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStatusModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-xl">Cancel</button>
                <button onClick={handleStatusUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerComplaints;
