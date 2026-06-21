import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/content/queries';
import SiteEditor from './SiteEditor';

export const dynamic = 'force-dynamic';

export default async function SitePage() {
  const supabase = createClient();
  const siteContent = await getSiteContent(supabase);

  return <SiteEditor initialSections={siteContent} />;
}
