import { shopApi, unwrap } from './client';

export function getPublicSettings() {
  return unwrap(shopApi.get('/settings'));
}

export function getPublicShipping() {
  return unwrap(shopApi.get('/shipping'));
}