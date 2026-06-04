import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FiCheckCircle } from 'react-icons/fi';

export default function Pricing() {
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Simple, transparent pricing.</h1>
            <p className="text-xl text-slate-600">Invest in your health today with our affordable plans in INR.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
              <p className="text-slate-500 mb-6">For casual wellness tracking.</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">₹0</span><span className="text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Basic health logging</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> 7-day history</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> 1 active goal</li>
              </ul>
              <Link to="/register" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-full transition-colors">Get Started</Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl transform md:-translate-y-4 relative">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-slate-400 mb-6">For serious health enthusiasts.</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-green-400">₹499</span><span className="text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-400" /> Advanced data analytics</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-400" /> Unlimited history</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-400" /> Unlimited goals & alerts</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-400" /> Export to CSV</li>
              </ul>
              <Link to="/register" className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition-colors shadow-lg shadow-green-500/30">Upgrade to Pro</Link>
            </div>

            {/* Lifetime Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lifetime</h3>
              <p className="text-slate-500 mb-6">Pay once, use forever.</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">₹9,999</span><span className="text-slate-500"> one-time</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> All Pro features</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Priority support</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Early access to beta</li>
              </ul>
              <Link to="/register" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-full transition-colors">Get Lifetime</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
