# 07 — Screens 4 & 5: the RSVP question, the form, and the "no" path

Type: grilling
Status: resolved
Blocked by: 01

## Question

The reason the site exists. Decide it precisely.

- The yes/no screen: copy, and whether "no" is escapable back to "yes".
- The form fields. Working assumption from grilling: name, contact (email or phone), **which dates work — checkboxes, "all that apply", 28 Aug and 4 Sept**, dietary restrictions, plus-one. Confirm, and settle what is required versus optional.
- Validation and error copy, in both languages.
- What the guest sees after submitting, and whether they can change their answer later.
- The "no" path: "Sad to see you're absent" — what else that screen offers (the activities?).
- Exactly which columns land in the RSVP sheet tab (provisional set from [04](04-storage-setup.md): `when, name, contact, dates, diet, plus_one, message`), and what the Resend notification email says.
- **Carried from [05](05-screen-disco-ball.md)**: the form needs its own unadvertised URL so the user can send it directly when chasing non-repliers.

## Answer

### Party facts (changed during this ticket)
- **Dates are now Sat 5 Sept and Sat 12 Sept 2026** — previously 28 Aug / 4 Sept. Map updated.
- **Evening: dinner and drinks.**
- **No venue on the site.** The restaurant depends on headcount, so the yes/no screen says the venue follows once numbers are in — turning the gap into a reason to reply. Details go out privately to confirmed guests.

### The yes/no screen
Both dates, "evening — dinner and drinks", venue-to-follow line, two buttons.

### The form (yes path) — four fields
| Field | Required | Notes |
|---|---|---|
| Name | ✅ | |
| Which dates work | ✅ at least one | Three checkboxes: **5 Sept**, **12 Sept**, **"I can't make either of these"** — the third exists so a friend who wants to come but can't feels asked rather than excluded, and it tells the user if both dates are wrong |
| Dietary restrictions | — | free text |
| A message for me | — | free text |

**No contact field** — the user has everyone's phone number. **No plus-one field** — folds into the message.

### After submitting
Confirmation **showing back what they chose** (kills "did that send?" anxiety), then the activities. **No edit flow** — a change of mind is a text message and a ten-second fix in the sheet.

### Duplicate submissions
Both rows land; **newest row per name wins** when reading the sheet. If the browser remembers a previous reply, the form opens with "you already replied — sending again replaces it". Deliberately *not* live name-matching against the sheet: it would mean a lookup per keystroke and would misfire on two guests with the same first name.

### The "no" path
"Sad to see you're absent" + an **optional name field** — a row is written only if filled in, so the sheet distinguishes *declined* from *never opened the link* · the activities list · a quiet **"actually, I can come"** link back to the form, because people misclick and plans change.

### Sheet columns (changed)
`rsvps` becomes **`when | response | name | dates | diet | message`** — drop `contact` and `plus_one`, add `response` (yes/no) as column B. **Manual edit needed in the sheet.**

### Notifications
**None.** No Resend email per RSVP — everything lives in the sheet and the user checks it there. **This removes Resend from the microsite entirely.**

### Direct link
The form has its own URL, **`/portal/en/rsvp`** and `/portal/fr/rsvp`, never linked from the site — for chasing non-repliers (carried from [05](05-screen-disco-ball.md)).
