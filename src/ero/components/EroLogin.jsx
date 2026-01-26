import { useState } from 'react';
import { eroLogin } from '../services/eroApis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import LoadingSmall from '../../components/SmallLoading';

export default function EroLogin() {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOrMobile || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);

      const data = await eroLogin(formData);
      console.log("Backend response:", data);

      toast.success('Login successful ');
      navigate('/ero/dashboard');
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white border rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">ERO Login</h2>
            <p className="text-sm text-gray-600 mt-2">Electoral Registration Officer Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Mobile
              </label>
              <input
                type="text"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email or mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-eci-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <LoadingSmall size="sm" /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}