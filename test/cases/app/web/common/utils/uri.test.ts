import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  safeDecodeURIComponent,
  safeEncodeURIComponent,
  validateRedirectUrl
} from '@/web/common/utils/uri';

describe('uri utils', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('safeDecodeURIComponent', () => {
    it('should decode encoded paths', () => {
      expect(safeDecodeURIComponent('%2Fdashboard%2Fagent')).toBe('/dashboard/agent');
    });

    it('should fallback on invalid encoded strings', () => {
      expect(safeDecodeURIComponent('%E0%A4%A', '/login')).toBe('/login');
    });
  });

  describe('safeEncodeURIComponent', () => {
    it('should encode path and query characters', () => {
      expect(safeEncodeURIComponent('/chat?appId=123&name=test user')).toBe(
        '%2Fchat%3FappId%3D123%26name%3Dtest%20user'
      );
    });
  });

  describe('validateRedirectUrl', () => {
    it('should keep safe internal routes', () => {
      expect(validateRedirectUrl('/dashboard/agent')).toBe('/dashboard/agent');
      expect(validateRedirectUrl('/chat/share?appId=123')).toBe('/chat/share?appId=123');
    });

    it('should decode and keep encoded internal routes', () => {
      expect(validateRedirectUrl('%2Fdataset%2Flist%3Fname%3Ddemo')).toBe('/dataset/list?name=demo');
    });

    it('should fallback for empty values', () => {
      expect(validateRedirectUrl('')).toBe('/dashboard/agent');
    });

    it('should fallback for absolute external urls', () => {
      expect(validateRedirectUrl('https://evil.example/phishing')).toBe('/dashboard/agent');
      expect(validateRedirectUrl('javascript:alert(1)')).toBe('/dashboard/agent');
    });

    it('should fallback for protocol-relative and slash confusion urls', () => {
      expect(validateRedirectUrl('//evil.example')).toBe('/dashboard/agent');
      expect(validateRedirectUrl('%2F%2Fevil.example')).toBe('/dashboard/agent');
      expect(validateRedirectUrl('/\\evil.example')).toBe('/dashboard/agent');
      expect(validateRedirectUrl('/%5Cevil.example')).toBe('/dashboard/agent');
    });

    it('should fallback for login-related routes', () => {
      expect(validateRedirectUrl('/login')).toBe('/dashboard/agent');
      expect(validateRedirectUrl('/login/provider?code=123')).toBe('/dashboard/agent');
    });

    it('should fallback for malformed encoded urls', () => {
      expect(validateRedirectUrl('%E0%A4%A')).toBe('/dashboard/agent');
    });

    it('should respect custom fallback values', () => {
      expect(validateRedirectUrl('https://evil.example', '/chat')).toBe('/chat');
    });
  });
});
