// ============================================================
// A response body isn't always JSON, even from our own API routes.
// If a request gets rejected by the hosting platform itself before
// reaching our code (e.g. Vercel's request body size limit), the
// response can be an empty body or an HTML error page — calling
// res.json() directly on that throws "Unexpected end of JSON input"
// and crashes whatever awaited it. This reads the body as text
// first and only parses it as JSON if it actually looks like JSON.
// ============================================================

export async function safeJson<T = any>(
  res: Response
): Promise<{ ok: boolean; data: T | null; rawError: string | null }> {
  const text = await res.text();

  if (!text) {
    return {
      ok: false,
      data: null,
      rawError: res.ok
        ? null
        : `The server returned an empty response (status ${res.status}). This usually means the file was too large or the connection was interrupted.`,
    };
  }

  try {
    const data = JSON.parse(text);
    return { ok: res.ok, data, rawError: null };
  } catch {
    return {
      ok: false,
      data: null,
      rawError: `Unexpected response from the server (status ${res.status}). Please try a smaller image.`,
    };
  }
}
