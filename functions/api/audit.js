// Cloudflare Pages Function: authenticated proxy to the Anthropic API.
// Secrets required (set in Cloudflare Pages > Settings > Environment variables):
//   ANTHROPIC_API_KEY  - your key from platform.claude.com
//   AUDIT_PASSWORD     - the access code for the audit tool
export async function onRequestPost(context) {
  const { request, env } = context;
  const provided = request.headers.get("x-audit-key") || "";
  if (!env.AUDIT_PASSWORD || provided !== env.AUDIT_PASSWORD) {
    return new Response(JSON.stringify({ error: { message: "Unauthorized" } }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const body = await request.text();
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "web-fetch-2025-09-10",
    },
    body,
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
