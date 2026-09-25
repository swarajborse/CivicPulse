import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    { icon: '📝', title: 'Easy Registration', desc: 'File complaints in seconds with our simple form' },
    { icon: '📍', title: 'Location Tracking', desc: 'Pin exact location using GPS for faster resolution' },
    { icon: '🔔', title: 'Real-time Updates', desc: 'Get notified at every step of the resolution process' },
    { icon: '📊', title: 'Track Progress', desc: 'Monitor complaint status with a visual timeline' },
    { icon: '⭐', title: 'Rate & Feedback', desc: 'Share your experience after complaint resolution' },
    { icon: '🏛️', title: 'Direct to Panchayat', desc: 'Complaints go directly to Gram Panchayat Waregaon' },
  ];

  const categories = [
    { name: 'Road', icon: '🛣️' }, { name: 'Water', icon: '💧' },
    { name: 'Electricity', icon: '⚡' }, { name: 'Garbage', icon: '🗑️' },
    { name: 'Drainage', icon: '🌊' }, { name: 'Street Light', icon: '💡' },
    { name: 'Public Safety', icon: '🛡️' }, { name: 'Other', icon: '📋' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur">Gram Panchayat Waregaon</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Smart Complaint<br />Management System</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Register civic complaints easily and track their resolution in real-time. Your voice matters for a better Waregaon.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold text-lg transition shadow-lg">Register Complaint</Link>
            <Link to="/login" className="border-2 border-white/50 hover:bg-white/10 px-8 py-3 rounded-xl font-semibold text-lg transition">Login to Track</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-3xl font-bold text-blue-600">24/7</div><div className="text-gray-600 mt-1">Available Online</div></div>
          <div><div className="text-3xl font-bold text-blue-600">8</div><div className="text-gray-600 mt-1">Categories</div></div>
          <div><div className="text-3xl font-bold text-blue-600">2-7</div><div className="text-gray-600 mt-1">Days Resolution</div></div>
          <div><div className="text-3xl font-bold text-blue-600">100%</div><div className="text-gray-600 mt-1">Transparent</div></div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Complaint Categories</h2>
          <p className="text-center text-gray-600 mb-10">We handle all types of civic complaints</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center cursor-pointer border hover:border-blue-200">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-gray-800">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">How It Works</h2>
          <p className="text-center text-gray-600 mb-10">Simple, transparent, and effective</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Complaint?</h2>
          <p className="text-blue-100 text-lg mb-8">Don't let civic issues go unreported. File your complaint now and help build a better Waregaon.</p>
          <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold text-lg transition inline-block">Get Started Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold text-white mb-2">Gram Panchayat Waregaon</p>
          <p className="text-sm">Smart Complaint Management System &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
