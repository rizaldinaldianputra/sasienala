// hook/useLoyalty.ts
import { useEffect, useState } from 'react';
import {
  LoyaltyRedeemResponse,
  LoyaltyStatus,
  LoyaltyTier,
  LoyaltyTransaction,
} from '../interface/loyalty';
import { loyaltyService } from '../service/loyalty_service';
import { getUserId } from '../session/session';

export const useLoyalty = () => {
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User ID not found');
      const res = await loyaltyService.getStatus(userId);
      setStatus(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loyalty status');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User ID not found');
      const res = await loyaltyService.getTransactions(userId);
      setTransactions(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loyalty transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTiers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loyaltyService.getTiers();
      setTiers(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loyalty tiers');
    } finally {
      setLoading(false);
    }
  };

  const redeemPoints = async (points: number): Promise<LoyaltyRedeemResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User ID not found');
      const res = await loyaltyService.redeemPoints(userId, points);
      await fetchStatus(); // update status after redeem
      await fetchTransactions(); // update transactions after redeem
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to redeem points');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTransactions();
    fetchTiers();
  }, []);

  return {
    status,
    transactions,
    tiers,
    loading,
    error,
    refetchStatus: fetchStatus,
    refetchTransactions: fetchTransactions,
    refetchTiers: fetchTiers,
    redeemPoints,
  };
};
