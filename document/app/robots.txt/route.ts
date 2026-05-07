import { NextResponse } from 'next/server';
import { getDocsDomain, getDocsHomeDomain } from '@/lib/branding';

export const dynamic = 'force-static';

export function GET() {
  const homeDomain = getDocsHomeDomain(process.env.FASTGPT_HOME_DOMAIN);
  const domain = getDocsDomain(process.env.FASTGPT_HOME_DOMAIN);
  const isCN = homeDomain.includes('.cn');

  if (!domain) {
    return new NextResponse('', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  let content: string;

  if (isCN) {
    content = `User-Agent: Googlebot
Disallow: /

User-Agent: *
Allow: /

Host: ${domain}
Sitemap: ${domain}/sitemap.xml
`;
  } else {
    content = `User-Agent: bingbot
Disallow: /

User-Agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;
  }

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
