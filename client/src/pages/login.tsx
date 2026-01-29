// pages/AdminLogin.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Shield,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const { login, loading, isAuthenticated, checkAuth } = useAuth();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check initial authentication status
  useEffect(() => {
    const checkInitialAuth = async () => {
      await checkAuth(); // Make sure auth state is checked
      setInitialCheckDone(true);
    };
    
    checkInitialAuth();
  }, [checkAuth]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    // Only redirect after initial check is done and user is authenticated
    if (initialCheckDone && isAuthenticated && !loading) {
      setLocation('/admin/dashboard');
    }
  }, [isAuthenticated, loading, initialCheckDone, setLocation]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        setLocation('/admin/dashboard');
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <a href="/" className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Sign In</h1>
              <p className="text-gray-600 mt-2">Enter your credentials to access the dashboard</p>
            </div>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="admin"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow'
                } text-white`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                <span>Protected by enterprise-grade security</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            For access issues, contact your system administrator
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Admin Panel. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-2 md:mt-0">
            <a href="/terms" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
