const API = "/api/ha";
const MATCH_TERMS = ["rolfen", "gardena", "sileno"];

const ENTITY_NAME_NO = {
  "Battery Level": "Batterinivå",
  "Activity": "Aktivitet",
  "State": "Status",
  "Mode": "Modus",
  "Next Start Time": "Neste start",
  "Remaining Charging Time": "Gjenstående ladetid",
  "Battery Voltage": "Batterispenning",
  "Battery Current": "Batteristrøm",
  "Battery Temperature": "Batteritemperatur",
  "Error Code": "Feilkode",
  "Error Description": "Feilbeskrivelse",
  "Number Of Messages": "Antall meldinger",
  "Operator State": "Operatørstatus",
  "Spot Cutting": "Punktklipping",
  "Charging Station Mowing Share": "Klippeandel fra ladestasjon",
  "Last Message": "Siste melding",
  "Model": "Modell",
  "Mower Name": "Klippernavn",
  "Serial Number": "Serienummer",
  "Hardware Serial Number": "Serienummer maskinvare",
  "Hardware Revision": "Maskinvarerevisjon",
  "Production Time": "Produksjonstidspunkt",
  "Node IPR ID": "Node IPR-ID",
  "Husqvarna ID": "Husqvarna-ID",
  "Boot Software Version": "Oppstartsprogramvare",
  "Application Software Version": "Programvareversjon",
  "Sub Software Version": "Underprogramvare",
  "Software Package Version": "Programvarepakke",
  "Pitch": "Helning",
  "Roll": "Sidehelning",
  "Mower Temperature": "Klippertemperatur",
  "Orientation Pitch": "Retningshelning",
  "Orientation Roll": "Retnings-sidehelning",
  "Signal Quality": "Signalkvalitet",
  "Loop Signal Strength": "Sløyfesignalkvalitet",
  "A0 Signal": "A0-signal",
  "F Signal": "F-signal",
  "N Signal": "N-signal",
  "Message From Charging Station": "Melding fra ladestasjon",
  "Supported Accessories": "Støttet tilbehør",
  "Total Running Time": "Total driftstid",
  "Total Cutting Time": "Total klippetid",
  "Total Charging Time": "Total ladetid",
  "Total Searching Time": "Total søketid",
  "Cutting Blade Usage Time": "Brukstid knivblad",
  "Number Of Collisions": "Antall kollisjoner",
  "Number Of Charging Cycles": "Antall ladesykluser",
  "Collision": "Kollisjon",
  "Lift": "Løftet",
  "Upside Down": "Opp-ned",
  "In Charging Station": "I ladestasjon",
  "Frost Sensor Enabled": "Frostsensor aktiv",
  "Garage Supported": "Garasje støttet",
  "ZoneProtect Supported": "ZoneProtect støttet",
  "Anti-collision Radar Available": "Antikollisjonsradar tilgjengelig",
  "Spot Cut": "Punktklipping",
  "Park Until Further Notice": "Parkér inntil videre",
  "SensorControl": "SensorControl",
  "Frost Sensor": "Frostsensor",
  "Avoid Garage": "Unngå garasje",
  "Anti-collision Radar": "Antikollisjonsradar",
  "Eco Mode": "Økomodus",
  "Manual Mowing Duration": "Manuell klippetid",
  "Drive Past Wire": "Kjør forbi begrensningskabel",
  "Charging Station Starting Point Distance": "Startavstand fra ladestasjon",
  "SensorControl Sensitivity": "SensorControl-følsomhet",
  "Diagnostic Refresh": "Oppdater diagnostikk",
  "Generate Loop Signal": "Generer sløyfesignal",
  "Reset Cutting Blade Usage Time": "Nullstill brukstid for knivblad",
  "Schedule": "Klippeplan"
};

const DOMAIN_NO = {
  switch: "Bryter",
  number: "Verdi",
  select: "Valg",
  button: "Handling",
  sensor: "Sensor",
  binary_sensor: "Sensor",
  calendar: "Kalender",
  lawn_mower: "Robotklipper"
};

const VALUE_NO = {
  none: "Ingen aktivitet",
  stopped: "Stoppet",
  mowing: "Klipper",
  cutting: "Klipper",
  charging: "Lader",
  docked: "Parkert",
  parked: "Parkert",
  paused: "Pauset",
  error: "Feil",
  auto: "Automatisk",
  automatic: "Automatisk",
  manual: "Manuell",
  on: "På",
  off: "Av",
  true: "Ja",
  false: "Nei",
  active: "Aktiv",
  inactive: "Ikke aktiv",
  not_active: "Ikke aktiv",
  idle: "Venter",
  pending_start: "Venter på start",
  running: "Kjører",
  unknown: "Ukjent",
  unavailable: "Utilgjengelig",
  low: "Lav",
  medium: "Middels",
  high: "Høy",
  "right boundary wire": "Høyre begrensningskabel",
  "left boundary wire": "Venstre begrensningskabel",
  "guide wire 1": "Guidekabel 1",
  "guide wire 2": "Guidekabel 2",
  "guide wire 3": "Guidekabel 3",
  "no error": "Ingen feil",
  "going home": "På vei hjem",
  going_home: "På vei hjem",
  goinghome: "På vei hjem",
  searching: "Søker etter ladestasjonen",
  "searching for charging station": "Søker etter ladestasjonen"
};

function translateEntityName(name) {
  const direct = ENTITY_NAME_NO[name];
  if (direct) return direct;

  let match = name.match(/^Starting Point (\d+) Distance$/i);
  if (match) return `Startpunkt ${match[1]} – avstand`;

  match = name.match(/^Starting Point (\d+) Mowing Share$/i);
  if (match) return `Startpunkt ${match[1]} – klippeandel`;

  match = name.match(/^Starting Point (\d+) CorridorCut$/i);
  if (match) return `Startpunkt ${match[1]} – korridorklipp`;

  match = name.match(/^Starting Point (\d+) Wire$/i);
  if (match) return `Startpunkt ${match[1]} – kabel`;

  match = name.match(/^Starting Point (\d+)$/i);
  if (match) return `Startpunkt ${match[1]}`;

  match = name.match(/^Guide (\d+) Signal$/i);
  if (match) return `Guidekabel ${match[1]} – signal`;

  return name;
}

function translateValue(value) {
  const text = String(value ?? "");
  const key = text.toLowerCase();
  if (VALUE_NO[key]) return VALUE_NO[key];

  const unknownError = text.match(/^Unknown error \((\d+)\)$/i);
  if (unknownError) return `Ukjent feil (${unknownError[1]})`;

  return text.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function translateOption(value) {
  return translateValue(value);
}

const state = {
  all: [],
  mower: null,
  related: [],
  controls: [],
  diagnostics: [],
  calendar: null,
  busy: false,
  authenticated: false,
  lastNotifiedError: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  bindStaticUi();
  registerServiceWorker();
  bootstrap();
  window.setInterval(() => {
    if (state.authenticated) refresh();
  }, 15000);
});

function bindStaticUi() {
  $("#authForm")?.addEventListener("submit", login);
  $("#refreshBtn")?.addEventListener("click", () => refresh(true));
  $("#diagnosticRefresh")?.addEventListener("click", pressDiagnosticRefresh);

  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === button.dataset.tab));
    });
  });

  document.querySelectorAll("[data-mower-action]").forEach((button) => {
    button.addEventListener("click", () => mowerAction(button.dataset.mowerAction));
  });
}

async function bootstrap() {
  try {
    const response = await fetch(`${API}?action=session`, { cache: "no-store" });
    if (response.ok) {
      state.authenticated = true;
      hideAuth();
      await refresh();
      return;
    }
  } catch {}
  showAuth();
}

async function login(event) {
  event.preventDefault();
  const input = $("#appPin");
  const error = $("#authError");
  const pin = input?.value?.trim();
  if (!pin) return;

  error.textContent = "";
  const submit = $(".auth-submit");
  if (submit) {
    submit.disabled = true;
    submit.textContent = "Låser opp…";
  }

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", app_pin: pin })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Feil kode");

    state.authenticated = true;
    input.value = "";
    hideAuth();
    await refresh(true);
  } catch (err) {
    error.textContent = err.message || "Kunne ikke logge inn.";
    input?.focus();
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.textContent = "Åpne Rolfen";
    }
  }
}

function showAuth() {
  state.authenticated = false;
  $("#authScreen")?.classList.remove("hidden");
  document.body.classList.add("auth-open");
  window.setTimeout(() => $("#appPin")?.focus(), 80);
}

function hideAuth() {
  $("#authScreen")?.classList.add("hidden");
  document.body.classList.remove("auth-open");
}

async function refresh(manual = false) {
  try {
    if (manual) spinRefresh(true);
    const response = await fetch(`${API}?action=states`, { cache: "no-store" });

    if (response.status === 401) {
      showAuth();
      return;
    }

    if (response.status === 503) {
      $("#setupPanel")?.classList.remove("hidden");
      setConnection(false, "Serveroppsettet må fullføres");
      return;
    }

    if (!response.ok) throw new Error("Home Assistant svarte ikke.");

    const all = await response.json();
    if (!Array.isArray(all)) throw new Error("Uventet svar fra Home Assistant.");

    state.all = all;
    discoverEntities();
    renderAll();
    $("#setupPanel")?.classList.add("hidden");
    setConnection(true, "Tilkoblet • live via Home Assistant");
  } catch (error) {
    setConnection(false, "Mistet kontakt med Home Assistant");
    showToast(error.message || "Kunne ikke oppdatere Rolfen", true);
  } finally {
    spinRefresh(false);
  }
}

function discoverEntities() {
  const scored = state.all
    .map((entity) => ({ entity, score: matchScore(entity) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  state.related = scored.map((item) => item.entity);

  state.mower =
    scored.find(({ entity }) => domainOf(entity) === "lawn_mower")?.entity ||
    state.all.find((entity) => domainOf(entity) === "lawn_mower" && mowerish(entity)) ||
    null;

  const allowedControls = new Set(["switch", "number", "select", "button"]);
  state.controls = state.related.filter((entity) => allowedControls.has(domainOf(entity)));

  const diagnosticDomains = new Set(["sensor", "binary_sensor"]);
  state.diagnostics = state.related.filter((entity) => diagnosticDomains.has(domainOf(entity)));

  state.calendar = state.related.find((entity) => domainOf(entity) === "calendar") || null;
}

function matchScore(entity) {
  const id = entity.entity_id.toLowerCase();
  const name = friendly(entity).toLowerCase();
  const combined = `${id} ${name}`;
  let score = 0;

  for (const term of MATCH_TERMS) {
    if (id.includes(term)) score += 5;
    if (name.includes(term)) score += 7;
  }

  if (domainOf(entity) === "lawn_mower" && mowerish(entity)) score += 15;
  if (combined.includes("mower")) score += 2;
  if (combined.includes("battery")) score += 1;
  return score;
}

function mowerish(entity) {
  const haystack = `${entity.entity_id} ${friendly(entity)} ${JSON.stringify(entity.attributes || {})}`.toLowerCase();
  return ["rolfen", "gardena", "sileno", "mower"].some((term) => haystack.includes(term));
}

function renderAll() {
  renderHero();
  renderStatus();
  renderQuickControls();
  renderControls();
  renderDiagnostics();
  renderSchedule();
}

function renderHero() {
  const battery = findEntity(["battery level", "batteri"], "sensor");
  const activity = findEntity(["activity", "aktivitet"], "sensor");
  const detailedStateEntity = findEntity(["state", "status"], "sensor");
  const detailedState = String(detailedStateEntity?.state || "").toLowerCase();
  const mowerState = detailedState || String(state.mower?.state || "ukjent").toLowerCase();
  const mowerError = currentMowerError();
  const batteryNumber = clampNumber(parseFloat(battery?.state), 0, 100);
  const rawActivity = String(activity?.state || "").toLowerCase();
  const hasActivity = rawActivity && !["none", "unknown", "unavailable"].includes(rawActivity);
  const activityText = hasActivity ? humanize(activity.state) : statusSentence(mowerState);
  const isStopped = ["stopped", "stop", "paused"].includes(detailedState);
  const wasTryingToMove =
    rawActivity.includes("going home") ||
    rawActivity.includes("going_home") ||
    rawActivity.includes("search") ||
    rawActivity.includes("mow") ||
    rawActivity.includes("cut");

  const hero = $(".hero");
  const abnormalStop = isStopped && wasTryingToMove;
  hero?.classList.toggle("has-error", mowerError.active || abnormalStop);

  if (mowerError.active) {
    $("#heroState").textContent = "Rolfen har stoppet";
    $("#heroActivity").textContent = `Feil: ${mowerError.description}${mowerError.code != null ? ` (kode ${mowerError.code})` : ""}`;
    const errorKey = `${mowerError.code ?? ""}:${mowerError.description}`;
    if (state.lastNotifiedError !== errorKey) {
      state.lastNotifiedError = errorKey;
      showToast(`Rolfen: ${mowerError.description}`, true);
    }
  } else if (abnormalStop) {
    $("#heroState").textContent = "Rolfen har stoppet";
    $("#heroActivity").textContent =
      rawActivity.includes("home") || rawActivity.includes("search")
        ? "Han skulle være på vei til ladestasjonen, men klipperen rapporterer at den står stoppet."
        : "Klipperen rapporterer at den står stoppet.";
    const stopKey = `stopped:${rawActivity}`;
    if (state.lastNotifiedError !== stopKey) {
      state.lastNotifiedError = stopKey;
      showToast("Rolfen har stoppet", true);
    }
  } else if (isStopped) {
    $("#heroState").textContent = "Rolfen står stoppet";
    $("#heroActivity").textContent = Number.isFinite(batteryNumber)
      ? `Batteri: ${Math.round(batteryNumber)} %.`
      : "Klipperen står stoppet.";
    state.lastNotifiedError = null;
  } else {
    const displayState = hasActivity ? rawActivity : mowerState;
    $("#heroState").textContent = heroTitle(displayState);
    const batteryLow = Number.isFinite(batteryNumber) && batteryNumber <= 15;
    $("#heroActivity").textContent =
      (displayState.includes("going home") || displayState.includes("going_home") || displayState.includes("search"))
        ? (batteryLow ? `På vei til ladestasjonen – lavt batteri (${Math.round(batteryNumber)} %).` : activityText)
        : activityText;
    state.lastNotifiedError = null;
  }

  $("#batteryValue").textContent = Number.isFinite(batteryNumber) ? Math.round(batteryNumber) : "--";
  const circumference = 320.44;
  const percent = Number.isFinite(batteryNumber) ? batteryNumber : 0;
  $("#batteryRing").style.strokeDashoffset = String(circumference * (1 - percent / 100));

  document.querySelectorAll("[data-mower-action]").forEach((button) => {
    button.disabled = !state.mower || state.busy;
  });
}

function renderStatus() {
  const mowerError = currentMowerError();
  const items = mowerError.active ? [
    ["Batteri", findEntity(["battery level", "batteri"], "sensor"), "%"],
    ["Status", findEntity(["state", "status"], "sensor") || state.mower, ""],
    ["Aktivitet", findEntity(["activity", "aktivitet"], "sensor"), ""],
    ["Feil", findEntity(["error description", "feilbeskrivelse"], "sensor") || findEntity(["error code", "feilkode"], "sensor"), ""]
  ] : [
    ["Batteri", findEntity(["battery level", "batteri"], "sensor"), "%"],
    ["Status", findEntity(["state"], "sensor") || state.mower, ""],
    ["Modus", findEntity(["mode", "modus"], "sensor"), ""],
    ["Neste start", findEntity(["next start time", "neste start"], "sensor"), ""]
  ];

  $("#statusGrid").innerHTML = items.map(([label, entity, suffix]) => {
    const value = entity ? formatState(entity, suffix) : "—";
    return `
      <article class="stat-card">
        <div class="stat-label">${escapeHtml(label)}</div>
        <div class="stat-value">${escapeHtml(value)}</div>
        <div class="stat-sub">${entity ? escapeHtml(cleanName(entity)) : "Ikke tilgjengelig"}</div>
      </article>`;
  }).join("");
}

function renderQuickControls() {
  const priorities = [
    "park until further notice",
    "spot cut",
    "sensorcontrol",
    "manual mowing duration",
    "eco mode",
    "frost sensor"
  ];

  const picks = [];
  for (const needle of priorities) {
    const match = state.controls.find((entity) => entityText(entity).includes(needle));
    if (match && !picks.includes(match)) picks.push(match);
  }
  state.controls.forEach((entity) => {
    if (picks.length < 6 && !picks.includes(entity)) picks.push(entity);
  });

  renderEntityCards($("#quickEntityGrid"), picks);
}

function renderControls() {
  $("#controlCount").textContent = String(state.controls.length);
  renderEntityCards($("#controlGrid"), state.controls);
}

function renderEntityCards(container, entities) {
  if (!container) return;
  if (!entities.length) {
    container.innerHTML = '<div class="schedule-empty"><p>Ingen ekstra kontroller funnet ennå.</p></div>';
    return;
  }

  container.innerHTML = entities.map((entity) => entityCard(entity)).join("");
  bindEntityControls(container);
}

function entityCard(entity) {
  const domain = domainOf(entity);
  const id = escapeAttr(entity.entity_id);
  const name = escapeHtml(cleanName(entity));

  let control = `<div class="entity-value">${escapeHtml(formatState(entity))}</div>`;

  if (domain === "switch") {
    const on = entity.state === "on";
    control = `<button class="switch ${on ? "on" : ""}" data-switch="${id}" data-current="${on ? "on" : "off"}" aria-label="Slå ${name} ${on ? "av" : "på"}"></button>`;
  }

  if (domain === "number") {
    const value = parseFloat(entity.state);
    const min = finiteOr(entity.attributes?.min, 0);
    const max = finiteOr(entity.attributes?.max, 100);
    const step = finiteOr(entity.attributes?.step, 1);
    control = `
      <div class="number-control">
        <button data-number="${id}" data-value="${value - step}" data-min="${min}" data-max="${max}">−</button>
        <div class="number-value">${escapeHtml(formatState(entity))}</div>
        <button data-number="${id}" data-value="${value + step}" data-min="${min}" data-max="${max}">+</button>
      </div>`;
  }

  if (domain === "select") {
    const options = Array.isArray(entity.attributes?.options) ? entity.attributes.options : [];
    control = `
      <select class="select-control" data-select="${id}">
        ${options.map((option) => `<option value="${escapeAttr(option)}" ${String(option) === entity.state ? "selected" : ""}>${escapeHtml(translateOption(option))}</option>`).join("")}
      </select>`;
  }

  if (domain === "button") {
    control = `<button class="button-control" data-button="${id}">Kjør kommando</button>`;
  }

  return `
    <article class="entity-card">
      <div class="entity-head">
        <div>
          <div class="entity-title">${name}</div>
          <div class="entity-domain">${escapeHtml(DOMAIN_NO[domain] || domain)}</div>
        </div>
        ${domain === "switch" ? control : ""}
      </div>
      ${domain === "switch" ? "" : control}
    </article>`;
}

function bindEntityControls(root) {
  root.querySelectorAll("[data-switch]").forEach((button) => {
    button.addEventListener("click", async () => {
      const service = button.dataset.current === "on" ? "turn_off" : "turn_on";
      await callService("switch", service, button.dataset.switch);
    });
  });

  root.querySelectorAll("[data-number]").forEach((button) => {
    button.addEventListener("click", async () => {
      const min = Number(button.dataset.min);
      const max = Number(button.dataset.max);
      const value = Math.min(max, Math.max(min, Number(button.dataset.value)));
      await callService("number", "set_value", button.dataset.number, { value });
    });
  });

  root.querySelectorAll("[data-select]").forEach((select) => {
    select.addEventListener("change", () => callService("select", "select_option", select.dataset.select, { option: select.value }));
  });

  root.querySelectorAll("[data-button]").forEach((button) => {
    button.addEventListener("click", () => callService("button", "press", button.dataset.button));
  });
}

function renderDiagnostics() {
  const list = $("#diagnosticsList");
  if (!state.diagnostics.length) {
    list.innerHTML = '<div class="schedule-empty"><p>Ingen diagnostikksensorer funnet.</p></div>';
    return;
  }

  const sorted = [...state.diagnostics].sort((a, b) => cleanName(a).localeCompare(cleanName(b), "nb"));
  list.innerHTML = sorted.map((entity) => `
    <div class="sensor-row">
      <div>
        <div class="sensor-name">${escapeHtml(cleanName(entity))}</div>
        <div class="sensor-id">${escapeHtml(entity.entity_id)}</div>
      </div>
      <div class="sensor-reading">${escapeHtml(formatState(entity))}</div>
    </div>`).join("");
}

async function renderSchedule() {
  const container = $("#scheduleContent");
  if (!state.calendar) {
    container.className = "schedule-empty";
    container.innerHTML = '<div class="schedule-icon">◷</div><h4>Ingen kalender funnet</h4><p>Rolfens ukeplan blir synlig her når Gardena-integrasjonen eksponerer kalenderen med et Rolfen/Gardena/SILENO-navn.</p>';
    return;
  }

  container.className = "";
  container.innerHTML = `<div class="calendar-card"><strong>${escapeHtml(cleanName(state.calendar))}</strong><span>Henter de neste 7 dagene…</span></div>`;

  try {
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const url = `${API}?action=calendar&entity=${encodeURIComponent(state.calendar.entity_id)}&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
    const response = await fetch(url, { cache: "no-store" });
    const events = response.ok ? await response.json() : [];

    if (!Array.isArray(events) || !events.length) {
      container.innerHTML = `<div class="calendar-card"><strong>${escapeHtml(cleanName(state.calendar))}</strong><span>Ingen planlagte klippeøkter de neste 7 dagene.</span></div>`;
      return;
    }

    container.innerHTML = events.map((event) => {
      const startText = formatDateTime(event.start?.dateTime || event.start?.date);
      const endText = formatDateTime(event.end?.dateTime || event.end?.date);
      const summary = String(event.summary || "").toLowerCase() === "mowing schedule" ? "Klippeøkt" : (event.summary || "Klippeøkt");
      return `<div class="calendar-card"><strong>${escapeHtml(summary)}</strong><span>${escapeHtml(startText)} – ${escapeHtml(endText)}</span></div>`;
    }).join('<div style="height:8px"></div>');
  } catch {
    container.innerHTML = `<div class="calendar-card"><strong>${escapeHtml(cleanName(state.calendar))}</strong><span>Kalenderen finnes, men hendelser kunne ikke hentes akkurat nå.</span></div>`;
  }
}

async function mowerAction(service) {
  if (!state.mower) return showToast("Fant ikke robotklipper-entiteten for Rolfen.", true);
  await callService("lawn_mower", service, state.mower.entity_id);
}

async function pressDiagnosticRefresh() {
  const button = state.controls.find((entity) => domainOf(entity) === "button" && entityText(entity).includes("diagnostic refresh"));
  if (!button) return showToast("Oppdater diagnostikk er ikke tilgjengelig på Rolfen.", true);
  await callService("button", "press", button.entity_id);
}

async function callService(domain, service, entityId, data = {}) {
  if (state.busy) return;
  state.busy = true;
  renderHero();

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, service, entity_id: entityId, data })
    });

    const result = await response.json().catch(() => ({}));
    if (response.status === 401) {
      showAuth();
      throw new Error("Sesjonen er utløpt. Logg inn igjen.");
    }
    if (!response.ok) throw new Error(result.error || `${domain}.${service} feilet`);

    showToast(serviceMessage(service));
    window.setTimeout(() => refresh(), 750);
  } catch (error) {
    showToast(error.message || "Kommandoen feilet", true);
  } finally {
    state.busy = false;
    renderHero();
  }
}

function currentMowerError() {
  const codeEntity = findEntity(["error code", "feilkode"], "sensor");
  const descriptionEntity = findEntity(["error description", "feilbeskrivelse"], "sensor");
  const code = codeEntity ? Number(codeEntity.state) : null;
  const rawDescription = descriptionEntity?.state;
  const description = rawDescription && !["unknown", "unavailable", "none", "no error"].includes(String(rawDescription).toLowerCase())
    ? translateValue(rawDescription)
    : "";

  // Gardena may retain the previous error code after the mower has recovered.
  // Only present it as an active error while the mower itself is still in an
  // error/stopped/restricted state. Fresh activity such as mowing, charging,
  // returning or parked means the old code is historical/stale.
  const activity = String(findEntity(["activity", "aktivitet"], "sensor")?.state || "").toLowerCase();
  const detailedState = String(findEntity(["state", "status"], "sensor")?.state || "").toLowerCase();
  const mowerState = String(state.mower?.state || "").toLowerCase();
  const recoveredActivity = ["mowing", "cutting", "charging", "going_home", "going home", "returning", "parked"]
    .some((value) => activity.includes(value) || mowerState.includes(value));
  const errorState = ["error", "problem", "stopped", "restricted"]
    .some((value) => detailedState.includes(value) || mowerState.includes(value));
  const reportedError = (Number.isFinite(code) && code > 0) || Boolean(description);
  const active = reportedError && (errorState || !recoveredActivity);

  return {
    active,
    code: Number.isFinite(code) ? code : null,
    description: description || (Number.isFinite(code) && code > 0 ? "Klipperen rapporterer en feil" : "")
  };
}

function findEntity(needles, domain) {
  const normalized = needles.map((item) => item.toLowerCase());
  return state.related.find((entity) => {
    if (domain && domainOf(entity) !== domain) return false;
    const text = entityText(entity);
    return normalized.some((needle) => text.includes(needle));
  }) || null;
}

function entityText(entity) {
  return `${entity.entity_id} ${friendly(entity)}`.toLowerCase();
}

function domainOf(entity) {
  return String(entity?.entity_id || "").split(".")[0];
}

function friendly(entity) {
  return String(entity?.attributes?.friendly_name || entity?.entity_id || "");
}

function cleanName(entity) {
  let name = friendly(entity)
    .replace(/^Rolfen\s*/i, "")
    .replace(/^Gardena\s*/i, "")
    .replace(/^SILENO Minimo\s*/i, "")
    .trim();

  name = name || friendly(entity);
  return translateEntityName(name);
}

function formatState(entity, forcedSuffix = "") {
  if (!entity) return "—";
  const raw = String(entity.state);

  if (entity.attributes?.device_class === "timestamp") {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("nb-NO", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
  }

  if (["unknown", "unavailable", "none"].includes(raw.toLowerCase())) return translateValue(raw);

  const unit = forcedSuffix || entity.attributes?.unit_of_measurement || "";
  if (!unit) return translateValue(raw);

  const numeric = Number(raw);
  const rendered = Number.isFinite(numeric) ? trimNumber(numeric) : translateValue(raw);
  return `${rendered}${unit === "%" ? "" : " "}${unit}`;
}

function heroTitle(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("going home") || text.includes("going_home") || text.includes("search")) return "Rolfen er på vei hjem";
  if (text.includes("mow") || text.includes("cut")) return "Rolfen er ute på jobb";
  if (text.includes("charg")) return "Rolfen lader opp";
  if (text.includes("dock") || text.includes("park")) return "Rolfen er parkert";
  if (text.includes("error")) return "Rolfen trenger litt hjelp";
  if (text.includes("pause")) return "Rolfen tar en pause";
  if (text.includes("stop")) return "Rolfen står klar";
  if (text.includes("unavailable")) return "Rolfen er utilgjengelig";
  return "Rolfen er klar";
}

function statusSentence(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("error")) return "En feil er rapportert av klipperen. Sjekk diagnostikk.";
  if (text.includes("charg")) return "Batteriet fylles opp før neste økt.";
  if (text.includes("mow") || text.includes("cut")) return "Klipper plenen og følger aktiv plan.";
  if (text.includes("dock") || text.includes("park")) return "Trygt parkert ved ladestasjonen.";
  if (text.includes("stop")) return "Stoppet og venter på neste kommando.";
  return `Status: ${humanize(value)}`;
}

function serviceMessage(service) {
  const labels = {
    start_mowing: "Rolfen starter",
    pause: "Rolfen pauses",
    dock: "Rolfen sendes hjem",
    turn_on: "Slått på",
    turn_off: "Slått av",
    set_value: "Verdi oppdatert",
    select_option: "Valg oppdatert",
    press: "Kommando sendt"
  };
  return labels[service] || "Kommando sendt";
}

function setConnection(ok, text) {
  $("#connectionText").textContent = text;
  $(".live-dot").style.background = ok ? "#82df9b" : "#ef8d7b";
}

function spinRefresh(on) {
  const icon = $("#refreshBtn svg");
  if (!icon) return;
  icon.style.transition = "transform .5s ease";
  icon.style.transform = on ? "rotate(180deg)" : "";
}

let toastTimer;
function showToast(message, error = false) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.toggle("error", error);
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function humanize(value) {
  if (value == null || value === "") return "—";
  return translateValue(value);
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("nb-NO", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function finiteOr(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return NaN;
  return Math.min(max, Math.max(min, value));
}

function trimNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}