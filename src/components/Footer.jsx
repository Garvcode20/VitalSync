import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">V</div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">VitalSync</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6">Your personal health command center. Built with precision for those who take their wellness seriously.</p>
            <div className="flex gap-4 text-slate-400">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer">𝕏</div>
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer">in</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="/#features" className="hover:text-green-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-green-600 transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-green-600 transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="/about" className="hover:text-green-600 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} VitalSync Inc. Built by Garv.</p>
          <p className="text-slate-400 text-sm flex items-center gap-1">Designed with <FiHeart className="text-red-400" /> for your health.</p>
        </div>
      </div>
    </footer>
  );
}
