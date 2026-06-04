import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FiLock, FiShield, FiDatabase } from 'react-icons/fi';

export default function Security() {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Security at VitalSync</h1>
            <p className="text-xl text-slate-600">Your health data is deeply personal. We treat it with the highest level of security.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
              <FiLock className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">End-to-End Encryption</h3>
              <p className="text-slate-600">All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3. Your passwords and authentication tokens are securely hashed.</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
              <FiDatabase className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Enterprise Infrastructure</h3>
              <p className="text-slate-600">We leverage Firebase and Google Cloud's secure infrastructure. Your data is stored in SOC 2 and ISO 27001 compliant data centers.</p>
            </div>
          </div>
          
          <div className="prose prose-lg text-slate-600 mx-auto">
            <h3>Our Security Promise</h3>
            <p>We will never sell your personal health data to third-party advertisers. You own your data, and you can delete your account and all associated metrics at any time with a single click in your dashboard.</p>
            <h3>Vulnerability Reporting</h3>
            <p>If you are a security researcher and have found a vulnerability in VitalSync, please reach out to our security team immediately. We take all reports seriously and will investigate them promptly.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
