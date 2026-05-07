import { describe, expect, it, vi, afterEach } from 'vitest';

import { getDefaultSystemTitle, mergeFeConfigs } from '@/service/common/system/feConfigs';

describe('system feConfigs branding', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers file config systemTitle over the default branding', () => {
    const merged = mergeFeConfigs({
      fileFeConfigs: {
        systemTitle: 'My Console',
        limit: {
          exportDatasetLimitMinutes: 3
        }
      },
      dbFeConfigs: undefined
    });

    expect(merged.systemTitle).toBe('My Console');
    expect(merged.limit?.exportDatasetLimitMinutes).toBe(3);
  });

  it('uses the app default title instead of FastGPT when no custom title is configured', () => {
    vi.stubEnv('SYSTEM_NAME', '');

    expect(getDefaultSystemTitle()).toBe('智能体应用管理平台');
  });
});
