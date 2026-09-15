export async function onRequest(context) {
  const { request, env } = context;
  const url = `${env.SUPABASE_URL}/rest/v1/entries`;
  const headers = {
    'apikey': env.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (request.method === 'GET') {
      const res = await fetch(`${url}?user_id=eq.1&order=entry_date.desc`, { headers });
      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const payload = JSON.stringify({ user_id: 1, text: body.text, entry_date: body.date });
      const res = await fetch(url, { method: 'POST', headers, body: payload });
      const data = await res.json();
      return new Response(JSON.stringify(data[0] || {}), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'DELETE') {
      const requestUrl = new URL(request.url);
      const id = requestUrl.searchParams.get('id');
      await fetch(`${url}?id=eq.${id}`, { method: 'DELETE', headers });
      return new Response(JSON.stringify({ message: 'Deleted' }), { headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}