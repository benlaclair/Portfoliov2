import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formspreeId = import.meta.env.FORMSPREE_ID;

  if (!formspreeId) {
    return new Response(JSON.stringify({ error: 'Contact form not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();

  // Honeypot check
  if (formData.get('_gotcha')) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send.' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
