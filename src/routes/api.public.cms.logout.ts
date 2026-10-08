import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/cms/logout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.headers.get('origin') !== new URL(request.url).origin) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }
        const { cmsSession } = await import('@/lib/cms-session.server');
        const session = await cmsSession();
        await session.clear();
        return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
      },
    },
  },
});