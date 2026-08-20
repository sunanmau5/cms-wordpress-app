# 15 — Update the RSVP sheet columns

Type: task (HITL)
Status: resolved
Blocked by: —

## Question

[07](07-rsvp-flow.md) changed the RSVP fields, so the `rsvps` tab's header row no longer matches what the site will send.

In the **Rinaverse** spreadsheet, `rsvps` tab, row 1 should read exactly:

    when | response | name | dates | diet | message

That means: delete the `contact` and `plus_one` columns, and insert `response` as column B.

Resolution records that the sheet matches, and a test write through `/api/rinaverse` lands in the right columns.

## Progress

- User has updated the sheet's header row ✅
- `Code.gs` updated to write the new column order — **needs re-pasting into Apps Script and redeploying**
- Pending: a test RSVP through `/api/rinaverse` landing in the right columns

## Answer

`rsvps` row 1 is now `when | response | name | dates | diet | message`, and `Code.gs`'s `doPost` writes that order. Verified with two test rows through `/api/rinaverse` — a `yes` with dates/diet/message and a `no` with only a name — both landing in the right columns.

**Gotcha, recorded because it cost a round trip:** in Apps Script, neither saving nor re-deploying an existing deployment republishes your code. You must use **Deploy → Manage deployments → pencil → Version: New version → Deploy**. Symptom of missing it: writes succeed with `{"ok":true}` while the *old* code runs, so rows land shifted into the wrong columns.
