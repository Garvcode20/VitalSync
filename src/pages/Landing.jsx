import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiActivity, FiPieChart, FiTarget, FiArrowRight } from 'react-icons/fi';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 animate-fade-in-up">
              Your Wellness, <span className="text-green-600">Connected</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10 animate-fade-in-up delay-100">
              Track your health metrics, visualize trends, and reach your wellness goals — all in one beautifully simple place.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in-up delay-200">
              <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1">
                Get Started Free
              </Link>
              <Link to="/login" className="bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 font-bold py-3 px-8 rounded-full transition-colors">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                  <FiActivity className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Health Tracking</h3>
                <p className="text-gray-500">Log steps, heart rate, sleep, hydration and weight daily with our intuitive interface.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                  <FiPieChart className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Insights</h3>
                <p className="text-gray-500">Interactive D3.js charts to understand your health trends and patterns over time.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-purple-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                  <FiTarget className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Goal Setting</h3>
                <p className="text-gray-500">Set custom targets, track daily progress, and celebrate your wellness wins.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h4 className="font-bold text-gray-800">Create Account</h4>
                <p className="text-gray-500 text-sm mt-2">Sign up for free in seconds.</p>
              </div>
              <FiArrowRight className="hidden md:block text-gray-300 text-3xl" />
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h4 className="font-bold text-gray-800">Log Data</h4>
                <p className="text-gray-500 text-sm mt-2">Enter your daily health metrics.</p>
              </div>
              <FiArrowRight className="hidden md:block text-gray-300 text-3xl" />
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h4 className="font-bold text-gray-800">Improve</h4>
                <p className="text-gray-500 text-sm mt-2">Watch your wellness trends grow.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">VitalSync © {new Date().getFullYear()}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
