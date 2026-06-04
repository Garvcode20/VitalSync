import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Terms() {
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
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-10 md:p-16 rounded-3xl shadow-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500 mb-8">Last updated: June 4, 2026</p>
          
          <div className="prose prose-slate">
            <h3>1. Agreement to Terms</h3>
            <p>By viewing or using this website, which can be accessed at vitalsync.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
            
            <h3>2. Medical Disclaimer</h3>
            <p><strong>VitalSync is not a medical device or a substitute for professional medical advice.</strong> The data and insights provided by VitalSync are for informational purposes only. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>

            <h3>3. User Accounts</h3>
            <p>If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.</p>

            <h3>4. Site Terms of Use Modifications</h3>
            <p>VitalSync may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>

            <h3>5. Governing Law</h3>
            <p>Any claim related to VitalSync's Website shall be governed by the laws of India without regards to its conflict of law provisions.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
