import { shopApi, unwrap } from './client';

export function getPublicSettings() {
  return unwrap(shopApi.get('/settings'));
}
