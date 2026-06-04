import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-200">V</div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">VitalSync</span>
          </Link>
          <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-full">Sign Up</Link>
        </div>
      </nav>

      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">About VitalSync</h1>
          <div className="prose prose-lg text-slate-600">
            <p className="mb-6">
              Welcome to VitalSync, your personal health command center. Our mission is to make health tracking accessible, beautiful, and actionable for everyone.
            </p>
            <p className="mb-6">
              VitalSync was founded and built by <strong>Garv</strong>, an enthusiastic developer with a passion for bridging the gap between technology and personal wellness. Frustrated by the disjointed and cluttered health apps available on the market, Garv set out to build a unified platform that doesn't just store data, but presents it in a way that actually motivates you.
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Vision</h2>
            <p className="mb-6">
              We believe that understanding your body shouldn't require a medical degree. By utilizing clean UI, interactive data visualizations, and smart goal tracking, we want to empower thousands of users across India and the globe to take control of their well-being.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-green-800 mb-4">Join the journey</h3>
              <p className="text-green-700 mb-6">Start tracking your health today and see the difference a clean dashboard makes.</p>
              <Link to="/register" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-green-200">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
