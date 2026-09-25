import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, complaintsAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [assignModal, setAssignModal] = useState(null);
  const [assignData, setAssignData] = useState({ workerId: '', notes: '' });
  const [statusModal, setStatusModal] = useState(null);
  const [statusData, setStatusData] = useState({ status: '', remarks: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [cRes, wRes] = await Promise.all([adminAPI.getAllComplaints(search), adminAPI.getWorkers()]);
      setComplaints(cRes.data.content || cRes.data);
      setWorkers(wRes.data);
    } catch (e) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllComplaints(search);
      setComplaints(res.data.content || res.data);
    } catch (e) { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleAssign = async () => {
    if (!assignData.workerId) { toast.error('Select a worker'); return; }
    try {
      await complaintsAPI.assignWorker(assignModal.id, assignData);
      toast.success('Worker assigned!');
      setAssignModal(null); setAssignData({ workerId: '', notes: '' }); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleStatusUpdate = async () => {
    if (!statusData.status) { toast.error('Select status'); return; }
    try {
      await complaintsAPI.updateStatus(statusModal.id, statusData);
      toast.success('Status updated!');
      setStatusModal(null); setStatusData({ status: '', remarks: '' }); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const statusColor = (s) => ({ PENDING: 'bg-yellow-100 text-yellow-800', ASSIGNED: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-indigo-100 text-indigo-800', RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-600' }[s] || '');
  const priorityColor = (p) => ({ URGENT: 'bg-red-100 text-red-700', HIGH: 'bg-orange-100 text-orange-700', MEDIUM: 'bg-blue-100 text-blue-700', LOW: 'bg-green-100 text-green-700' }[p] || '');

  const filtered = complaints.filter(c => {
    const matchFilter = filter === 'ALL' || c.status === filter;
    return matchFilter;
  });

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Complaints</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-1">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by ID, title, or citizen..." className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition">Search</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>{s === 'ALL' ? 'All' : s.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citizen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono text-gray-600">{c.complaintId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800"><Link to={`/complaint/${c.id}`} className="hover:text-blue-600">{c.title}</Link></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.citizenName}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.category?.replace('_', ' ')}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${priorityColor(c.priority)}`}>{c.priority}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColor(c.status)}`}>{c.status?.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.assignedWorkerName || '-'}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    {c.status === 'PENDING' && <button onClick={() => setAssignModal(c)} className="text-blue-600 hover:underline">Assign</button>}
                    <button onClick={() => setStatusModal(c)} className="text-green-600 hover:underline">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Assign Worker</h2>
            <p className="text-sm text-gray-600 mb-4">{assignModal.complaintId} - {assignModal.title}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Worker</label>
                <select value={assignData.workerId} onChange={(e) => setAssignData({ ...assignData, workerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl">
                  <option value="">Choose worker...</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>{w.fullName} ({w.activeComplaintCount || 0} active)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={assignData.notes} onChange={(e) => setAssignData({ ...assignData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl" rows={2} placeholder="Optional notes..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAssignModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-xl">Cancel</button>
                <button onClick={handleAssign} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Update Status</h2>
            <p className="text-sm text-gray-600 mb-4">{statusModal.complaintId} - {statusModal.title}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select value={statusData.status} onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl">
                  <option value="">Select status...</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={statusData.remarks} onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl" rows={3} placeholder="Add remarks..." />
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

export default AdminComplaints;
