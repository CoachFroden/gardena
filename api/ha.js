module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const baseUrl = String(process.env.HA_URL || "").replace(/\/$/, "");
  const token = process.env.HA_TOKEN;

  if (!baseUrl || !token) {
    return res.status(503).json({
      ok: false,
      configured: false,
      error: "Home Assistant er ikke konfigurert på serveren."
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  try {
    if (req.method === "GET") {
      const action = String(req.query.action || "states");

      if (action === "health") {
        const response = await fetch(`${baseUrl}/api/`, { headers });
        const payload = await safeJson(response);
        return res.status(response.status).json({
          ok: response.ok,
          configured: true,
          homeAssistant: payload
        });
      }

      if (action === "calendar") {
        const entity = String(req.query.entity || "");
        const start = String(req.query.start || "");
        const end = String(req.query.end || "");

        if (!entity || !start || !end) {
          return res.status(400).json({ ok: false, error: "Mangler kalender, start eller slutt." });
        }

        const url = new URL(`${baseUrl}/api/calendars/${encodeURIComponent(entity)}`);
        url.searchParams.set("start", start);
        url.searchParams.set("end", end);

        const response = await fetch(url, { headers });
        const payload = await safeJson(response);
        return res.status(response.status).json(payload);
      }

      const response = await fetch(`${baseUrl}/api/states`, { headers });
      const payload = await safeJson(response);
      return res.status(response.status).json(payload);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const domain = sanitizeSegment(body.domain);
      const service = sanitizeSegment(body.service);

      if (!domain || !service) {
        return res.status(400).json({ ok: false, error: "Mangler domain eller service." });
      }

      const serviceData = { ...(body.data || {}) };
      if (body.entity_id) serviceData.entity_id = body.entity_id;

      const response = await fetch(`${baseUrl}/api/services/${domain}/${service}`, {
        method: "POST",
        headers,
        body: JSON.stringify(serviceData)
      });

      const payload = await safeJson(response);
      return res.status(response.status).json(payload);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Ukjent feil mot Home Assistant"
    });
  }
};

function sanitizeSegment(value) {
  const text = String(value || "");
  return /^[a-z0-9_]+$/i.test(text) ? text : "";
}

async function safeJson(response) {
  const text = await response.text();
  if (!text) return { ok: response.ok };
  try {
    return JSON.parse(text);
  } catch {
    return { ok: response.ok, raw: text };
  }
}