import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => localStorage.getItem('token');

// Simple hash function for user ID (for cache keys only)
const hashUserId = (userId) => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Get current user ID from token (decode JWT) - hashed for security
const getCurrentUserId = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Hash the user ID for security - don't expose raw user ID in DevTools
    return hashUserId(payload.userId);
  } catch (error) {
    return null;
  }
};

// Configure axios with auth
const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: function (status) {
    // Accept any status code less than 500 (so 200, 201, 400, etc. won't throw errors)
    return status < 500;
  }
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== TRANSACTIONS ====================

// Fetch all transactions
export const useTransactions = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const response = await api.get('/transactions');
      
      // Check if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
      
      return response.data.data?.transactions || [];
    },
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
    enabled: !!getAuthToken() && !!userId, // Only run if user is authenticated and we have user ID
  });
};

// Fetch transaction stats
export const useTransactionStats = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: ['transaction-stats', userId],
    queryFn: async () => {
      const response = await api.get('/transactions/stats');
      
      // Check if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch stats');
      }
      
      return response.data.data || {};
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!getAuthToken() && !!userId,
  });
};

// Create transaction mutation
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: async (newTransaction) => {
      const response = await api.post('/transactions', newTransaction);
      
      // Check if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create transaction');
      }
      
      return response.data.data; // Return the actual transaction data
    },
    onSuccess: () => {
      // Invalidate and refetch transactions and stats for current user
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats', userId] });
    },
  });
};

// Delete transaction mutation
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: async (transactionId) => {
      const response = await api.delete(`/transactions/${transactionId}`);
      
      // Check if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete transaction');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions and stats for current user
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats', userId] });
    },
  });
};

// ==================== USER ====================

// Fetch current user
export const useCurrentUser = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: ['current-user', userId],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.user;
    },
    staleTime: 5 * 60 * 1000, // User data doesn't change often
    enabled: !!getAuthToken() && !!userId,
  });
};

// Aliases for convenience
export const useAddTransaction = useCreateTransaction;
