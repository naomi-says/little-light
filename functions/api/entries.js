export async function onRequest(context) {
  const { request } = context;
  const SUPABASE_URL = "https://fvwgndrrcqjberpdmmcz.supabase.co";
  const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

  const url = `${SUPABASE_URL}/rest/v1/entries`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (request.method === 'GET') {
      const res = await fetch(`${url}?select=*&order=entry_date.desc`, { headers });
      const data = await res.json();
      return new Response(JSON.stringify(Array.isArray(data) ? data : []), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const payload = JSON.stringify({ text: body.text, entry_date: body.date });
      const res = await fetch(url, { method: 'POST', headers, body: payload });
      const data = await res.json();
      const inserted = Array.isArray(data) ? data[0] : data;
      return new Response(JSON.stringify(inserted || {}), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'DELETE') {
      const requestUrl = new URL(request.url);
      const id = requestUrl.searchParams.get('id');
      await fetch(`${url}?id=eq.${id}`, { method: 'DELETE', headers });
      return new Response(JSON.stringify({ message: 'Deleted' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}