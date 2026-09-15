export async function onRequestGet(context) {
  const SUPABASE_URL = context.env.SUPABASE_URL || "https://fvwgndrrcqjberpdmmcz.supabase.co";
  const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

  const url = `${SUPABASE_URL}/rest/v1/quotes?select=*&order=random()&limit=1`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data[0] || {}), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}