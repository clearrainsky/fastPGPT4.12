import type { FastGPTFeConfigsType } from '@fastgpt/global/common/system/types';
import type { FastGPTConfigFileType } from '@fastgpt/global/common/system/types';
import { env } from '@fastgpt/service/env';

export const getDefaultSystemTitle = () => process.env.SYSTEM_NAME || '智能体应用管理平台';

export const getDefaultFeConfigs = (): FastGPTFeConfigsType => ({
  show_emptyChat: true,
  show_git: false,
  docUrl: '',
  openAPIDocUrl: '',
  submitPluginRequestUrl: '',
  appTemplateCourse: '',
  systemTitle: getDefaultSystemTitle(),
  concatMd: '',
  limit: {
    exportDatasetLimitMinutes: 0,
    websiteSyncLimitMinuted: 0,
    workflowParallelRunMaxConcurrency: env.WORKFLOW_PARALLEL_MAX_CONCURRENCY
  },
  scripts: [],
  favicon: '/favicon.ico',
  chineseRedirectUrl: process.env.CHINESE_IP_REDIRECT_URL || '',
  uploadFileMaxSize: Number(process.env.UPLOAD_FILE_MAX_SIZE || 1000),
  uploadFileMaxAmount: Number(process.env.UPLOAD_FILE_MAX_AMOUNT || 1000)
});

export const mergeFeConfigs = ({
  fileFeConfigs,
  dbFeConfigs
}: {
  fileFeConfigs?: FastGPTConfigFileType['feConfigs'];
  dbFeConfigs?: FastGPTConfigFileType['feConfigs'];
}): FastGPTFeConfigsType => {
  const defaultFeConfigs = getDefaultFeConfigs();

  return {
    ...defaultFeConfigs,
    ...(fileFeConfigs || {}),
    ...(dbFeConfigs || {}),
    limit: {
      ...defaultFeConfigs.limit,
      ...(fileFeConfigs?.limit || {}),
      ...(dbFeConfigs?.limit || {})
    }
  };
};
