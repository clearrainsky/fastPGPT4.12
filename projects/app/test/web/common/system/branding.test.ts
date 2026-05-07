import { describe, expect, it } from 'vitest';
import { getApiBaseUrl, getMarketplaceUrl } from '@/web/common/system/branding';

describe('system branding helpers', () => {
  it('should use the configured api domain when provided', () => {
    expect(getApiBaseUrl({ customApiDomain: 'https://api.example.com' })).toBe(
      'https://api.example.com'
    );
  });

  it('should derive the api base url from the current origin without any FastGPT fallback', () => {
    expect(getApiBaseUrl({ origin: 'https://console.example.com' })).toBe(
      'https://console.example.com/api'
    );
  });

  it('should return an empty api base url when no configuration is available', () => {
    expect(getApiBaseUrl({})).toBe('');
  });

  it('should only use an explicitly configured marketplace url', () => {
    expect(getMarketplaceUrl(undefined)).toBe('');
    expect(getMarketplaceUrl('https://market.example.com')).toBe('https://market.example.com');
  });
});
