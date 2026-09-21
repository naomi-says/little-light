const SUPABASE_URL =
  "https://fvwgndrrcqjberpdmmcz.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_xlqiJ2voo1xlLqcoyVRCyA_ejHVR7dO";

const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation"
};

async function handleQuotes() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/quotes?select=*`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return Response.json(
        { error: "No quotes found in database." },
        { status: 404 }
      );
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomQuote = data[randomIndex];

    return Response.json(randomQuote, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Quote error:", error);

    return Response.json(
      { error: "Unable to load a quote." },
      { status: 500 }
    );
  }
}


async function handleEntries(request) {
  const url = `${SUPABASE_URL}/rest/v1/entries`;

  try {
    // GET /api/entries
    if (request.method === "GET") {
      const response = await fetch(
        `${url}?select=*&order=entry_date.desc`,
        {
          headers: supabaseHeaders
        }
      );

      const data = await response.json();

      return Response.json(
        Array.isArray(data) ? data : [],
        { status: response.status }
      );
    }

    // POST /api/entries
    if (request.method === "POST") {
      const body = await request.json();

      if (!body.text) {
        return Response.json(
          { error: "Text is required" },
          { status: 400 }
        );
      }

      const payload = {
        text: body.text,
        entry_date:
          body.date ||
          new Date().toISOString().slice(0, 10)
      };

      const response = await fetch(url, {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      const inserted =
        Array.isArray(data) ? data[0] : data;

      return Response.json(
        inserted || {},
        { status: response.status }
      );
    }

    // DELETE /api/entries?id=123
    if (request.method === "DELETE") {
      const requestUrl = new URL(request.url);
      const id = requestUrl.searchParams.get("id");

      if (!id) {
        return Response.json(
          { error: "Entry ID is required" },
          { status: 400 }
        );
      }

      const response = await fetch(
        `${url}?id=eq.${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: supabaseHeaders
        }
      );

      return Response.json(
        { message: "Deleted" },
        { status: response.ok ? 200 : response.status }
      );
    }

    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );

  } catch (error) {
    console.error("Entry error:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // -------------------------
    // API ROUTES
    // -------------------------

    if (
      url.pathname === "/api/quotes" ||
      url.pathname === "/api/quotes/random"
    ) {
      return handleQuotes();
    }

    if (url.pathname === "/api/entries") {
      return handleEntries(request);
    }

    // -------------------------
    // FRONTEND
    // -------------------------

    return env.ASSETS.fetch(request);
  }
};