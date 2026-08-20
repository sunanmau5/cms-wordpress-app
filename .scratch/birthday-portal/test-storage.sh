#!/usr/bin/env bash
# Re-test the storage webhook on its own, without redoing the whole wizard.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

URL=$(grep '^GOOGLE_SHEET_WEBHOOK_URL=' .env.local | cut -d= -f2- || true)
TOKEN=$(grep '^GOOGLE_SHEET_TOKEN=' .env.local | cut -d= -f2- || true)

if [[ -z "$URL" ]]; then
  echo "✗ GOOGLE_SHEET_WEBHOOK_URL is empty in .env.local"
  echo "  Get it from Apps Script: Deploy → Manage deployments → copy the Web app URL (ends /exec)"
  echo "  Then either re-run setup-storage.sh, or paste it into .env.local yourself."
  exit 1
fi

echo "→ POSTing a test wall message to ${URL:0:52}…"
RESPONSE=$(curl -sS -L "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\",\"kind\":\"wall\",\"name\":\"Wizard test\",\"message\":\"Storage works.\"}" 2>&1 || true)

echo "← $RESPONSE"
echo

if grep -q '"ok":true' <<<"$RESPONSE"; then
  echo "✓ write accepted — check the 'wall' tab for a 'Wizard test' row, then delete it."
elif grep -q 'bad token' <<<"$RESPONSE"; then
  echo "✗ token mismatch — line 12 of Code.gs must match GOOGLE_SHEET_TOKEN in .env.local,"
  echo "  and you must redeploy after editing (Deploy → Manage deployments → edit → Deploy)."
elif grep -qi '<!doctype\|<html' <<<"$RESPONSE"; then
  echo "✗ Google returned a login/error page, not your script. Usually one of:"
  echo "  - 'Who has access' isn't set to Anyone"
  echo "  - you copied the /dev URL instead of /exec"
else
  echo "✗ unexpected response — see above."
fi
