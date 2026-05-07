import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TemplateImportModal from '@/pageComponents/dataset/detail/CollectionCard/TemplateImportModal';

vi.mock('@chakra-ui/react', () => {
  const createPrimitive =
    (tag: string) =>
    ({ children, ...props }: any) =>
      React.createElement(tag, props, children);

  return {
    Box: createPrimitive('div'),
    Button: createPrimitive('button'),
    HStack: createPrimitive('div'),
    VStack: createPrimitive('div'),
    Flex: createPrimitive('div'),
    Link: createPrimitive('a'),
    ModalBody: createPrimitive('div'),
    ModalFooter: createPrimitive('div')
  };
});

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, any>) => {
      if (key === 'common:Instructions') return '使用说明';
      if (key === 'dataset:template_dataset') return '模板导入';
      if (key === 'dataset:upload_by_template_format') return '按模板格式上传';
      if (key === 'dataset:download_csv_template') return '下载 CSV 模板';
      if (key === 'common:Close') return '关闭';
      if (key === 'common:comfirm_import') return '确认导入';
      if (key === 'dataset:data_parsing') return '数据解析中';
      if (key === 'dataset:data_uploading') return `上传中${values?.num ?? ''}`;
      if (key === 'common:import_success') return '导入成功';
      return key;
    }
  }),
  Trans: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children)
}));

vi.mock('@/web/core/dataset/context/datasetPageContext', () => ({
  DatasetPageContext: {}
}));

vi.mock('use-context-selector', () => ({
  useContextSelector: () => 'dataset-id'
}));

vi.mock('@fastgpt/web/components/common/MyModal', () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) =>
    React.createElement(
      'div',
      { 'data-testid': 'modal' },
      React.createElement('div', null, title),
      children
    )
}));

vi.mock('@/components/Select/FileSelectorBox', () => ({
  default: () => React.createElement('div', null, 'file-selector')
}));

vi.mock('@fastgpt/web/components/common/Icon', () => ({
  default: () => React.createElement('i')
}));

vi.mock('@fastgpt/web/components/common/Icon/button', () => ({
  default: () => React.createElement('button', { type: 'button' }, 'icon-button')
}));

vi.mock('@/web/core/dataset/api/collection', () => ({
  postTemplateDatasetCollection: vi.fn()
}));

vi.mock('@fastgpt/web/hooks/useRequest', () => ({
  useRequest: () => ({
    runAsync: vi.fn(),
    loading: false
  })
}));

vi.mock('@/web/common/system/doc', () => ({
  getDocPath: () => '/docs/introduction/guide/knowledge_base/template/'
}));

describe('TemplateImportModal', () => {
  it('should hide the instructions link in template import modal', () => {
    const html = renderToStaticMarkup(
      React.createElement(TemplateImportModal, {
        onFinish: vi.fn(),
        onClose: vi.fn()
      })
    );

    expect(html).not.toContain('使用说明');
  });
});
