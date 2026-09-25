import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try { const res = await notificationAPI.getAll(); setNotifications(res.data); }
    catch (e) { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try { await notificationAPI.markAsRead(id); loadNotifications(); } catch (e) {}
  };

  const markAllAsRead = async () => {
    try { await notificationAPI.markAllAsRead(); toast.success('All marked as read'); loadNotifications(); } catch (e) {}
  };

  const getTypeIcon = (type) => {
    const icons = { COMPLAINT_SUBMITTED: '📝', COMPLAINT_ASSIGNED: '👤', STATUS_CHANGED: '🔄', WORK_STARTED: '🔧', RESOLVED: '✅', ADMIN_REMARK: '💬' };
    return icons[type] || '🔔';
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-600">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-blue-600 hover:underline text-sm font-medium">Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-4xl mb-4">🔔</div>
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} onClick={() => !n.read && markAsRead(n.id)}
              className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition hover:shadow-md border-l-4 ${n.read ? 'border-gray-200' : 'border-blue-500 bg-blue-50/30'}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-1">{getTypeIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  {n.complaintId && (
                    <Link to={`/complaint/${n.complaintId}`} className="text-xs text-blue-600 hover:underline mt-2 inline-block">View Complaint &rarr;</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
