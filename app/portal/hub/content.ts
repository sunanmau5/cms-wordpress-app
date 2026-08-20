// PROTOTYPE — RINA-LAND hub. Copy is the user's own, verbatim from ticket 08.
// Activity NAMES stay English in the French version, deliberately.

export const HUB = {
  fr: {
    land: "RINA-LAND",
    lead: "Pour ne pas t'ennuyer en attendant : Essaye l'une (ou plusieurs !) des activités hilarantes que j'ai préparées pour toi ! 🎡",
    marquee: "Save The Date : Le 5 ou 12 septembre — Plus d'informations à venir !",
  },
  en: {
    land: "RINA-LAND",
    lead: "Just so you don't get bored meanwhile: Try one (or more!) of the activities I've prepared for you! 🎡",
    marquee: "Save The Date: Sept. 5 or 12 — More details coming soon!",
  },
};

export type Activity = {
  id: string;
  href: string;
  icon: "quiz" | "fit" | "wheel" | "gallery" | "quotes" | "disco";
  fr: { name: string; tease: string };
  en: { name: string; tease: string };
};

export const ACTIVITIES: Activity[] = [
  {
    id: "quiz",
    href: "/portal/quiz",
    icon: "quiz",
    fr: { name: "Rina-Quiz", tease: "Teste tes connaissances en 10 questions" },
    en: { name: "Rina-Quiz", tease: "Test your knowledge in 10 questions" },
  },
  {
    id: "fit",
    href: "/portal/fit",
    icon: "fit",
    fr: { name: "Birthday Fit", tease: "Choisis ma tenue d'anniversaire" },
    en: { name: "Birthday Fit", tease: "Pick my birthday outfit" },
  },
  {
    id: "wheel",
    href: "/portal/wheel",
    icon: "wheel",
    fr: { name: "La roue de la fortune", tease: "Fais-la tourner pour gagner un prix" },
    en: { name: "Wheel of fortune", tease: "Spin it to win a prize" },
  },
  {
    id: "gallery",
    href: "/portal/gallery",
    icon: "gallery",
    fr: { name: "Galerie photos", tease: "Le meilleur de ces trois décennies, en images" },
    en: { name: "Photo gallery", tease: "The best of three decades, in images" },
  },
  {
    id: "quotes",
    href: "/portal/wall",
    icon: "quotes",
    fr: { name: "Témoignages", tease: "Un florilège de citations — Laisse la tienne !" },
    en: { name: "What they say about me", tease: "A collection of testimonials, leave yours too!" },
  },
  {
    id: "disco",
    href: "/portal/disco",
    icon: "disco",
    fr: { name: "Disco Tap", tease: "Rejoue au meilleur jeu de l'année !" },
    en: { name: "Disco Tap", tease: "Play the best game of the year again!" },
  },
];
