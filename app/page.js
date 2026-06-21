import { createClient } from '@/lib/supabase/server';
import { getPortfolioSections, getSiteContent } from '@/lib/content/queries';
import HomePage from './HomePage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();
  const [portfolioSections, siteContent] = await Promise.all([
    getPortfolioSections(supabase),
    getSiteContent(supabase),
  ]);

  return <HomePage portfolioSections={portfolioSections} siteContent={siteContent} />;
}
