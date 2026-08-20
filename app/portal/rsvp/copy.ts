// PROTOTYPE — throwaway. Screens 4 & 5 copy.
// Titles, the Rina-Land banner and the no-path wording are the user's own words.

export const DATES = [
  { key: "5", fr: "Samedi 5 septembre", en: "Saturday 5 September" },
  { key: "12", fr: "Samedi 12 septembre", en: "Saturday 12 September" },
  {
    key: "neither",
    fr: "Aucune des deux ne me va",
    en: "I can't make either of these",
  },
] as const;

export const COPY = {
  fr: {
    // the yes/no screen
    askTitle: "Tu viens fêter mes 30 ans avec moi ?",
    askWhen: "Samedi 5 ou samedi 12 septembre 2026",
    askEvening: "En soirée — dîner et boissons",
    askVenue: "Le lieu arrive bientôt — dès que je sais combien nous sommes !",
    yes: "Oui, I'm in !",
    no: "Je ne peux pas",

    // the form
    formTitle: "Génial ! Voici ton formulaire d'invitation",
    name: "Ton prénom",
    namePlaceholder: "Guillaume de Coco",
    dates: "Quelles dates te vont ?",
    datesHint: "Coche tout ce qui te convient",
    diet: "Allergies, régime, ce que tu ne manges pas",
    dietHint: "Facultatif",
    dietPlaceholder: "Je suis difficile aussi - sois pas timide !",
    message: "Un mot pour moi",
    messageHint: "Facultatif",
    messagePlaceholder:
      "Ne me surprends pas avec un +1 (ou plus...) - Fais-le moi savoir dès maintenant",
    send: "Envoyer",
    sending: "Envoi…",

    errName: "Il me faut au moins ton prénom !",
    errDates: "Coche au moins une case.",
    errSend: "Ça n'est pas parti. Réessaie dans un instant.",

    already:
      "Tu as déjà répondu — si tu renvoies ce formulaire, ta nouvelle réponse remplacera l'ancienne.",

    // confirmation
    sentTitle: "Merci pour ta réponse !",
    // FR is my wording — overwrite it
    sentSub: "Je t'envoie tous les détails dès qu'une table est réservée !",
    sentName: "Prénom",
    sentDates: "Dates",
    sentDiet: "À table",
    sentMessage: "Ton mot",
    sentNothing: "—",

    // the no path
    noTitle: "Très triste de ne pas t'avoir à la table ce soir-là !",
    noBody:
      "Laisse-moi ton prénom et je saurai que tu as vu l'invitation. Sinon, aucun souci.",
    noName: "Ton prénom",
    noNamePlaceholder: "Pierre Fregonas",
    noSend: "Envoyer",
    noSentTitle: "Merci de me l'avoir dit !",
    noSentBody:
      "Même si tu ne peux pas venir dîner avec nous, tu peux tout de même visiter Rina-Land pour jouer aux activités hilarantes que j'ai préparées !",
    backToYes: "En fait, je peux venir",

    // the Rina-Land banner
    bannerIntro:
      "Pour ne pas t'ennuyer en attendant : Essaye l'une (ou plusieurs!) des activités hilarantes que j'ai préparées pour toi! 🎡",
    bannerCta: "Vers Rina-Land",
  },
  en: {
    askTitle: "Will you join me for my 30th birthday?",
    askWhen: "Saturday 5 or Saturday 12 September 2026",
    askEvening: "Evening — dinner and drinks",
    askVenue: "Venue coming soon — as soon as I know how many we are!",
    yes: "Yes, I'm in!",
    no: "I can't make it",

    formTitle: "Lovely! Here's your invitation form",
    name: "Your name",
    namePlaceholder: "Guy de Coco",
    dates: "Which dates work for you?",
    datesHint: "Tick everything that works",
    diet: "Allergies, diet, anything you don't eat",
    dietHint: "Optional",
    dietPlaceholder: "I'm a picky eater too - don't be shy!",
    message: "A message for me",
    messageHint: "Optional",
    messagePlaceholder:
      "Don't surprise me with a plus-one (or more...) - Let me know now.",
    send: "Send",
    sending: "Sending…",

    errName: "I need your name at least!",
    errDates: "Tick at least one box.",
    errSend: "That didn't send. Try again in a moment.",

    already:
      "You've already replied — sending this again will replace your earlier answer.",

    sentTitle: "Thanks for your reply!",
    sentSub: "I'll send you the deets' as soon as a table's booked!",
    sentName: "Name",
    sentDates: "Dates",
    sentDiet: "At the table",
    sentMessage: "Your message",
    sentNothing: "—",

    noTitle: "So sad not to have you at the table that evening!",
    noBody:
      "Leave me your name and I'll know you saw the invitation. If not, totally cool too.",
    noName: "Your name",
    noNamePlaceholder: "Pierre Fregonas",
    noSend: "Send",
    noSentTitle: "Thanks for letting me know!",
    noSentBody:
      "Although you can't make it to the dinner, you can still visit Rina-Land to try out some of the fun activities I've prepared!",
    backToYes: "Actually, I can come",

    bannerIntro:
      "Just so you don't get bored meanwhile: Try one (or more!) of the activities I've prepared for you! 🎡",
    bannerCta: "To Rina-Land",
  },
};
