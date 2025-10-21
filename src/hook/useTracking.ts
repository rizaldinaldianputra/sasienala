// src/hook/useTracking.ts
import { useState } from 'react';
import { TrackingParams, TrackingResponse } from '../interface/tracking';
import { trackingService } from '../service/tracking_service';

export const useTracking = () => {
  const [tracking, setTracking] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (params: TrackingParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await trackingService.getTracking(params);
      setTracking(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data tracking');
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
