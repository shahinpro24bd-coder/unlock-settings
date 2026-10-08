import { createFileRoute, notFound } from '@tanstack/react-router';
import { WebsitePreview } from '@/components/website-preview';

const names: Record<string, string> = {
  index: 'হোম', about: 'পরিচয়', contact: 'যোগাযোগ', gallery: 'গ্যালারি', service: 'সেবাসমূহ',
  'service-breast': 'ব্রেস্ট সার্জারি', 'service-cancer': 'ক্যান্সার সার্জারি',
  'service-colorectal': 'কোলোরেক্টাল সার্জারি', 'service-endoscopy': 'এন্ডোস্কোপি',
  'service-general': 'জেনারেল সার্জারি', 'service-laparoscopic': 'ল্যাপারোস্কোপিক সার্জারি',
};

export const Route = createFileRoute('/$page')({
  beforeLoad: ({ params }) => {
    const key = params.page.replace(/2?\.html$/, '');
    if (!params.page.endsWith('.html') || !(key in names)) throw notFound();
  },
  head: ({ params }) => {
    const key = params.page.replace(/2?\.html$/, '');
    const title = `${names[key] || 'পৃষ্ঠা'}${params.page.endsWith('2.html') ? ' — এডিটর' : ''} — ডাঃ এম এ বি সিদ্দিক`;
    const description = `${names[key] || 'ওয়েবসাইট'} — অধ্যাপক ডাঃ এম এ বি সিদ্দিক।`;
    return { meta: [
      { title }, { name: 'description', content: description },
      { property: 'og:title', content: title }, { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    ] };
  },
  component: WebsitePage,
});

function WebsitePage() {
  const { page } = Route.useParams();
  return <WebsitePreview page={page} />;
}