// PROTOTYPE — Birthday Fit. The manifest the screen reads.
//
// Files live in `public/30ans/fit/` under the user's own names.
//
// x / y are percentages of the PORTRAIT's box (0,0 = its top-left), w is a
// percentage of the portrait's width, rot is degrees. x is the accessory's
// CENTRE. These are first guesses against the framed portrait — the screen's
// Nudge control prints corrected numbers to paste back in here.

export type Item = {
  id: string;
  fr: string;
  en: string;
  src: string;
  x: number;
  y: number;
  w: number;
  rot: number;
};

export type Slot = {
  id: "hat" | "glasses";
  fr: string;
  en: string;
  items: Item[];
};

export const SLOTS: Slot[] = [
  {
    id: "hat",
    fr: "Chapeau",
    en: "Hat",
    items: [
      {
        id: "hat-blue",
        fr: "Bleu à étoiles",
        en: "Blue stars",
        src: "/30ans/fit/party-hat-blue.png",
        x: 40,
        y: 3,
        w: 33,
        rot: -5,
      },
      {
        id: "hat-fur",
        fr: "Pois et fourrure",
        en: "Dots and fur",
        src: "/30ans/fit/party-hat-fur.png",
        x: 41,
        y: 2,
        w: 30,
        rot: -8,
      },
      {
        id: "hat-gold",
        fr: "Doré à franges",
        en: "Gold tassel",
        src: "/30ans/fit/party-hat-gold.png",
        x: 39,
        y: 1,
        w: 27,
        rot: -8,
      },
      {
        id: "hat-silver",
        fr: "Argent pailleté",
        en: "Silver glitter",
        src: "/30ans/fit/party-hat-silver.png",
        x: 40,
        y: 5,
        w: 27,
        rot: -6,
      },
      {
        id: "hat-yellow",
        fr: "Jaune à pois",
        en: "Yellow dots",
        src: "/30ans/fit/party-hat-yellow.png",
        x: 39,
        y: 3,
        w: 25,
        rot: -8,
      },
    ],
  },
  {
    id: "glasses",
    fr: "Lunettes",
    en: "Glasses",
    items: [
      {
        id: "gl-1",
        fr: "Cupcakes",
        en: "Cupcakes",
        src: "/30ans/fit/birthday-glasses-1.png",
        x: 48,
        y: 32,
        w: 62,
        rot: 3,
      },
      {
        id: "gl-2",
        fr: "Birthday Girl",
        en: "Birthday Girl",
        src: "/30ans/fit/birthday-glasses-2.png",
        x: 47,
        y: 46,
        w: 63,
        rot: 4,
      },
      {
        id: "gl-4",
        fr: "Birthday Queen",
        en: "Birthday Queen",
        src: "/30ans/fit/birthday-glasses-4.png",
        x: 46,
        y: 45,
        w: 63,
        rot: 4,
      },
      {
        id: "gl-5",
        fr: "Ballons",
        en: "Balloons",
        src: "/30ans/fit/birthday-glasses-5.png",
        x: 47,
        y: 39,
        w: 53,
        rot: 3,
      },
    ],
  },
];

// the portrait the accessories sit on — already in its gold frame, so the
// percentages above are relative to the WHOLE framed image, not just the face.
// Hats sit at NEGATIVE y on purpose: poking out over the top of the frame is the joke.
export const PHOTO = {
  src: "/30ans/fit/birthday-outfit-frame.png",
  fallback: "/30ans/cutout1-web.png",
};
