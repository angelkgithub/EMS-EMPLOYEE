/*
  OPTIONAL PASSWORD GATE (HTTP Basic Auth) for the whole hub.

  To turn it on:
    1. Rename this file to  middleware.js  (same folder as vercel.json).
    2. In Vercel: Project > Settings > Environment Variables, add
         HUB_USER      a shared username, for example  ems
         HUB_PASSWORD  a long shared password (16+ characters)
    3. Redeploy.

  Employees get the browser's login box once per browser session.
  This is one shared password, not per-person accounts. Change it when
  someone leaves. For per-person login, use Vercel Authentication
  (team members only) or put the site behind Cloudflare Access / Google login.

  Written to Vercel's Routing Middleware format for non-framework projects
  (package.json has "type": "module"). Returning nothing lets the request through.
*/

export const config = {
  // Everything except Vercel's internal paths.
  matcher: '/((?!_vercel).*)',
};

function safeEqual(a, b) {
  // Compare every character so the timing doesn't reveal where a guess went wrong.
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export default function middleware(request) {
  const user = process.env.HUB_USER;
  const pass = process.env.HUB_PASSWORD;

  if (!user || !pass) {
    return new Response('The hub login is not configured. Ask an admin to set HUB_USER and HUB_PASSWORD.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)));
      const i = decoded.indexOf(':');
      if (i > -1 && safeEqual(decoded.slice(0, i), user) && safeEqual(decoded.slice(i + 1), pass)) {
        return; // signed in: continue to the site
      }
    } catch {
      /* malformed header: fall through to the login prompt */
    }
  }

  return new Response('Sign in to view the EMS Team Hub.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="EMS Team Hub", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
