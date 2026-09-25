import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import CreateComplaint from './pages/CreateComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminComplaints from './pages/AdminComplaints';
import WorkerComplaints from './pages/WorkerComplaints';
import ComplaintDetail from './pages/ComplaintDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const getHomeRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'WORKER': return '/worker';
      default: return '/dashboard';
    }
  };
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={user ? <Navigate to={getHomeRoute()} /> : <Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute roles={['CITIZEN']}><CitizenDashboard /></PrivateRoute>} />
            <Route path="/complaint/new" element={<PrivateRoute roles={['CITIZEN']}><CreateComplaint /></PrivateRoute>} />
            <Route path="/complaints/my" element={<PrivateRoute roles={['CITIZEN']}><MyComplaints /></PrivateRoute>} />
            <Route path="/complaint/:id" element={<PrivateRoute><ComplaintDetail /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/complaints" element={<PrivateRoute roles={['ADMIN']}><AdminComplaints /></PrivateRoute>} />
            <Route path="/worker" element={<PrivateRoute roles={['WORKER']}><WorkerDashboard /></PrivateRoute>} />
            <Route path="/worker/complaints" element={<PrivateRoute roles={['WORKER']}><WorkerComplaints /></PrivateRoute>} />
            <Route path="*" element={<Navigate to={getHomeRoute()} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px', background: '#333', color: '#fff' } }} />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
