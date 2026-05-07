import { AppTypeEnum } from '@fastgpt/global/core/app/constants';

export const chatTeamVisibleAppTypes = [
  AppTypeEnum.folder,
  AppTypeEnum.toolFolder,
  AppTypeEnum.workflow
] as const;

export const chatTeamAppTabs = ['all', AppTypeEnum.workflow] as const;
