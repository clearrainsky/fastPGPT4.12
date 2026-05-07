export const getDocsSiteName = (siteName?: string) => {
  return siteName?.trim() || 'Documentation';
};

export const getDocsHomeDomain = (homeDomain?: string) => {
  return homeDomain?.trim() || '';
};

export const getDocsDomain = (homeDomain?: string) => {
  const normalizedHomeDomain = getDocsHomeDomain(homeDomain);
  if (!normalizedHomeDomain) return '';

  if (normalizedHomeDomain.startsWith('https://')) {
    return normalizedHomeDomain.replace('https://', 'https://doc.');
  }
  if (normalizedHomeDomain.startsWith('http://')) {
    return normalizedHomeDomain.replace('http://', 'http://doc.');
  }

  return normalizedHomeDomain;
};
