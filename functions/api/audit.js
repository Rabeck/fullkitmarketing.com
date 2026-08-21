// Cloudflare Pages Function: authenticated proxy to the Anthropic API.
// Secrets required (set in Cloudflare Pages > Settings > Environment variables):
//   ANTHROPIC_API_KEY  - your key from platform.claude.com
//   AUDIT_PASSWORD     - the access code for the audit tool

const json = (obj, status) =>
  new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json" },
  });

// Health check: open https://fullkitmarketing.com/api/audit in a browser.
export async function onRequestGet(context) {
  const { env } = context;
  return json({
    ok: true,
    service: "full-kit-audit-proxy",
    api_key_configured: Boolean(env.ANTHROPIC_API_KEY),
    password_configured: Boolean(env.AUDIT_PASSWORD),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.AUDIT_PASSWORD || !env.ANTHROPIC_API_KEY) {
    return json(
      { error: { message: "Server not configured: set ANTHROPIC_API_KEY and AUDIT_PASSWORD in Cloudflare Pages environment variables, then redeploy" } },
      502
    );
  }
  const provided = request.headers.get("x-audit-key") || "";
  if (provided !== env.AUDIT_PASSWORD) {
    return json({ error: { message: "Unauthorized" } }, 401);
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
  if (upstream.status === 401 || upstream.status === 403) {
    return json(
      { error: { message: "The server's Anthropic API key was rejected (upstream " + upstream.status + "). Check the ANTHROPIC_API_KEY secret in Cloudflare and redeploy" } },
      502
    );
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
