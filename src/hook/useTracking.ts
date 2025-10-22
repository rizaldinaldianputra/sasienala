// src/hook/useTracking.ts
import { useState } from 'react';
import { TrackingData, TrackingParams } from '../interface/tracking';
import { trackingService } from '../service/tracking_service';

export const useTracking = () => {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (params: TrackingParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await trackingService.getTracking(params);

      if (res.data && res.data.tracking && res.data.tracking.data) {
        setTracking(res.data.tracking.data); // langsung ambil data yang dipakai di component
      } else {
        setError('Tidak ditemukan AWB yang valid');
        setTracking(null);
      }

      return res.data;
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data tracking');
      setTracking(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    tracking,
    loading,
    error,
    fetchTracking,
  };
};

export default useTracking;
