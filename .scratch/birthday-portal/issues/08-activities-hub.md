# 08 — The activities hub

Type: grilling
Status: resolved
Blocked by: 07

## Question

How the six activities are presented and reached.

- Footer, or a dedicated screen? "Here are some fun activities for you" — final copy and framing.
- The order the activities appear in, and how each is teased.
- Whether the hub is reachable before RSVPing, and whether the "no" path sees the same list.
- Navigation: does a guest get back to the hub from inside an activity, and does the site remember where they were?
- **Carried from [05](05-screen-disco-ball.md)**: "restart the disco game" is one of the entries in this list.

## Answer

### The hub is called **RINA-LAND**
Reached from the RSVP confirmation *and* from the "absent" screen — **the same six activities for everyone, nothing gated**. Guests who can't come are the most likely to play; cutting the fun from them would be the wrong call.

### Structure
1. Lead-in sentence
2. **RINA-LAND** (chrome-styled) — "Visit Rina-Land" as the entry from the RSVP screens
3. The six activities, each a **chrome title plus a one-line tease**. No icons — six more assets to make, and the teases carry the personality.
4. A scrolling **Save-the-date marquee** at the bottom

Plus a slim link back to Rina-Land from **inside every activity**. No footer under the disco-ball or joke screens — those stay clean.

### Copy (user's own, verbatim)

**Lead-in**
- EN: *Just so you don't get bored meanwhile: Try one (or more!) of the activities I've prepared for you! 🎡*
- FR: *Pour ne pas t'ennuyer en attendant : Essaye l'une (ou plusieurs !) des activités hilarantes que j'ai préparées pour toi ! 🎡*

**The six, in order**

| # | EN | FR | Ticket |
|---|---|---|---|
| 1 | **Rina-Quiz** — Test your knowledge in 10 questions | **Rina-Quiz** : Teste tes connaissances en 10 questions | [11](11-quiz.md) |
| 2 | **Birthday Fit** — Pick my birthday outfit | **Birthday Fit** : Choisis ma tenue d'anniversaire | [12](12-accessories.md) |
| 3 | **Wheel of fortune** — Spin it to win a prize | **La roue de la fortune** : Fais-la tourner pour gagner un prix | [13](13-wheel-of-fortune.md) |
| 4 | **Photo gallery** — The best of three decades, in images | **Galerie de photos** : Le meilleur de ces trois décennies, en images | [10](10-photo-gallery.md) |
| 5 | **What they say about me** — A collection of testimonials, leave yours too! | **Témoignages** : Un florilège de citations — Laisse la tienne ! | [09](09-quote-wall.md) |
| 6 | **Disco Tap** — Play the best game of the year again! | **Disco Tap** : Rejoue au meilleur jeu de l'année ! | [05](05-screen-disco-ball.md) |

Activity *names* stay English in the French version — "Rina-Quiz", "Birthday Fit", "Disco Tap" — consistent with the hero title. Deliberate: "fit" as slang doesn't translate.

### Save-the-date marquee
Full width at the bottom, transparent background, chrome text, scrolling right-to-left on a continuous loop, repeated with a ✦ separator so it never leaves a gap. **~25s per pass** — fast marquees read as spam. Not clickable, doesn't pause on hover. **Static text under `prefers-reduced-motion`**, consistent with [05](05-screen-disco-ball.md).

- EN: *Save The Date: Sept. 5 or 12 — More details coming soon!*
- FR: *Save The Date : Le 5 ou 12 septembre — Plus d'informations à venir !*

### Consequence for other tickets
The quiz tease promises **10 questions** — that is now a commitment [11](11-quiz.md) must honour.
