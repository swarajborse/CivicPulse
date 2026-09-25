import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await complaintsAPI.getWorkerComplaints();
      const data = res.data;
      setComplaints(data.slice(0, 8));
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'ASSIGNED').length,
        inProgress: data.filter(c => c.status === 'IN_PROGRESS').length,
        completed: data.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
        overdue: data.filter(c => c.overdue).length,
      });
    } catch (e) { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const statusColor = (s) => ({ PENDING: 'bg-yellow-100 text-yellow-800', ASSIGNED: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-indigo-100 text-indigo-800', RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-600' }[s] || '');

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.fullName}!</h1>
        <p className="text-gray-600">Worker Dashboard - Gram Panchayat Waregaon</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'border-blue-500', textColor: 'text-blue-600', icon: '📋' },
          { label: 'To Start', value: stats.pending, color: 'border-yellow-500', textColor: 'text-yellow-600', icon: '⏳' },
          { label: 'In Progress', value: stats.inProgress, color: 'border-indigo-500', textColor: 'text-indigo-600', icon: '🔧' },
          { label: 'Completed', value: stats.completed, color: 'border-green-500', textColor: 'text-green-600', icon: '✅' },
          { label: 'Overdue', value: stats.overdue, color: 'border-red-500', textColor: 'text-red-600', icon: '⚠️' },
        ].map((s) => (
          <div key={s.label} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${s.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">{s.label}</p>
                <p className={`text-3xl font-bold ${s.textColor}`}>{s.value}</p>
              </div>
              <span className="text-xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Assigned Complaints</h2>
          <Link to="/worker/complaints" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        {complaints.length === 0 ? (
          <div className="text-center py-8"><p className="text-gray-500">No complaints assigned yet</p></div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <Link key={c.id} to={`/complaint/${c.id}`} className="block border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-500">{c.complaintId}</span>
                      {c.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Overdue</span>}
                    </div>
                    <h4 className="font-medium text-gray-800">{c.title}</h4>
                    <p className="text-sm text-gray-500">{c.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor(c.status)}`}>{c.status?.replace('_', ' ')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
