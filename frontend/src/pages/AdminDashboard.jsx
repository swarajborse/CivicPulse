import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try { const res = await adminAPI.getDashboard(); setStats(res.data); }
    catch (e) { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!stats) return null;

  const statusCards = [
    { label: 'Total', value: stats.totalComplaints, color: 'border-blue-500', bg: 'text-blue-600', icon: '📊' },
    { label: 'Pending', value: stats.pendingComplaints, color: 'border-yellow-500', bg: 'text-yellow-600', icon: '⏳' },
    { label: 'Assigned', value: stats.assignedComplaints, color: 'border-blue-400', bg: 'text-blue-500', icon: '👤' },
    { label: 'In Progress', value: stats.inProgressComplaints, color: 'border-indigo-500', bg: 'text-indigo-600', icon: '🔧' },
    { label: 'Resolved', value: stats.resolvedComplaints, color: 'border-green-500', bg: 'text-green-600', icon: '✅' },
    { label: 'Overdue', value: stats.overdueComplaints, color: 'border-red-500', bg: 'text-red-600', icon: '⚠️' },
  ];

  const categoryData = stats.categoryStats ? {
    labels: Object.keys(stats.categoryStats).map(k => k.replace('_', ' ')),
    datasets: [{ data: Object.values(stats.categoryStats), backgroundColor: ['#3B82F6', '#06B6D4', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#EF4444', '#6B7280'] }]
  } : null;

  const priorityData = stats.priorityStats ? {
    labels: Object.keys(stats.priorityStats),
    datasets: [{ data: Object.values(stats.priorityStats), backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'] }]
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Gram Panchayat Waregaon - Administration Panel</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statusCards.map((s) => (
          <div key={s.label} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${s.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">{s.label}</p>
                <p className={`text-3xl font-bold ${s.bg}`}>{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Complaints by Category</h2>
          {categoryData ? <Bar data={categoryData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} /> : <p className="text-gray-500">No data</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">By Priority</h2>
          {priorityData ? <Doughnut data={priorityData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} /> : <p className="text-gray-500">No data</p>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Link to="/admin/complaints" className="flex-1 bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border hover:border-blue-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-xl text-2xl">📋</div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Complaints</h3>
              <p className="text-sm text-gray-600">View, assign, and update complaint status</p>
            </div>
          </div>
        </Link>
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-gray-600 text-sm">Action Required</span><span className="font-semibold text-yellow-600">{(stats.pendingComplaints || 0) + (stats.assignedComplaints || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 text-sm">Resolution Rate</span><span className="font-semibold text-green-600">{stats.totalComplaints > 0 ? Math.round(((stats.resolvedComplaints + (stats.closedComplaints || 0)) / stats.totalComplaints) * 100) : 0}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
