
export async function onRequestGet(context) {
  const SUPABASE_URL =
    context.env.SUPABASE_URL ||
    "https://fvwgndrrcqjberpdmmcz.supabase.co";

  const SUPABASE_ANON_KEY =
    "sb_publishable_xlqiJ2voo1xlLqcoyVRCyA_ejHVR7dO";

  const url =
    `${SUPABASE_URL}/rest/v1/quotes?select=*`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error(`Supabase request failed: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No verses found in the database."
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    // Select a random verse from the available verses.
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomQuote = data[randomIndex];

    return new Response(JSON.stringify(randomQuote), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  } catch (err) {
    console.error("Failed to fetch random verse:", err);

    return new Response(
      JSON.stringify({
        error: "Unable to load a verse."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  }
}