// src/pages/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hook/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const result = await register(email, password, username);

      if (result.id > 0) {
        alert('Registration Success');
        navigate('/login');
      } else {
        alert(result);
        // alert(result?.detail || 'Registration failed');
      }
    } catch (err) {
      // ambil pesan error dari backend
      const message = err || 'Registration failed';
      alert(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <p className="text-center text-gray-400 mb-6">Create a new account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
            />
          </div>
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
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
