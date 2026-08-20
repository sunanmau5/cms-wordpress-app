// PROTOTYPE — fortune-cookie messages for the corner cookie on the hub.
// Traditional-style one-liners, my own phrasing, FR + EN. A couple wink at the
// party's running gags (the broom, the cake). Edit freely — one object per
// fortune, picked at random each time the cookie is cracked open.

export type Fortune = { fr: string; en: string };

export const FORTUNES: Fortune[] = [
  { en: "A pleasant surprise is waiting for you.", fr: "Une belle surprise t'attend." },
  { en: "The best is yet to come.", fr: "Le meilleur reste à venir." },
  { en: "Your smile will light up someone's whole day.", fr: "Ton sourire illuminera la journée de quelqu'un." },
  { en: "Fortune favours the bold.", fr: "La fortune sourit aux audacieux." },
  { en: "An old friend will think of you very soon.", fr: "Un vieil ami pensera bientôt à toi." },
  { en: "Good things come to those who dance.", fr: "Les bonnes choses arrivent à qui sait danser." },
  { en: "Today is a good day to try something new.", fr: "Aujourd'hui est un bon jour pour tenter quelque chose de nouveau." },
  { en: "Happiness is only a broom away.", fr: "Le bonheur n'est qu'à un coup de balai." },
  { en: "A dream you keep close will come true.", fr: "Un rêve qui te tient à cœur se réalisera." },
  { en: "Laughter is the music of the soul.", fr: "Le rire est la musique de l'âme." },
  { en: "A second slice of cake is, in fact, a wise choice.", fr: "Une deuxième part de gâteau est, en vérité, un choix sage." },
  { en: "Adventure is already on its way to you.", fr: "L'aventure est déjà en route vers toi." },
  { en: "Someone is thinking of how lucky they are to know you.", fr: "Quelqu'un se dit en ce moment quelle chance de te connaître." },
  { en: "Trust the timing of your life.", fr: "Fais confiance au tempo de ta vie." },
  { en: "You will find great joy in small things.", fr: "Tu trouveras une grande joie dans les petites choses." },
  { en: "The night you're about to have will be unforgettable.", fr: "La soirée qui t'attend sera inoubliable." },
  { en: "Your kindness will come back to you three times over.", fr: "Ta gentillesse te reviendra au triple." },
  { en: "You are exactly where you need to be.", fr: "Tu es exactement là où tu dois être." },
];
