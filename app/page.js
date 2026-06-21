import { createClient } from '@/lib/supabase/server';
import { getPortfolioSections } from '@/lib/content/queries';
import HomePage from './HomePage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createClient();
  const portfolioSections = await getPortfolioSections(supabase);

  return <HomePage portfolioSections={portfolioSections} />;
}
