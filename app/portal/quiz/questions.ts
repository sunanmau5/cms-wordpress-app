// PROTOTYPE — throwaway. Quiz content.
// Written through the editor at /portal/quiz/editor.
// Ten is fixed: the Rina-Land tease already promises ten.

export type Option = {
  fr: string;
  en: string;
  correct?: boolean;
  noteFr: string;
  noteEn: string;
};

export type Question = {
  fr: string;
  en: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    fr: "Quelle est la bonne orthographe de mon nom ?",
    en: "What's the correct spelling of my name?",
    options: [
      { fr: "Lina", en: "Lina", correct: true, noteFr: "C'est correct !", noteEn: "That's right!" },
      { fr: "Linda", en: "Linda", noteFr: "Fait amusant : Il n'y a jamais eu de Linda au service client !", noteEn: "Fun fact: There never was a Linda in customer support!" },
      { fr: "Lisa", en: "Lisa", noteFr: "Bien que mes collègues me taguent correctement dans les commentaires Jira, iels ont tout de même l'audace de m'appeler Lisa.", noteEn: "Although my colleagues successfully tag me in Jira comments, they still have the audacity to call me Lisa." },
      { fr: "Rina", en: "Rina", noteFr: "Presque: Rina est la version japonaise de mon prénom. Au Japon, personne ne l'écrivait correctement. Depuis, j'utilise Rina à la place.", noteEn: "Almost right: Rina is the Japanese spelling of my name. In Japan, no one spelled my name correctly. That's why I go by Rina ever since." },
    ],
  },
  {
    fr: "Parmi ces fruits et légumes, il y en a un que je déteste. Devinez lequel.",
    en: "Among these fruits and vegetables, there is one that I hate. Guess which one.",
    options: [
      { fr: "Les fraises", en: "Strawberries", noteFr: "Je n'ai rien contre les fraises, si ce n'est leur prix excessif par les temps qui courent.", noteEn: "I have nothing against strawberries, except for their excessive price in this economy." },
      { fr: "L'ail", en: "Garlic", correct: true, noteFr: "Si l'on ajoute à cela mon allergie au soleil (ou plus précisément : la lucite estivale) et mes dents pointues, mon aversion pour l'ail fait de moi la candidate idéale pour l'académie des vampires !", noteEn: "Combined with my sun allergy (more accurately: \nsummer lucite), and my pointy teeth, my aversion for garlic makes me a perfect canditate for the vampire academy!" },
      { fr: "Les pommes de terre", en: "Potatoes", noteFr: "Elles sont utiles car elles nous permettent de faire des frites. Bravo les pommes de terre !", noteEn: "They're useful because they allow us to make french fries. Well done, potatoes!" },
      { fr: "Le fromage", en: "Cheese", noteFr: "Malheureusement, le fromage n'est ni un fruit ni un légume. Si c'était le cas, je mangerais ma dose quotidienne de cinq fruits et légumes en un clin d'œil.", noteEn: "Unfortunately, cheese is neither a fruit nor a vegetable. If it were, I would eat my daily serving of five fruits and vegetables in no time." },
    ],
  },
  {
    fr: "Qu'est-ce qui m'agace le plus ?",
    en: "What is my biggest pet peeve?",
    options: [
      { fr: "Les personnes lentes à la caisse", en: "Slow people at the cashier", noteFr: "Certaines personnes ont une vie après les courses, respectez cela.", noteEn: "Some people have a life after groceries, respect that." },
      { fr: "Les gens qui s'arrêtent brusquement au milieu de la rue", en: "People who suddenly stop in the middle of the street", noteFr: "Si j'étais présidente, je rendrais obligatoire la formation \"Comment marcher dans la rue : un guide complet pour apprendre à se déplacer respectueusement dans les espaces publics\".", noteEn: "If I was president, I'd make the training \"How To Walk In The Streets: A Comprehensive Guide To Learn How To Respectfully Move Into Public Spaces\" mandatory." },
      { fr: "Les personnes qui n'arrivent pas à décider si elles vont à gauche ou à droite.", en: "People who can't decide if they're going left or right", noteFr: "Ce n'est pas une décision de dernière minute : planifiez votre voyage à l'avance. Ce n'est pas si difficile.", noteEn: "This is not a last minute decision: Plan your travel in advance. It's not that hard." },
      { fr: "Tout ce qui précède", en: "All of the above", correct: true, noteFr: "Peut-être que mon problème est tout simplement les gens dans les lieux publics. La liste de comportements, humains ou non, susceptibles de m'agacer est trop longue et mériterait son propre quiz.", noteEn: "Perhaps my problem is simply people in public places. The list of behaviors, human or non-human, that tend to annoy me is too long and deserves its own quiz." },
    ],
  },
  {
    fr: "Si je pouvais ramener à la vie l'une de ces personnalités, qui serait-ce ?",
    en: "If I could bring back to life one of these personalities, who would it be?",
    options: [
      { fr: "Karl Marx", en: "Karl Marx", correct: true, noteFr: "C'est la seule bonne réponse possible - une vraie star. Et on a encore beaucoup de travail à faire.", noteEn: "That's the only correct answer possible - A real star. And we've got a lot more work to do." },
      { fr: "George Bush", en: "George Bush", noteFr: "Non seulement il est encore vivant, mais je me demande bien pourquoi quelqu'un voudrait le ramener à la vie.", noteEn: "Not only is he still alive - I wonder why anyone would want to bring him back to life." },
      { fr: "Marilyn Monroe", en: "Marilyn Monroe", noteFr: "Choix étrange !", noteEn: "Odd choice!" },
      { fr: "La reine Elizabeth II", en: "Queen Elizabeth II", noteFr: "Il n'y a pas grand-chose à gagner à la faire revenir, mais je lui donnerais sans hésiter un grand 10/10 pour sa ligne éditoriale mode.", noteEn: "Not much to gain out of bringing her back, but I'd definitely give her a big 10/10 for her fashion editorial line." },
    ],
  },
  {
    fr: "Quel est mon espèce animale éteinte préférée ?",
    en: "What's my favorite extinct animal species?",
    options: [
      { fr: "Le tyrannosaure", en: "The tyrannosaur", noteFr: "Je les trouve franchement effrayants. J'espère ne jamais en croiser un.", noteEn: "I find them quite frankly terrifying. I hope I never run into one." },
      { fr: "Le diplocodus", en: "The diplodocus", noteFr: "Ils ont l'air très gentils aussi, mais pas autant qu'un mammouth.", noteEn: "They look very nice too, but not as nice as a mammoth." },
      { fr: "Le mammouth", en: "The mammoth", correct: true, noteFr: "C'est exact ! Je trouve qu'ils ont l'air très sympas malgré leur carrure imposante.", noteEn: "That's right! I think they seem really nice despite their imposing build." },
      { fr: "Le triceratops", en: "The triceratops", noteFr: "Ils n'ont aucune élégance. Boring !", noteEn: "They have no elegance. Boring!" },
    ],
  },
  {
    fr: "Qui est mon peintre préféré ?",
    en: "Who's my favorite painter?",
    options: [
      { fr: "René Magritte", en: "René Magritte", noteFr: "Ceci n'est pas une pipe, ou je ne sais quoi. Pas une grande fan.", noteEn: "This is not a pipe, or whatever. Not a big fan." },
      { fr: "Claude Monet", en: "Claude Monet", correct: true, noteFr: "Et ce n'est pas parce qu'il est membre de mon patrimoine régional normand !", noteEn: "And not because he's part of my Norman regional heritage!" },
      { fr: "Léonard de Vinci", en: "Leonardo da Vinci", noteFr: "Il est 2ème de mon top 5.", noteEn: "He is second on my top 5 list." },
      { fr: "Pablo Picasso", en: "Pablo Picasso", noteFr: "Je le déteste.", noteEn: "I hate him." },
    ],
  },
  {
    fr: "Quel est mon œuvre architecturale préférée ?",
    en: "What is my favorite architectural work?",
    options: [
      { fr: "Le château Fregonas", en: "The Fregonas castle", noteFr: "Bien qu'il n'existe pas encore, je suis certaine que le château de Messire Fregonas serait ravissant. Un vrai joyau.", noteEn: "Although it does not yet exist, I am certain that Messire Fregonas's castle would be delightful. A true gem." },
      { fr: "La cathédrale de Florence", en: "The Florence Cathedral", correct: true, noteFr: "Le plus bel édifice du monde ! Je bous mets au défi de me demander pourquoi, mais aussi un peu en garde - l'explication pourrait durer longtemps. Mes excuses par avance.", noteEn: "The most beautiful building in the world! I dare you to ask me why (though I should also warn you: the explanation might take a while. My apologies in advance.)" },
      { fr: "Big Ben", en: "Big Ben", noteFr: "Une tour très quelconque, mais toujours plus stylée que celle de Montparnasse.", noteEn: "A very ordinary tower, but still more stylish than the Montparnasse Tower." },
      { fr: "La station de S-bahn Alexanderplatz", en: "Alexanderplatz S-Bahn station", noteFr: "Rien ne vaut une visite à Alexanderplatz. L'odeur ne me dérange pas, ni la proximité de la foule aux heures de pointe. Mon endroit préféré ? Le quai de la U8.", noteEn: "Nothing beats a visit to Alexanderplatz. The smell does not bother me, neither does the close proximity to people during peak hours. My favorite spot? The U8 platform." },
    ],
  },
  {
    fr: "Un pays que j'aimerais visiter ?",
    en: "A country I would like to visit?",
    options: [
      { fr: "La Corée du Nord", en: "North Korea", correct: true, noteFr: "Vous as bien lu. C'est ma curiosité malsaine qui me donne ce genre d'idées. Toujours moins effrayant qu'un voyage aux États-Unis, si vous voulez mon avis.", noteEn: "You read that correctly. My morbid curiosity gives me ideas like that. Still less frightening than a trip to the United States, if you ask me." },
      { fr: "Les États-Unis", en: "The United States", noteFr: "J'aimerais beaucoup voir New York. Mais c'est malheureusement aux États-Unis.", noteEn: "I'd love to see New York. But it's unfortunately located in the United States." },
      { fr: "Lichtenstein", en: "Liechtenstein", noteFr: "Je pense que ce pays n'existe même pas.", noteEn: "I don't think this country even exists." },
      { fr: "La France d'Emmanuel Macron", en: "Emmanuel Macron's France", noteFr: "C'est son projet, certainement pas le mien.", noteEn: "That's his project, certainly not mine." },
    ],
  },
  {
    fr: "Quel est le film que je déteste de tout mon cœur ?",
    en: "What is the movie I hate with all my heart?",
    options: [
      { fr: "Titanic ET Avatar", en: "Titanic AND Avatar", correct: true, noteFr: "Rien que d'y penser, je suis déjà fâchée ! Tout est de la faute de James Cameron de toute façon et je pense qu'on devrait simplement lui retirer le droit de produire plus de films. Period!", noteEn: "Just thinking about it makes me angry already! It’s all James Cameron’s fault anyway, and I think we should just forbid him to produce more movies than he already has. Period!" },
      { fr: "Interstellar", en: "Interstellar", noteFr: "Je l'ai même pas regardé (assez surprenant de ma part).", noteEn: "I didn't even watch it (which is quite surprising for me)." },
      { fr: "Les films Spiderman", en: "Any Spiderman movie", noteFr: "Je déteste le jeu d'acteur de Tobey Maguire, c'est vrai. Mais pas autant que je déteste n'importe quel film de James Cameron.", noteEn: "I hate Tobey Maguire's performance, that's true. But not as much as I hate any James Cameron movie." },
      { fr: "Pulp Fiction (Fiction Pulpeuse)", en: "Pulp Fiction", noteFr: "C'est le Tarantino que j'aime le moins.", noteEn: "My least favorite Tarantino." },
    ],
  },
  {
    fr: "Si je pouvais obtenir la réponse à une seule de ces questions, laquelle serait-elle ?",
    en: "If I could get the answer to just one of these questions, which one would it be?",
    options: [
      { fr: "Is this a Reebok or a Nike?", en: "Is this a Reebok or a Nike?", noteFr: "Ni l'un, ni l'autre : This is the rhythm of the night.", noteEn: "Neither: This is the rhythm of the night." },
      { fr: "Comment mon ami Guillaume gère-t-il son quotidien de myope dépourvu de lunettes ?", en: "How does my friend Guillaume go on about his days being nearsighted without glasses?", noteFr: "Je pourrais ne pas reconnaître ma mère dans la rue sans mes lunettes, pendant qu'il se pavane sans rien voir. Pourquoi ?", noteEn: "I wouldn't recognize my own mother on the street without my glasses, while he goes on with his day without seeing a thing. Why?" },
      { fr: "Est-ce qu'Annie va bien ?", en: "Is Annie really ok?", noteFr: "Je veux vraiment savoir - est-ce qu'elle va bien ?", noteEn: "I really wanna know - is she doing okay?" },
      { fr: "D'où vient la matière ?", en: "Where does matter come from?", correct: true, noteFr: "Bientôt 26 ans que cette question me taraude. Non seulement ça m'empêchait de dormir quand j'étais enfant, mais en plus personne ne peut y répondre. Pas cool !", noteEn: "This question has been bothering me for nearly 26 years. Not only did it keep me up at night when I was a kid, but on top of that, no one can answer it. Not cool!" },
    ],
  },
];
