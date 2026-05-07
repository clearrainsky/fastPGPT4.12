import { describe, expect, it } from 'vitest';
import { AppTypeEnum } from '@fastgpt/global/core/app/constants';
import {
  chatTeamAppTabs,
  chatTeamVisibleAppTypes
} from '@/pageComponents/chat/ChatTeamApp/utils';

describe('ChatTeamApp utils', () => {
  it('should hide dialogue agents and workflow tools from the team app tabs', () => {
    expect(chatTeamAppTabs).toEqual(['all', AppTypeEnum.workflow]);
  });

  it('should only request visible team app types for the chat team app page', () => {
    expect(chatTeamVisibleAppTypes).toEqual([
      AppTypeEnum.folder,
      AppTypeEnum.toolFolder,
      AppTypeEnum.workflow
    ]);
  });
});
