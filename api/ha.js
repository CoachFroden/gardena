const crypto = require("crypto");

const SESSION_COOKIE = "rolfen_session";
const SESSION_DAYS = 30;
const ALLOWED_SERVICES = {
  lawn_mower: new Set(["start_mowing", "pause", "dock"]),
  switch: new Set(["turn_on", "turn_off"]),
  number: new Set(["set_value"]),
  select: new Set(["select_option"]),
  button: new Set(["press"])
};
const MATCH_TERMS = ["rolfen", "gardena", "sileno"];

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const baseUrl = String(process.env.HA_URL || "").replace(/\/$/, "");
  const token = process.env.HA_TOKEN;
  const appPin = String(process.env.APP_PIN || "");
  const sessionSecret = process.env.APP_SESSION_SECRET || token || "";

  if (!baseUrl || !token || !appPin || !sessionSecret) {
    return res.status(503).json({
      ok: false,
      configured: false,
      error: "Mangler HA_URL, HA_TOKEN eller APP_PIN i Vercel."
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  try {
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

      if (body.action === "login") {
        if (!safeEqual(String(body.app_pin || ""), appPin)) {
          return res.status(401).json({ ok: false, error: "Feil app-kode." });
        }
        setSessionCookie(res, sessionSecret);
        return res.status(200).json({ ok: true });
      }

      if (body.action === "logout") {
        res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
        return res.status(200).json({ ok: true });
      }

      if (!isAuthenticated(req, sessionSecret)) {
        return res.status(401).json({ ok: false, error: "Ikke innlogget." });
      }

      const domain = sanitizeSegment(body.domain);
      const service = sanitizeSegment(body.service);
      const entityId = String(body.entity_id || "");

      if (!domain || !service || !entityId || !ALLOWED_SERVICES[domain]?.has(service)) {
        return res.status(403).json({ ok: false, error: "Denne kommandoen er ikke tillatt." });
      }

      const entityResponse = await fetch(`${baseUrl}/api/states/${encodeURIComponent(entityId)}`, { headers });
      const entity = await safeJson(entityResponse);
      if (!entityResponse.ok || !isRolfenEntity(entity)) {
        return res.status(403).json({ ok: false, error: "Kommandoen gjelder ikke Rolfen." });
      }

      const serviceData = { ...(body.data || {}), entity_id: entityId };
      const response = await fetch(`${baseUrl}/api/services/${domain}/${service}`, {
        method: "POST",
        headers,
        body: JSON.stringify(serviceData)
      });
      return res.status(response.status).json(await safeJson(response));
    }

    if (req.method === "GET") {
      const action = String(req.query.action || "states");

      if (action === "session") {
        return isAuthenticated(req, sessionSecret)
          ? res.status(200).json({ ok: true })
          : res.status(401).json({ ok: false });
      }

      if (!isAuthenticated(req, sessionSecret)) {
        return res.status(401).json({ ok: false, error: "Ikke innlogget." });
      }

      if (action === "health") {
        const response = await fetch(`${baseUrl}/api/`, { headers });
        const payload = await safeJson(response);
        return res.status(response.status).json({ ok: response.ok, configured: true, homeAssistant: payload });
      }

      if (action === "calendar") {
        const entity = String(req.query.entity || "");
        const start = String(req.query.start || "");
        const end = String(req.query.end || "");
        if (!entity || !start || !end) {
          return res.status(400).json({ ok: false, error: "Mangler kalender, start eller slutt." });
        }

        const stateResponse = await fetch(`${baseUrl}/api/states/${encodeURIComponent(entity)}`, { headers });
        const calendarState = await safeJson(stateResponse);
        if (!stateResponse.ok || !isRolfenEntity(calendarState)) {
          return res.status(403).json({ ok: false, error: "Kalenderen tilhører ikke Rolfen." });
        }

        const url = new URL(`${baseUrl}/api/calendars/${encodeURIComponent(entity)}`);
        url.searchParams.set("start", start);
        url.searchParams.set("end", end);
        const response = await fetch(url, { headers });
        return res.status(response.status).json(await safeJson(response));
      }

      const response = await fetch(`${baseUrl}/api/states`, { headers });
      const payload = await safeJson(response);
      if (!response.ok || !Array.isArray(payload)) return res.status(response.status).json(payload);
      return res.status(200).json(payload.filter(isRolfenEntity));
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

function isRolfenEntity(entity) {
  if (!entity || typeof entity !== "object") return false;
  const id = String(entity.entity_id || "").toLowerCase();
  const friendly = String(entity.attributes?.friendly_name || "").toLowerCase();
  const haystack = `${id} ${friendly}`;
  return MATCH_TERMS.some((term) => haystack.includes(term));
}

function sanitizeSegment(value) {
  const text = String(value || "");
  return /^[a-z0-9_]+$/i.test(text) ? text : "";
}

function safeEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function setSessionCookie(res, secret) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const value = `${payload}.${signature}`;
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DAYS * 86400}`
  );
}

function isAuthenticated(req, secret) {
  const cookies = parseCookies(req.headers.cookie || "");
  const value = cookies[SESSION_COOKIE];
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", secret).update(expires).digest("hex");
  return safeEqual(signature, expected);
}

function parseCookies(header) {
  return header.split(";").reduce((acc, part) => {
    const index = part.indexOf("=");
    if (index === -1) return acc;
    acc[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
    return acc;
  }, {});
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
