// PROTOTYPE — placeholder content. The real gag prizes are the user's to write,
// in both languages. Written through the editor at /portal/wheel/editor.
//
// SIX AREAS on the outer band, THREE prizes each on the outer ring — eighteen
// visible cells, like a wheel of emotions. The pointer lands on a prize cell.
//
// TWO LABELS PER PRIZE: `shortFr`/`shortEn` is what fits in an outer cell (one
// word, ~10 characters), `fr`/`en` is the full line shown in the reveal.
// Area names must stay short too — they are drawn along a 60° slice.
//
// A prize may also be a VIDEO: set `video` to a YouTube link and the reveal
// plays it, with the `fr`/`en` line shown underneath as its legend.

export type Area = {
  fr: string;
  en: string;
  prizes: {
    fr: string;
    en: string;
    shortFr: string;
    shortEn: string;
    video?: string;
  }[];
};

export const AREAS: Area[] = [
  {
    fr: "Vidéos",
    en: "Videos",
    prizes: [
      {
        fr: "Attention à la marche (comme quand on descend du train)",
        en: "Watch your step (like when getting off the train)",
        shortFr: "Petit loupé",
        shortEn: "Minor Slip-up",
        video: "https://youtu.be/HpAKSd9PWcY?si=dsvHidfYtxCL4X-5",
      },
      {
        fr: "Nous sommes tous de gauche",
        en: "We're all left",
        shortFr: "Gaucho",
        shortEn: "Leftist",
        video: "https://youtu.be/X-E0VkAHl6A?si=MvMI4BJ1rp12kAg-",
      },
      {
        fr: "À ne pas reproduire chez soi",
        en: "Do not try this at home",
        shortFr: "Joli Strike",
        shortEn: "Nice Strike!",
        video: "https://youtube.com/shorts/CS3iJQb5rAQ?si=foU6Ac6DYhdu8ONl",
      },
    ],
  },
  {
    fr: "Chansons",
    en: "Songs",
    prizes: [
      {
        fr: "Pour accompagner chaque séance de cuisine",
        en: "To accompany every cooking sessions",
        shortFr: "Avocat",
        shortEn: "Avocado",
        video: "https://youtu.be/JNsKvZo6MDs?si=M3796lmhcd1YU1ke",
      },
      {
        fr: "Belle-Île-en-Mer, Marie-Galante\nSaint-Vincent, ... (le micro est à toi)",
        en: "A piece of French nostalgia. Enjoy and let the waves take you on an island tour.",
        shortFr: "Nostalgique",
        shortEn: "Nostalgic",
        video: "https://youtu.be/O8hPPw_qWe8?si=dw92W6uA6LAlxPIp",
      },
      {
        fr: "Wédédicofro wédédigo?",
        en: "Wedidhecomefromwheredidhego",
        shortFr: "Festif",
        shortEn: "Festive",
        video: "https://youtu.be/mOYZaiDZ7BM?si=pmKXCa3TNweUSpA2",
      },
    ],
  },
  {
    fr: "Wisdom Words",
    en: "Wisdom Words",
    prizes: [
      {
        fr: "Pour les moments qui requièrent un peu de force pour affronter la journée",
        en: "For when you need a little bit of strength to go through the day",
        shortFr: "Strength",
        shortEn: "Strength",
        video: "https://youtu.be/NW2UTLoBW2k?si=9Zq_khz90HOgRhZb",
      },
      {
        fr: "You can, be, do, what, we want, to do",
        en: "You can, be, do, what, we want, to do",
        shortFr: "Autonomie",
        shortEn: "Empowerment",
        video: "https://www.youtube.com/watch?v=dh7O5BV47lU",
      },
      {
        fr: "Croire en ses rêves",
        en: 'This is how French people pronounce "believe". Subtitles require.',
        shortFr: "Espoir",
        shortEn: "Hope",
        video: "https://youtu.be/CtZdrpFVYxo?si=WW1ZEdaFsyBaPbFO",
      },
    ],
  },
  {
    fr: "Vœux",
    en: "Wishes",
    prizes: [
      {
        fr: "Je crée un merveilleux photomontage de ton choix.",
        en: "I'll create a wonderful photomontage of your choice.",
        shortFr: "Photoshop",
        shortEn: "Photoshop",
      },
      {
        fr: "Donnez-moi n'importe quel thème et je rédigerai une dissertation. Notes de bas de page incluses.",
        en: "Give me any theme, and I'll write an essay for you. Footnotes included.",
        shortFr: "Dissertation",
        shortEn: "Essay",
      },
      {
        fr: "Je divague pendant une heure sur n'importe quel sujet de ton choix. Réclamer ce prix n'est pas une obligation.",
        en: "I'll ramble for an hour over anything you'd like. Claiming this prize is not mandatory.",
        shortFr: "Divagation",
        shortEn: "Rambling",
      },
    ],
  },
  {
    fr: "Fun Facts",
    en: "Fun Facts",
    prizes: [
      {
        fr: "Les poules sont des dinosaures. C'est Pierre qui me l'a dit.",
        en: "Chickens are dinosaurs. Pierre told me that.",
        shortFr: "Poules",
        shortEn: "Chickens",
        video: "https://youtu.be/q6EoRBvdVPQ?si=gSovcaENxbYVaHzY",
      },
      {
        fr: "Le petit sifflet en papier que l'on utilise pour mettre l'ambiance dans les fêtes s'appelle une langue de belle-mère. Épatant !",
        en: 'A party horn in French is called a "mother-in-law\'s tongue". Fun!',
        shortFr: "Bruit Festif",
        shortEn: "Party Noises",
        video: "https://www.youtube.com/watch?v=t-FC_1zhpdk",
      },
      {
        fr: 'Mark Wahlberg a autrefois mené une carrière musicale sous le pseudonyme de "Marky Mark". Feel the vibration!',
        en: 'Mark Wahlberg once had a music career under the nickname "Marky Mark". Feel the vibration!',
        shortFr: "Transformers",
        shortEn: "Transformers",
        video: "https://youtu.be/_kctwd4w7R0?si=Sygp2Iwt0tF5JlFS",
      },
    ],
  },
  {
    fr: "Cartes Joker",
    en: "Joker Cards",
    prizes: [
      {
        fr: "Cette joker n'est pas fraîche ! Garde ce joker de méfiance avec toi et prend la fuite.",
        en: "That joker is not fresh! Hold onto that joker of suspicion and run as fast as you can.",
        shortFr: "Méfiance",
        shortEn: "Suspicion",
      },
      {
        fr: "Double validation validée par le Président des Validations Validées !\n\nChance et succès délivrés immédiatement dès réception de ce joker.",
        en: "You've been blessed with a double validation joker validated by the President of Validated Validations!\n\nGood fortune and success delivered instantly upon receiving the joker.",
        shortFr: "Validation",
        shortEn: "Validation",
      },
      {
        fr: "Triple joker de méfiance et feu tricolore ! Après activation du joker, protection optimale contre toutes les cartes suspectes.\n\nAttention requise en terrain de méfiance.",
        en: "Triple suspicious joker and tricolor traffic lights!\n\nOnce the joker is activated, you have optimal protection against all suspicious cards.\n\nCaution is still required in suspicious territory.",
        shortFr: "Triple",
        shortEn: "Triple",
      },
    ],
  },
];
