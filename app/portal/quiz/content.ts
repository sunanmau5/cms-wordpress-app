// PROTOTYPE — throwaway. Quiz intro lines and score messages.
// Written through the editor at /portal/quiz/editor.

export type Scores = {
  zero: string; // 0/10 exactly
  low: string; // under 4
  mid: string; // 4–7
  high: string; // 8–9
  perfect: string; // 10/10 exactly
};

export const INTRO: { fr: string[]; en: string[] } = {
  fr: [
    "10 questions, une seule bonne réponse",
    "Tes réponses ne sont pas enregistrées",
    "Il n'y a pas de classement à la fin (désolé !)",
  ],
  en: [
    "10 questions, one correct answer",
    "Your answers are not recorded",
    "There's no leaderboard (sorry!)",
  ],
};

export const SCORES: { fr: Scores; en: Scores } = {
  fr: {
    zero: "Zéro sur dix. C'est pas grave, sauf si on se connait depuis très longtemps... 😱",
    low: "Pas mal (sauf si tu es Sunan ou l'un.e de mes ami.e.s proche) 👏",
    mid: "Cool ! Tu me connais relativement bien ✨",
    high: "Tu me connais vraiment bien, je suis flattée et ravie de t'avoir comme ami.e 💕",
    perfect:
      "Dix sur dix. Es-tu mon/ma meilleur.e ami.e ou t'as triché ? Voici ta médaille virtuelle.",
  },
  en: {
    zero: "Zero out of ten. Totally cool - Unless we've known each other for years... 😱",
    low: "Not bad (unless you're Sunan or one of my closest friend)! 👏",
    mid: "Nice! You know me well enough ✨",
    high: "Seems like you know me really well! I'm really flattered, and happy to have you as a friend 💕",
    perfect:
      "Ten out of ten. Are we besties, or did you cheat? Here's your virtual medal.",
  },
};
