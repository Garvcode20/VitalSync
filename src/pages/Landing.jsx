import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiActivity, FiPieChart, FiTarget, FiArrowRight, FiCheckCircle, FiStar, FiHeart } from 'react-icons/fi';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Sticky Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-200">
                V
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">VitalSync</span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-green-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="hover:text-green-600 transition-colors">Reviews</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                Log in
              </Link>
              <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-400/20 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply"></div>
          <div className="absolute top-40 -right-40 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              
              {/* Hero Text */}
              <div className="lg:col-span-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium text-sm mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  VitalSync v2.0 is now live
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                  Your Wellness,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">Connected.</span>
                </h1>
                <p className="mt-4 text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Track your health metrics, visualize trends, and crush your wellness goals with the most beautiful dashboard ever created.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-green-200 transition-all hover:shadow-2xl hover:shadow-green-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    Get Started for Free <FiArrowRight />
                  </Link>
                  <Link to="/login" className="bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center">
                    View Demo
                  </Link>
                </div>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex justify-center items-center font-bold text-xs">J</div>
                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex justify-center items-center font-bold text-xs">M</div>
                    <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white flex justify-center items-center font-bold text-xs">K</div>
                  </div>
                  <span>Joined by 10,000+ health enthusiasts</span>
                </div>
              </div>
              
              {/* Hero Visual Mockup */}
              <div className="lg:col-span-6 mt-16 lg:mt-0 hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-teal-300 rounded-[2.5rem] transform rotate-3 scale-105 opacity-20 blur-xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-6 overflow-hidden">
                    {/* Fake Dashboard UI */}
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="h-6 w-32 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="h-4 w-16 bg-slate-200 rounded mb-3"></div>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold text-slate-800">8,432</div>
                          <div className="text-sm text-green-500 font-bold mb-1">+12%</div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="h-4 w-16 bg-slate-200 rounded mb-3"></div>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold text-slate-800">7.2h</div>
                          <div className="text-sm text-green-500 font-bold mb-1">+5%</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-100 h-40 flex items-end p-4 gap-2">
                       {/* Fake Chart Bars */}
                       {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                         <div key={i} className="bg-green-400 rounded-t-md w-full opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                       ))}
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -left-12 top-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-full text-red-500"><FiHeart /></div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Heart Rate</div>
                        <div className="font-bold text-slate-800">72 bpm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-3">Powerful Features</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Everything you need to thrive.</h3>
              <p className="text-xl text-slate-600">No more messy spreadsheets or disjointed apps. We brought all your wellness data under one roof.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <FiActivity />, color: "green", title: "Health Tracking", desc: "Log steps, heart rate, sleep, hydration and weight daily with our stunning interface." },
                { icon: <FiPieChart />, color: "blue", title: "Visual Insights", desc: "Interactive, pixel-perfect D3.js charts help you understand your patterns over time." },
                { icon: <FiTarget />, color: "purple", title: "Goal Setting", desc: "Set custom targets, track daily progress, and get celebrated for your wellness wins." }
              ].map((f, i) => (
                <div key={i} className="group bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-[28px] mb-6 text-${f.color}-500 group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section id="testimonials" className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="flex justify-center gap-2 text-yellow-400 mb-6 text-xl">
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold mb-8">"VitalSync completely changed how I look at my health. The dashboard is absolutely beautiful."</h3>
            <p className="text-slate-400 font-medium tracking-wide uppercase">— Sarah Jenkins, Marathon Runner</p>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Get started in 3 simple steps</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8">
              {[
                { step: "1", title: "Create Account", desc: "Sign up for free in less than 30 seconds." },
                { step: "2", title: "Log Data", desc: "Enter your daily health metrics easily." },
                { step: "3", title: "Improve", desc: "Watch your wellness trends grow." }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center max-w-xs relative">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg ${i === 2 ? 'bg-green-500 text-white shadow-green-200' : 'bg-white text-slate-900 border border-slate-100'}`}>
                    {s.step}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h4>
                  <p className="text-slate-500">{s.desc}</p>
                  
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full -ml-8 px-4 text-slate-300">
                      <FiArrowRight className="w-8 h-8 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Modern Footer */}
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
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer">𝕏</div>
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer">in</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-green-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-green-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} VitalSync Inc. All rights reserved.</p>
            <p className="text-slate-400 text-sm flex items-center gap-1">Designed with <FiHeart className="text-red-400" /> for your health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
