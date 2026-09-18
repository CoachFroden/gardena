# Rolfen

En installérbar iPhone/PWA for Gardena SILENO minimo ("Rolfen") via Home Assistant.

## Hva appen gjør

- Mobiltilpasset kontrollflate med robotklipper-/hage-tema og sommerfuglbusker.
- Start, pause og parkering.
- Dynamisk støtte for alle Gardena Mower BLE-entiteter som Home Assistant eksponerer:
  - Park Until Further Notice
  - Spot Cut
  - SensorControl
  - Frost Sensor / Eco Mode / Avoid Garage når tilgjengelig
  - Manuell klippetid
  - Drive Past Wire
  - Startpunkter, avstander, mowing share, wire og CorridorCut
  - Select-, number-, switch- og button-entiteter
  - Batteri, aktivitet, state, feilkoder og diagnostikksensorer
- Ukeplan/kalender når integrasjonen eksponerer en calendar-entitet.
- PWA med eget Rolfen-ikon for iPhone-hjemskjermen.
- Automatisk oppdatering hvert 15. sekund.

## Sikkerhet

Home Assistant-tokenet ligger kun på Vercel-serveren og sendes aldri til nettleseren.

Appen krever i tillegg en egen `APP_PIN`. Etter innlogging får iPhone en HttpOnly/Secure-cookie i 30 dager. Backend tillater bare et avgrenset sett med Home Assistant-tjenester, og bare mot Rolfen/Gardena/SILENO-entiteter.

## Vercel-miljøvariabler

Sett disse i **Vercel → Project Settings → Environment Variables**:

- `HA_URL` – Home Assistant-adressen som Vercel kan nå, typisk Nabu Casa-adressen.
- `HA_TOKEN` – Home Assistant Long-Lived Access Token.
- `APP_PIN` – en egen kode du velger for å åpne Rolfen-appen.
- `APP_SESSION_SECRET` – valgfri lang tilfeldig streng. Hvis den mangler brukes HA-tokenet som signeringsnøkkel.

Etter at variablene er satt: **Redeploy** prosjektet.

## iPhone

Åpne appen i Safari → Del → **Legg til på Hjem-skjermen**.

Appen bruker `icon-180.png` som iPhone-ikon og kjører som en standalone PWA.

## Arkitektur

- Frontend: ren HTML/CSS/JavaScript.
- Backend: Vercel serverless proxy (`api/ha.js`) mot Home Assistant REST API.
- Ingen mower-PIN, mower-MAC eller Home Assistant-token ligger i repoet.
