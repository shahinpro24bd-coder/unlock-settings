import { createFileRoute } from "@tanstack/react-router";
import { WebsitePreview } from "@/components/website-preview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ডাঃ এম এ বি সিদ্দিক — ওয়েবসাইট প্রিভিউ" },
      { name: "description", content: "অধ্যাপক ডাঃ এম এ বি সিদ্দিকের ওয়েবসাইট ও রং-ফন্ট Settings-এর প্রিভিউ।" },
      { property: "og:title", content: "ডাঃ এম এ বি সিদ্দিক — ওয়েবসাইট প্রিভিউ" },
      { property: "og:description", content: "ওয়েবসাইটের রং ও ফন্ট পরিবর্তনের প্রিভিউ।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WebsitePreview,
});
