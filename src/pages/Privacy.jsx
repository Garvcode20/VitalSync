import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Privacy() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 mb-8">Last updated: June 4, 2026</p>
          
          <div className="prose prose-slate">
            <h3>1. Introduction</h3>
            <p>Welcome to VitalSync. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
            
            <h3>2. The Data We Collect About You</h3>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address.</li>
              <li><strong>Health Data</strong> includes the metrics you choose to log, such as steps, heart rate, hydration, and sleep duration.</li>
            </ul>

            <h3>3. How We Use Your Personal Data</h3>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing the dashboard services).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            </ul>

            <h3>4. Data Security</h3>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.</p>

            <h3>5. Your Legal Rights</h3>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, or erasure of your personal data.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
