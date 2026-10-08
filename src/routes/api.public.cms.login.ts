import { createFileRoute } from '@tanstack/react-router';

const headers = { 'Cache-Control': 'no-store' };

export const Route = createFileRoute('/api/public/cms/login')({
  server: {
    handlers: {
      GET: async () => {
        const { cmsSession } = await import('@/lib/cms-session.server');
        const session = await cmsSession();
        return Response.json({ authenticated: session.data.admin === true }, { headers });
      },
      POST: async ({ request }) => {
        const origin = request.headers.get('origin');
        if (origin !== new URL(request.url).origin) {
          return Response.json({ error: 'Unauthorized' }, { status: 403, headers });
        }
        const { cmsSession, matchesSecret } = await import('@/lib/cms-session.server');
        const username = process.env['CMS_ADMIN_USERNAME'];
        const password = process.env['CMS_ADMIN_PASSWORD'];
        if (!username || !password) throw new Error('CMS login configuration missing');
        let data: unknown;
        try { data = await request.json(); } catch {
          return Response.json({ error: 'লগইন তথ্য সঠিক নয়' }, { status: 400, headers });
        }
        if (!data || typeof data !== 'object' || !('username' in data) || !('password' in data) ||
            typeof data.username !== 'string' || typeof data.password !== 'string' ||
            data.username.length > 128 || data.password.length > 256) {
          return Response.json({ error: 'লগইন তথ্য সঠিক নয়' }, { status: 401, headers });
        }
        const validUser = matchesSecret(data.username, username);
        const validPassword = matchesSecret(data.password, password);
        if (!validUser || !validPassword) {
          await new Promise(resolve => setTimeout(resolve, 600));
          return Response.json({ error: 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়' }, { status: 401, headers });
        }
        const session = await cmsSession();
        await session.update({ admin: true });
        return Response.json({ authenticated: true }, { headers });
      },
    },
  },
});