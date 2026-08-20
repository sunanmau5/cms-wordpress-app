/**
 * Rinaverse — storage webhook.
 *
 * Receives RSVP submissions and wall messages from the Next.js app and appends
 * them to this spreadsheet. Also serves back the wall messages you've approved.
 *
 * Paste this whole file into the Apps Script editor (Extensions → Apps Script),
 * replacing everything that's already there.
 */

// The wizard generated this for you — paste the token it printed here.
const TOKEN = "PASTE_TOKEN_HERE";

/** Writes: RSVPs and wall messages. Requires the token. */
function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "bad json" });
  }

  if (body.token !== TOKEN) {
    return json({ ok: false, error: "bad token" });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // columns: when | response | name | dates | diet | message
  if (body.kind === "rsvp") {
    ss.getSheetByName("rsvps").appendRow([
      new Date(),
      body.response || "yes", // "no" rows come from the declined path
      body.name || "",
      (body.dates || []).join(", "),
      body.diet || "",
      body.message || "",
    ]);
    return json({ ok: true });
  }

  if (body.kind === "wall") {
    ss.getSheetByName("wall").appendRow([
      new Date(),
      body.name || "",
      body.message || "",
      "YES", // messages publish immediately; type NO here (or delete the row) to pull one
    ]);
    return json({ ok: true });
  }

  return json({ ok: false, error: "unknown kind" });
}

/**
 * Reads: the wall messages. Everything is live by default; a row is hidden only
 * if its "approved" cell says NO. No token — this returns content that is
 * already public on the site.
 */
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("wall");
  var rows = sheet.getDataRange().getValues().slice(1);

  var messages = rows
    .filter(function (r) {
      return String(r[3]).trim().toUpperCase() !== "NO";
    })
    .map(function (r) {
      return { date: r[0], name: r[1], message: r[2] };
    });

  return json({ ok: true, messages: messages });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
