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
  const [rememberMe, setRememberMe] = useState(false);
  // Tambahkan di awal component
  const [showPassword, setShowPassword] = useState(false);

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
      if (err.response?.data.detail.is_verification) {
        navigate('/otp', { state: { email: email, status: 'login' } });
      } else {
        alert(err.response?.data?.detail.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 pt-10 rounded-b-3xl shadow-md relative mx-auto">
        <div className="absolute top-4 left-4">
          <button onClick={() => navigate(-1)} className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>

        <h1
          className="mb-2 mt-10 font-semibold text-left"
          style={{
            fontFamily: 'Tenor Sans',
            fontSize: '30px',
            lineHeight: '100%',
            color: '#000000',
          }}
        >
          Sign in
        </h1>
        <p
          className="mb-8 text-left"
          style={{
            fontFamily: 'Tenor Sans',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '140%',
            letterSpacing: '0px',
            color: '#B19F87',
          }}
        >
          Please enter your information to proceed
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-normal"
              style={{
                fontFamily: 'Tenor Sans, sans-serif',
                fontSize: '14px',
                lineHeight: '140%',
                color: 'rgba(177, 159, 135, 0.8)',
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
              style={{
                backgroundColor: 'rgba(224, 207, 186, 0.1)',
                color: 'rgba(177, 159, 135, 0.8)',
                fontFamily: 'Tenor Sans, sans-serif',
                fontSize: '14px',
                lineHeight: '140%',
                border: 'none',
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-normal"
              style={{
                fontFamily: 'Tenor Sans, sans-serif',
                fontSize: '14px',
                lineHeight: '140%',
                color: 'rgba(177, 159, 135, 0.8)',
              }}
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <img src="/lockey.png" alt="lock" className="h-5 w-5 object-contain" />
              </span>

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-12 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                style={{
                  backgroundColor: 'rgba(224, 207, 186, 0.1)',
                  color: 'rgba(177, 159, 135, 0.8)',
                  fontFamily: 'Tenor Sans, sans-serif',
                  fontSize: '14px',
                  lineHeight: '140%',
                  border: 'none',
                }}
              />

              <span
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Icon mata terbuka
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.965 9.965 0 012.269-3.78M6.37 6.37L17.63 17.63M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  // Icon mata tertutup
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="radio"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 border-gray-300"
                style={{ accentColor: COLORS.primary }}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block"
                style={{
                  fontFamily: 'Tenor Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0px',
                  color: '#595959',
                }}
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              style={{
                fontFamily: 'Tenor Sans, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: '100%',
                letterSpacing: '0px',
                color: '#595959',
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#B19F87' }}
            className="w-full py-3 rounded-md text-white font-semibold text-lg hover:opacity-90 transition-colors disabled:opacity-50 shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Text */}
        <p
          className="text-center mt-8"
          style={{
            fontFamily: 'Tenor Sans, sans-serif',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: '100%',
            letterSpacing: '0px',
            color: '#B19F87',
          }}
        >
          Don't have an account?{' '}
          <span
            className="cursor-pointer"
            style={{
              fontFamily: 'Tenor Sans, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: '#595959',
            }}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
