# 16 — Republish Apps Script for instant wall messages

Type: task (HITL)
Status: resolved
Blocked by: —

## Question

[09](09-quote-wall.md) dropped the approval step, so `.scratch/birthday-portal/apps-script/Code.gs` was changed:

- `doPost` writes wall rows with `approved = YES` (was `NO`)
- `doGet` returns every row **except** those whose `approved` cell says `NO`

The live deployment still runs the old code. Paste the updated file into the Apps Script editor and redeploy with **Deploy → Manage deployments → pencil → Version: New version → Deploy** — saving alone does not republish (see [15](15-sheet-columns.md)).

Resolution records a test message appearing through `/api/rinaverse` without any cell being flipped by hand.

## Answer

Republished. Verified end to end: a message POSTed through `/api/rinaverse` came straight back from `doGet` with **no cell flipped by hand**.

The `approved` column has inverted meaning now — it is a **kill switch**, not a gate. Type `NO` in it (or delete the row) to pull a message off the wall; anything else, including blank, is live.

Test rows to delete from the `wall` tab: "Wizard test" and "Ticket 16".
