export const getApiBaseUrl = ({
  customApiDomain,
  origin
}: {
  customApiDomain?: string;
  origin?: string;
}) => {
  const trimmedCustomApiDomain = customApiDomain?.trim();
  if (trimmedCustomApiDomain) {
    return trimmedCustomApiDomain.replace(/\/$/, '');
  }

  if (!origin) return '';

  return `${origin.replace(/\/$/, '')}/api`;
};

export const getMarketplaceUrl = (marketplaceUrl?: string) => {
  return marketplaceUrl?.trim() || '';
};
