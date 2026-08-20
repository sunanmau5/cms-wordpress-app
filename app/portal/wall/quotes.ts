// PROTOTYPE — throwaway. The five seeded quotes, FR + EN.

export type Quote = {
  en: { text: string; by: string };
  fr: { text: string; by: string };
};

export const QUOTES: Quote[] = [
  {
    en: {
      text: "Autiste Redding",
      by: "My father — a clever play on words blending music knowledge and my position on the autism spectrum",
    },
    fr: {
      text: "Autiste Redding",
      by: "Mon père — un jeu de mots intelligent mêlant culture musicale et ma position sur le spectre de l'autisme",
    },
  },
  {
    en: {
      text: "You're not crazy — you're special",
      by: "My mom, reassuring me that everything's absolutely fine with me",
    },
    fr: {
      text: "Tu n'es pas folle, tu es spéciale",
      by: "Ma mère, pour me rassurer que tout va parfaitement bien chez moi",
    },
  },
  {
    en: {
      text: "Don't worry, I was a goth too",
      by: "A stranger in a Parisian bar, commenting on my nonchalance",
    },
    fr: {
      text: "T'inquiète pas, moi aussi j'ai été gothique",
      by: "Une inconnue dans un bar parisien, à propos de ma nonchalance",
    },
  },
  {
    en: {
      text: "I don't have a lot to say",
      by: "G. de Cockborne, during his tenure as my manager",
    },
    fr: {
      text: "J'ai pas grand chose à dire",
      by: "G. de Cockborne, au cours de l'exercice de ses fonctions en tant que mon supérieur hiérarchique",
    },
  },
  {
    en: {
      text: "And here's Linda from customer support",
      by: "Someone who knows neither my name nor my job title",
    },
    fr: {
      text: "Et ça c'est Linda du service client",
      by: "Quelqu'un qui ne connaît ni mon nom ni mon titre",
    },
  },
];

// a few pretend guest messages, so the layouts can be judged when fuller
export const GUEST_MESSAGES: Quote[] = [
  {
    en: { text: "Happy birthday you absolute legend", by: "Camille" },
    fr: { text: "Joyeux anniversaire, légende absolue", by: "Camille" },
  },
  {
    en: { text: "Still owes me a coffee since 2019", by: "Thomas" },
    fr: { text: "Me doit toujours un café depuis 2019", by: "Thomas" },
  },
  {
    en: {
      text: "The only person I know who can argue with a parking meter and win",
      by: "Sarah",
    },
    fr: {
      text: "La seule personne que je connaisse capable de se disputer avec un horodateur et de gagner",
      by: "Sarah",
    },
  },
  {
    en: { text: "Thirty and still the loudest laugh in any room", by: "Léa" },
    fr: {
      text: "Trente ans et toujours le rire le plus fort de la pièce",
      by: "Léa",
    },
  },
  {
    en: {
      text: "Has never once arrived on time. Worth the wait.",
      by: "Julien",
    },
    fr: {
      text: "N'est jamais arrivée à l'heure. Ça vaut l'attente.",
      by: "Julien",
    },
  },
  {
    en: { text: "My favourite person to be unreasonable with", by: "Inès" },
    fr: { text: "Ma personne préférée pour être déraisonnable", by: "Inès" },
  },
  {
    en: { text: "Once explained techno to me for four hours", by: "Marc" },
    fr: { text: "M'a expliqué la techno pendant quatre heures", by: "Marc" },
  },
  {
    en: { text: "Happy birthday to my emergency contact", by: "Chloé" },
    fr: { text: "Joyeux anniversaire à mon contact d'urgence", by: "Chloé" },
  },
];
