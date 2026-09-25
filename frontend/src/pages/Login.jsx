import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Welcome back, ' + user.fullName + '!');
      switch (user.role) {
        case 'ADMIN': navigate('/admin'); break;
        case 'WORKER': navigate('/worker'); break;
        default: navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-1">Login to Gram Panchayat Waregaon</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Enter your email" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Enter your password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Register here</Link></p>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials</h3>
          <div className="space-y-2">
            {[
              { label: 'Admin', email: 'admin@waregaon.gov.in', pass: 'admin123', color: 'bg-purple-100 text-purple-700' },
              { label: 'Worker', email: 'ramesh@waregaon.gov.in', pass: 'worker123', color: 'bg-green-100 text-green-700' },
              { label: 'Citizen', email: 'priya@example.com', pass: 'citizen123', color: 'bg-blue-100 text-blue-700' },
            ].map((d) => (
              <button key={d.label} onClick={() => quickLogin(d.email, d.pass)} className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:opacity-80 transition ${d.color}`}>
                <span className="font-medium">{d.label}:</span> {d.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
