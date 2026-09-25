import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await complaintsAPI.getMyComplaints();
      const data = res.data;
      setComplaints(data.slice(0, 5));
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'PENDING').length,
        inProgress: data.filter(c => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length,
        resolved: data.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
        overdue: data.filter(c => c.overdue).length,
      });
    } catch (e) { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const statusColor = (s) => ({ PENDING: 'bg-yellow-100 text-yellow-800', ASSIGNED: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-indigo-100 text-indigo-800', RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-600' }[s] || 'bg-gray-100');
  const priorityColor = (p) => ({ URGENT: 'bg-red-100 text-red-700', HIGH: 'bg-orange-100 text-orange-700', MEDIUM: 'bg-blue-100 text-blue-700', LOW: 'bg-green-100 text-green-700' }[p] || 'bg-gray-100');

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.fullName}!</h1>
        <p className="text-gray-600">Gram Panchayat Waregaon - Complaint Portal</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'border-blue-500', textColor: 'text-blue-600' },
          { label: 'Pending', value: stats.pending, color: 'border-yellow-500', textColor: 'text-yellow-600' },
          { label: 'In Progress', value: stats.inProgress, color: 'border-indigo-500', textColor: 'text-indigo-600' },
          { label: 'Resolved', value: stats.resolved, color: 'border-green-500', textColor: 'text-green-600' },
          { label: 'Overdue', value: stats.overdue, color: 'border-red-500', textColor: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${s.color}`}>
            <p className="text-xs text-gray-500 uppercase font-medium">{s.label}</p>
            <p className={`text-3xl font-bold ${s.textColor}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Complaints</h2>
            <Link to="/complaints/my" className="text-blue-600 hover:underline text-sm">View All</Link>
          </div>
          {complaints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No complaints yet</p>
              <Link to="/complaint/new" className="text-blue-600 hover:underline">File your first complaint</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <Link key={c.id} to={`/complaint/${c.id}`} className="block border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">{c.complaintId}</span>
                        {c.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Overdue</span>}
                      </div>
                      <h4 className="font-medium text-gray-800 mt-1">{c.title}</h4>
                      <p className="text-sm text-gray-500">{c.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor(c.status)}`}>{c.status.replace('_', ' ')}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(c.priority)}`}>{c.priority}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/complaint/new" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center font-medium transition">
                + Register New Complaint
              </Link>
              <Link to="/complaints/my" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl text-center font-medium transition">
                View All Complaints
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">How It Works</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3"><span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span><p>Register a complaint with details and location</p></div>
              <div className="flex items-start gap-3"><span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span><p>Admin reviews and assigns to a worker</p></div>
              <div className="flex items-start gap-3"><span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span><p>Track progress on your dashboard</p></div>
              <div className="flex items-start gap-3"><span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span><p>Rate and provide feedback after resolution</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
