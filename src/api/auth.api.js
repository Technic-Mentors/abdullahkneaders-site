import { shopApi, unwrap } from './client';

export function updateProfile(payload) {
  return unwrap(shopApi.patch('/auth/me', payload));
}

export function forgotPassword(email) {
  return unwrap(shopApi.post('/auth/forgot-password', { email }));
}

export function resetPassword(token, password) {
  return unwrap(shopApi.post('/auth/reset-password', { token, password }));
}

export function verifyEmail(token) {
  return unwrap(shopApi.get(`/auth/verify-email/${token}`));
}

export function resendVerification() {
  return unwrap(shopApi.post('/auth/resend-verification'));
}
