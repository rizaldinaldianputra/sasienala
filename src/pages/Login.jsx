// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hook/useAuth';
import { setToken } from '../session/session';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      setToken(result.access_token, 7);

      if (result.access_token) {
        navigate('/');
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Sign in</h2>
        <p className="text-center text-gray-400 mb-6">Please enter your information to proceed</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: COLORS.primary }}
            className="w-full py-2 rounded-full text-white hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
