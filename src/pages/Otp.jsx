// src/pages/OtpVerification.js
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hook/useAuth';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();

  // Ambil email dari state parameter saat navigate
  const email = location.state?.email || '';
  const status = location.state?.status || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // Redirect ke login jika email tidak tersedia
  useEffect(() => {
    if (!email) {
      alert('Email tidak ditemukan. Silakan login kembali.');
      navigate('/login');
    }
  }, [email, navigate]);

  // Countdown timer untuk resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyOtp(email, otp);
      console.log(result.message);
      if (
        result.message === 'Email berhasil diverifikasi' ||
        result.message === 'Email sudah diverifikasi'
      ) {
        navigate('/login'); // OTP berhasil, redirect ke home
        alert(result.message);
      } else {
        alert(result.message || 'OTP tidak valid');
      }
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat verifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setResendLoading(true);
    try {
      const x = await resendOtp(email);
      setTimer(60); // reset countdown
      alert(x.data.message);
    } catch (err) {
      alert(err.message || 'Gagal mengirim ulang OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">OTP Verification</h2>
        <p className="text-center text-gray-400 mb-6">
          Masukkan kode 6-digit yang dikirim ke <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              required
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 text-center tracking-widest text-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: COLORS.primary }}
            className="w-full py-2 rounded-full text-white hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="text-center mt-4">
          {timer > 0 ? (
            <p className="text-gray-400">Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-500 hover:underline"
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
