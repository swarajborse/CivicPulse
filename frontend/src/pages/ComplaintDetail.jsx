import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => { loadComplaint(); }, [id]);

  const loadComplaint = async () => {
    try {
      const [cRes, tRes] = await Promise.all([complaintsAPI.getById(id), complaintsAPI.getTimeline(id)]);
      setComplaint(cRes.data);
      setTimeline(tRes.data);
    } catch (e) { toast.error('Complaint not found'); navigate(-1); }
    finally { setLoading(false); }
  };

  const submitFeedbackHandler = async () => {
    setSubmittingFeedback(true);
    try {
      await complaintsAPI.submitFeedback(complaint.id, feedback);
      toast.success('Feedback submitted!');
      loadComplaint();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to submit feedback'); }
    finally { setSubmittingFeedback(false); }
  };

  const statusColor = (s) => ({ PENDING: 'bg-yellow-100 text-yellow-800', ASSIGNED: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-indigo-100 text-indigo-800', RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-600' }[s] || 'bg-gray-100');
  const priorityColor = (p) => ({ URGENT: 'bg-red-100 text-red-700', HIGH: 'bg-orange-100 text-orange-700', MEDIUM: 'bg-blue-100 text-blue-700', LOW: 'bg-green-100 text-green-700' }[p] || 'bg-gray-100');

  const getTimelineIcon = (action) => {
    const icons = { COMPLAINT_CREATED: '📝', COMPLAINT_ASSIGNED: '👤', WORK_STARTED: '🔧', STATUS_CHANGED: '🔄', COMPLAINT_RESOLVED: '✅', COMPLAINT_CLOSED: '🏁', ADMIN_REMARK: '💬' };
    return icons[action] || '📋';
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
  const getRemainingTime = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff < 0) return 'Overdue';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!complaint) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline text-sm">&larr; Back</button>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-gray-500">{complaint.complaintId}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor(complaint.status)}`}>{complaint.status.replace('_', ' ')}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(complaint.priority)}`}>{complaint.priority}</span>
              {complaint.overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">OVERDUE</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{complaint.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Details</h3>
            <div className="text-sm text-gray-600"><span className="font-medium">Category:</span> {complaint.category?.replace('_', ' ')}</div>
            <div className="text-sm text-gray-600"><span className="font-medium">Location:</span> {complaint.location}</div>
            <div className="text-sm text-gray-600"><span className="font-medium">Filed by:</span> {complaint.citizenName}</div>
            {complaint.assignedWorkerName && <div className="text-sm text-gray-600"><span className="font-medium">Assigned to:</span> {complaint.assignedWorkerName}</div>}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Timeline</h3>
            <div className="text-sm text-gray-600"><span className="font-medium">Filed:</span> {formatDate(complaint.createdAt)}</div>
            {complaint.deadline && <div className="text-sm"><span className="font-medium">Deadline:</span> {formatDate(complaint.deadline)} <span className={`ml-2 text-xs ${complaint.overdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>({getRemainingTime(complaint.deadline)})</span></div>}
            {complaint.resolvedAt && <div className="text-sm text-gray-600"><span className="font-medium">Resolved:</span> {formatDate(complaint.resolvedAt)}</div>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{complaint.description}</p>
        </div>

        {complaint.remarks && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Remarks</h3>
            <p className="text-gray-600 text-sm bg-blue-50 p-4 rounded-xl">{complaint.remarks}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Complaint Timeline</h2>
        {timeline.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No updates yet</p>
        ) : (
          <div className="space-y-0">
            {/* Initial submission */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">📝</div>
                <div className="w-0.5 flex-1 bg-gray-200"></div>
              </div>
              <div className="pb-6">
                <div className="font-medium text-gray-800">Complaint Submitted</div>
                <div className="text-sm text-gray-500">{formatDate(complaint.createdAt)}</div>
              </div>
            </div>
            {timeline.reverse().map((t, i) => (
              <div key={t.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">{getTimelineIcon(t.action)}</div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200"></div>}
                </div>
                <div className="pb-6">
                  <div className="font-medium text-gray-800">{t.newStatus?.replace('_', ' ') || t.action}</div>
                  {t.remarks && <div className="text-sm text-gray-600 mt-1">{t.remarks}</div>}
                  <div className="text-xs text-gray-500 mt-1">by {t.updatedBy?.fullName || 'System'} &middot; {formatDate(t.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback */}
      {complaint.status === 'RESOLVED' && complaint.feedbackStatus === 'PENDING' && user?.role === 'CITIZEN' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rate Your Experience</h2>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setFeedback({ ...feedback, rating: star })}
                className={`text-3xl transition ${feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
            ))}
          </div>
          <textarea value={feedback.comment} onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            placeholder="Share your experience (optional)" rows={3} />
          <button onClick={submitFeedbackHandler} disabled={submittingFeedback}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}
      {complaint.feedbackStatus === 'GIVEN' && (
        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-green-700 font-medium">Thank you for your feedback!</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
