export function WebsitePreview({ page = 'index.html' }: { page?: string }) {
  return (
    <iframe
      className="website-preview"
      src={`/website/${page}`}
      title="অধ্যাপক ডাঃ এম এ বি সিদ্দিক — Settings preview"
    />
  );
}