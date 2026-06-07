import Phaser from "phaser";

interface Round {
  word: string;
  correct: string;
  distractors: string[];
}

interface GrammarConfig {
  subtitle: string;
  rounds: Round[];
}

let _activeKey = "GrammarNom";
export function setGrammarKey(key: string) {
  _activeKey = key;
}

const CONFIGS: Record<string, GrammarConfig> = {
  GrammarNom: {
    subtitle: "Nom commun ou nom propre ?",
    rounds: [
      { word: "Paris",   correct: "Nom propre",  distractors: ["Nom commun", "Verbe", "Article"] },
      { word: "chien",   correct: "Nom commun",  distractors: ["Nom propre", "Article", "Adverbe"] },
      { word: "Marie",   correct: "Nom propre",  distractors: ["Nom commun", "Adjectif", "Verbe"] },
      { word: "maison",  correct: "Nom commun",  distractors: ["Nom propre", "Article", "Adverbe"] },
      { word: "France",  correct: "Nom propre",  distractors: ["Nom commun", "Adjectif", "Préposition"] },
      { word: "livre",   correct: "Nom commun",  distractors: ["Nom propre", "Verbe", "Article"] },
      { word: "Léa",     correct: "Nom propre",  distractors: ["Nom commun", "Pronom", "Adjectif"] },
      { word: "arbre",   correct: "Nom commun",  distractors: ["Nom propre", "Adverbe", "Verbe"] },
    ],
  },
  GrammarArticle: {
    subtitle: "Quel type d'article ?",
    rounds: [
      { word: "le",    correct: "Défini",    distractors: ["Indéfini", "Contracté", "Partitif"] },
      { word: "un",    correct: "Indéfini",  distractors: ["Défini", "Contracté", "Partitif"] },
      { word: "du",    correct: "Contracté", distractors: ["Défini", "Indéfini", "Partitif"] },
      { word: "de la", correct: "Partitif",  distractors: ["Défini", "Indéfini", "Contracté"] },
      { word: "les",   correct: "Défini",    distractors: ["Indéfini", "Contracté", "Partitif"] },
      { word: "des",   correct: "Indéfini",  distractors: ["Défini", "Contracté", "Partitif"] },
      { word: "au",    correct: "Contracté", distractors: ["Défini", "Indéfini", "Partitif"] },
      { word: "une",   correct: "Indéfini",  distractors: ["Défini", "Contracté", "Partitif"] },
    ],
  },
  GrammarAdjectif: {
    subtitle: "Quel type d'adjectif ?",
    rounds: [
      { word: "grand",    correct: "Qualificatif",  distractors: ["Possessif", "Démonstratif", "Indéfini"] },
      { word: "mon",      correct: "Possessif",     distractors: ["Qualificatif", "Démonstratif", "Numéral"] },
      { word: "ce",       correct: "Démonstratif",  distractors: ["Qualificatif", "Possessif", "Indéfini"] },
      { word: "belle",    correct: "Qualificatif",  distractors: ["Possessif", "Démonstratif", "Interrogatif"] },
      { word: "quel",     correct: "Interrogatif",  distractors: ["Qualificatif", "Possessif", "Démonstratif"] },
      { word: "certain",  correct: "Indéfini",      distractors: ["Qualificatif", "Possessif", "Démonstratif"] },
      { word: "ta",       correct: "Possessif",     distractors: ["Qualificatif", "Démonstratif", "Indéfini"] },
      { word: "cette",    correct: "Démonstratif",  distractors: ["Qualificatif", "Possessif", "Interrogatif"] },
    ],
  },
  GrammarAdjectifNumeral: {
    subtitle: "Cardinal ou ordinal ?",
    rounds: [
      { word: "trois",     correct: "Cardinal", distractors: ["Ordinal", "Qualificatif", "Indéfini"] },
      { word: "troisième", correct: "Ordinal",  distractors: ["Cardinal", "Qualificatif", "Indéfini"] },
      { word: "vingt",     correct: "Cardinal", distractors: ["Ordinal", "Possessif", "Démonstratif"] },
      { word: "premier",   correct: "Ordinal",  distractors: ["Cardinal", "Qualificatif", "Possessif"] },
      { word: "cent",      correct: "Cardinal", distractors: ["Ordinal", "Indéfini", "Démonstratif"] },
      { word: "deuxième",  correct: "Ordinal",  distractors: ["Cardinal", "Qualificatif", "Indéfini"] },
      { word: "mille",     correct: "Cardinal", distractors: ["Ordinal", "Possessif", "Indéfini"] },
      { word: "cinquième", correct: "Ordinal",  distractors: ["Cardinal", "Qualificatif", "Démonstratif"] },
    ],
  },
  GrammarVerbe: {
    subtitle: "Verbe d'action, d'état ou auxiliaire ?",
    rounds: [
      { word: "courir",   correct: "Action",    distractors: ["État", "Auxiliaire", "Adverbe"] },
      { word: "être",     correct: "Auxiliaire", distractors: ["Action", "État", "Adjectif"] },
      { word: "avoir",    correct: "Auxiliaire", distractors: ["Action", "État", "Adverbe"] },
      { word: "sembler",  correct: "État",       distractors: ["Action", "Auxiliaire", "Adverbe"] },
      { word: "manger",   correct: "Action",     distractors: ["État", "Auxiliaire", "Adjectif"] },
      { word: "paraître", correct: "État",       distractors: ["Action", "Auxiliaire", "Adverbe"] },
      { word: "sauter",   correct: "Action",     distractors: ["État", "Auxiliaire", "Adjectif"] },
      { word: "devenir",  correct: "État",       distractors: ["Action", "Auxiliaire", "Adverbe"] },
    ],
  },
  GrammarAdverbe: {
    subtitle: "Identifie l'adverbe",
    rounds: [
      { word: "vite",      correct: "Adverbe", distractors: ["Nom", "Verbe", "Adjectif"] },
      { word: "très",      correct: "Adverbe", distractors: ["Nom", "Préposition", "Conjonction"] },
      { word: "souvent",   correct: "Adverbe", distractors: ["Nom", "Verbe", "Adjectif"] },
      { word: "hier",      correct: "Adverbe", distractors: ["Nom", "Verbe", "Préposition"] },
      { word: "ici",       correct: "Adverbe", distractors: ["Nom", "Préposition", "Conjonction"] },
      { word: "jamais",    correct: "Adverbe", distractors: ["Nom", "Verbe", "Adjectif"] },
      { word: "peut-être", correct: "Adverbe", distractors: ["Nom", "Conjonction", "Préposition"] },
      { word: "bien",      correct: "Adverbe", distractors: ["Adjectif", "Verbe", "Nom"] },
    ],
  },
  GrammarPronom: {
    subtitle: "Quel type de pronom ?",
    rounds: [
      { word: "il",         correct: "Personnel",    distractors: ["Possessif", "Démonstratif", "Indéfini"] },
      { word: "le mien",    correct: "Possessif",    distractors: ["Personnel", "Démonstratif", "Relatif"] },
      { word: "celui",      correct: "Démonstratif", distractors: ["Personnel", "Possessif", "Indéfini"] },
      { word: "qui",        correct: "Relatif",      distractors: ["Personnel", "Possessif", "Interrogatif"] },
      { word: "quelqu'un",  correct: "Indéfini",     distractors: ["Personnel", "Démonstratif", "Relatif"] },
      { word: "elle",       correct: "Personnel",    distractors: ["Possessif", "Démonstratif", "Indéfini"] },
      { word: "que",        correct: "Relatif",      distractors: ["Personnel", "Possessif", "Indéfini"] },
      { word: "personne",   correct: "Indéfini",     distractors: ["Personnel", "Démonstratif", "Relatif"] },
    ],
  },
  GrammarConjonction: {
    subtitle: "Coordination ou subordination ?",
    rounds: [
      { word: "et",         correct: "Coordination",  distractors: ["Subordination", "Préposition", "Adverbe"] },
      { word: "mais",       correct: "Coordination",  distractors: ["Subordination", "Préposition", "Adverbe"] },
      { word: "que",        correct: "Subordination", distractors: ["Coordination", "Préposition", "Adverbe"] },
      { word: "quand",      correct: "Subordination", distractors: ["Coordination", "Préposition", "Adverbe"] },
      { word: "ou",         correct: "Coordination",  distractors: ["Subordination", "Préposition", "Adverbe"] },
      { word: "si",         correct: "Subordination", distractors: ["Coordination", "Préposition", "Adverbe"] },
      { word: "donc",       correct: "Coordination",  distractors: ["Subordination", "Préposition", "Adverbe"] },
      { word: "parce que",  correct: "Subordination", distractors: ["Coordination", "Préposition", "Adverbe"] },
    ],
  },
  GrammarPreposition: {
    subtitle: "Identifie la préposition",
    rounds: [
      { word: "dans",   correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Pronom"] },
      { word: "sur",    correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Nom"] },
      { word: "avec",   correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Verbe"] },
      { word: "pour",   correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Nom"] },
      { word: "vers",   correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Verbe"] },
      { word: "sans",   correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Adjectif"] },
      { word: "entre",  correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Nom"] },
      { word: "depuis", correct: "Préposition", distractors: ["Conjonction", "Adverbe", "Verbe"] },
    ],
  },
  GrammarInterjection: {
    subtitle: "Interjection ou onomatopée ?",
    rounds: [
      { word: "Aïe !",      correct: "Interjection", distractors: ["Onomatopée", "Adverbe", "Nom"] },
      { word: "Boum !",     correct: "Onomatopée",   distractors: ["Interjection", "Adverbe", "Verbe"] },
      { word: "Bravo !",    correct: "Interjection", distractors: ["Onomatopée", "Adverbe", "Nom"] },
      { word: "Crac !",     correct: "Onomatopée",   distractors: ["Interjection", "Adverbe", "Verbe"] },
      { word: "Hélas !",    correct: "Interjection", distractors: ["Onomatopée", "Adverbe", "Nom"] },
      { word: "Plouf !",    correct: "Onomatopée",   distractors: ["Interjection", "Adverbe", "Verbe"] },
      { word: "Hourra !",   correct: "Interjection", distractors: ["Onomatopée", "Adverbe", "Nom"] },
      { word: "Cocorico !", correct: "Onomatopée",   distractors: ["Interjection", "Adverbe", "Verbe"] },
    ],
  },
  GrammarDeterminant: {
    subtitle: "Quel type de déterminant ?",
    rounds: [
      { word: "le",       correct: "Article",      distractors: ["Possessif", "Démonstratif", "Numéral"] },
      { word: "mon",      correct: "Possessif",    distractors: ["Article", "Démonstratif", "Indéfini"] },
      { word: "ce",       correct: "Démonstratif", distractors: ["Article", "Possessif", "Numéral"] },
      { word: "trois",    correct: "Numéral",      distractors: ["Article", "Possessif", "Indéfini"] },
      { word: "quelques", correct: "Indéfini",     distractors: ["Article", "Possessif", "Démonstratif"] },
      { word: "chaque",   correct: "Indéfini",     distractors: ["Article", "Numéral", "Démonstratif"] },
      { word: "ton",      correct: "Possessif",    distractors: ["Article", "Démonstratif", "Indéfini"] },
      { word: "ces",      correct: "Démonstratif", distractors: ["Article", "Possessif", "Indéfini"] },
    ],
  },
};

const BTN_COLORS = [0x4f46e5, 0x0d9488, 0xf97316, 0x8b5cf6];
const BTN_POSITIONS = [
  { x: 210, y: 355 },
  { x: 590, y: 355 },
  { x: 210, y: 435 },
  { x: 590, y: 435 },
];

export default class GrammarClassifierScene extends Phaser.Scene {
  private score = 0;
  private roundIndex = 0;
  private rounds: Round[] = [];
  private config!: GrammarConfig;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private wordText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private answerLocked = false;

  constructor() {
    super({ key: "GrammarClassifierScene" });
  }

  create() {
    this.config = CONFIGS[_activeKey] ?? CONFIGS["GrammarNom"];
    this.rounds = (Phaser.Utils.Array.Shuffle([...this.config.rounds]) as Round[]).slice(0, 8);

    // Background
    this.add.rectangle(400, 250, 800, 500, 0x021526);

    // Divider line
    this.add.rectangle(400, 80, 760, 1, 0xffffff, 0.08);

    // Subtitle
    this.add.text(400, 45, this.config.subtitle, {
      fontSize: "19px",
      color: "#ffffff70",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0.5);

    // Round counter
    this.roundText = this.add.text(32, 45, "1 / 8", {
      fontSize: "16px",
      color: "#ffffff50",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0, 0.5);

    // Score
    this.scoreText = this.add.text(768, 45, "0 pts", {
      fontSize: "18px",
      color: "#fbbf24",
      fontStyle: "bold",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(1, 0.5);

    // Word card background
    this.add.rectangle(400, 185, 460, 100, 0x01b273, 0.12)
      .setStrokeStyle(2, 0x01b273, 0.5);

    // Word
    this.wordText = this.add.text(400, 185, "", {
      fontSize: "46px",
      color: "#ffffff",
      fontStyle: "bold",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0.5);

    // Question label
    this.add.text(400, 265, "Quelle est la nature de ce mot ?", {
      fontSize: "17px",
      color: "#01b273",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0.5);

    // Feedback placeholder
    this.feedbackText = this.add.text(400, 305, "", {
      fontSize: "22px",
      color: "#4ade80",
      fontStyle: "bold",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0.5);

    this.nextRound();
  }

  private nextRound() {
    if (this.roundIndex >= this.rounds.length) {
      this.endGame();
      return;
    }

    this.answerLocked = false;
    const current = this.rounds[this.roundIndex];
    this.roundIndex++;

    this.wordText.setText(current.word);
    this.roundText.setText(`${this.roundIndex} / 8`);
    this.feedbackText.setText("");

    // Clear previous buttons
    this.children.list
      .filter(c => c.getData?.("isBtn"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    const options = Phaser.Utils.Array.Shuffle([
      current.correct,
      ...current.distractors.slice(0, 3),
    ]) as string[];

    options.forEach((opt, i) => {
      const { x, y } = BTN_POSITIONS[i];
      const color = BTN_COLORS[i];

      const bg = this.add.rectangle(x, y, 310, 52, color, 0.9)
        .setInteractive({ useHandCursor: true })
        .setData("isBtn", true);

      this.add.text(x, y, opt, {
        fontSize: "17px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "'Poppins', sans-serif",
      }).setOrigin(0.5).setData("isBtn", true);

      bg.on("pointerover", () => { if (!this.answerLocked) bg.setAlpha(1); });
      bg.on("pointerout",  () => { if (!this.answerLocked) bg.setAlpha(0.9); });
      bg.on("pointerdown", () => {
        if (this.answerLocked) return;
        this.answerLocked = true;

        if (opt === current.correct) {
          this.score += 12;
          this.scoreText.setText(`${this.score} pts`);
          bg.setFillStyle(0x16a34a);
          this.feedbackText.setColor("#4ade80").setText("Correct !");
        } else {
          bg.setFillStyle(0xdc2626);
          this.feedbackText.setColor("#f87171").setText(`C'est : ${current.correct}`);
        }

        this.time.delayedCall(950, () => this.nextRound());
      });
    });
  }

  private endGame() {
    // Clear buttons
    this.children.list
      .filter(c => c.getData?.("isBtn"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.wordText.setText("");
    this.feedbackText.setText("");

    this.add.text(400, 200, "Excellent !", {
      fontSize: "44px",
      color: "#01b273",
      fontStyle: "bold",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0.5);

    this.add.text(400, 270, `Score : ${this.score} / 96`, {
      fontSize: "28px",
      color: "#fbbf24",
      fontFamily: "'Poppins', sans-serif",
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
