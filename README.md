# Rolfen

En installérbar iPhone/PWA for Gardena SILENO minimo ("Rolfen") via Home Assistant.

## Arkitektur

- Frontend: ren HTML/CSS/JavaScript, optimalisert for iPhone.
- Backend: Vercel serverless proxy mot Home Assistant.
- Ingen Home Assistant-token legges i kildekoden eller sendes til nettleseren.
- Appen oppdager automatisk Rolfen/Gardena/SILENO-entiteter og viser tilgjengelige kontroller.

## Vercel-miljøvariabler

Sett disse i Vercel → Project Settings → Environment Variables:

- `HA_URL` – Home Assistant-adressen som Vercel kan nå (for eksempel Nabu Casa URL).
- `HA_TOKEN` – et Home Assistant Long-Lived Access Token.

Deploy deretter repoet på nytt.

## iPhone

Åpne appen i Safari → Del → **Legg til på Hjem-skjermen**. Appen har eget Rolfen-ikon og kjører som PWA.

## Støttede kontroller

Appen viser dynamisk det Gardena Mower BLE-integrasjonen eksponerer, inkludert:

- Start / pause / parkering
- Park Until Further Notice
- Spot Cut
- SensorControl
- Frost Sensor / Eco Mode / Avoid Garage når tilgjengelig
- Manuell klippetid
- Drive Past Wire
- Startpunkter, avstander, mowing share, wire og CorridorCut
- Select-entiteter
- Diagnostikk-knapper
- Batteri, aktivitet, state, feilkoder og diagnostikksensorer

Kalender/tidsplan vises når integrasjonen eksponerer en calendar-entitet.

## Sikkerhet

Repoet inneholder ingen PIN, mower-MAC eller Home Assistant-token. Hold `HA_TOKEN` kun som Vercel secret/environment variable.
