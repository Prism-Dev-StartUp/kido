import Phaser from "phaser";

const FONT = "'Nunito', sans-serif";
const BG = 0x0f172a;

interface WordToken { text: string; isNoun: boolean; }

const SENTENCES: WordToken[][] = [
  [
    { text: "Le", isNoun: false }, { text: "chien", isNoun: true }, { text: "court", isNoun: false },
    { text: "dans", isNoun: false }, { text: "le", isNoun: false }, { text: "jardin", isNoun: true },
    { text: "avec", isNoun: false }, { text: "la", isNoun: false }, { text: "balle", isNoun: true }, { text: ".", isNoun: false },
  ],
  [
    { text: "La", isNoun: false }, { text: "fille", isNoun: true }, { text: "lit", isNoun: false },
    { text: "un", isNoun: false }, { text: "livre", isNoun: true }, { text: "à", isNoun: false },
    { text: "l'école", isNoun: true }, { text: ".", isNoun: false },
  ],
  [
    { text: "Le", isNoun: false }, { text: "chat", isNoun: true }, { text: "mange", isNoun: false },
    { text: "du", isNoun: false }, { text: "poisson", isNoun: true }, { text: "sur", isNoun: false },
    { text: "la", isNoun: false }, { text: "table", isNoun: true }, { text: ".", isNoun: false },
  ],
  [
    { text: "Le", isNoun: false }, { text: "médecin", isNoun: true }, { text: "soigne", isNoun: false },
    { text: "un", isNoun: false }, { text: "enfant", isNoun: true }, { text: "à", isNoun: false },
    { text: "l'hôpital", isNoun: true }, { text: ".", isNoun: false },
  ],
  [
    { text: "Un", isNoun: false }, { text: "oiseau", isNoun: true }, { text: "chante", isNoun: false },
    { text: "dans", isNoun: false }, { text: "la", isNoun: false }, { text: "forêt", isNoun: true },
    { text: "verte", isNoun: false }, { text: ".", isNoun: false },
  ],
];

export default class NomHuntScene extends Phaser.Scene {
  private score = 0;
  private sentenceIdx = 0;
  private found = 0;
  private totalNouns = 0;
  private feedbackText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() { super({ key: "NomHuntScene" }); }

  create() {
    this.add.rectangle(400, 250, 800, 500, BG);

    this.roundText = this.add.text(30, 32, "", { fontSize: "15px", color: "#94a3b8", fontFamily: FONT }).setOrigin(0, 0.5);
    this.add.text(400, 32, "Chasse aux noms", { fontSize: "20px", color: "#f1f5f9", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.scoreText = this.add.text(770, 32, "0 pts", { fontSize: "17px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT }).setOrigin(1, 0.5);
    this.add.rectangle(400, 62, 760, 1, 0xffffff, 0.07);

    this.add.text(400, 100, "Clique sur tous les noms de la phrase", {
      fontSize: "17px", color: "#94a3b8", fontFamily: FONT,
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(400, 440, "", { fontSize: "17px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.progressText = this.add.text(400, 470, "", { fontSize: "14px", color: "#64748b", fontFamily: FONT }).setOrigin(0.5);

    this.showSentence();
  }

  private showSentence() {
    if (this.sentenceIdx >= SENTENCES.length) { this.endGame(); return; }

    this.children.list
      .filter(c => c.getData?.("isToken"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    const tokens = SENTENCES[this.sentenceIdx];
    this.totalNouns = tokens.filter(t => t.isNoun).length;
    this.found = 0;
    this.roundText.setText(`Phrase ${this.sentenceIdx + 1} / ${SENTENCES.length}`);
    this.feedbackText.setText("");
    this.progressText.setText(`Noms trouvés : 0 / ${this.totalNouns}`);

    let xCursor = 60;
    const y = 260;
    const lineHeight = 52;
    let lineY = y;

    tokens.forEach(token => {
      if (token.text === ".") {
        this.add.text(xCursor, lineY, ".", { fontSize: "28px", color: "#94a3b8", fontFamily: FONT })
          .setData("isToken", true);
        return;
      }

      const width = token.text.length * 16 + 20;
      if (xCursor + width > 740) { xCursor = 60; lineY += lineHeight; }

      const bg = this.add.rectangle(xCursor + width / 2, lineY, width, 40, 0x1e293b)
        .setData("isToken", true)
        .setData("isNoun", token.isNoun)
        .setData("found", false);

      const txt = this.add.text(xCursor + width / 2, lineY, token.text, {
        fontSize: "24px", color: "#f1f5f9", fontStyle: token.isNoun ? "bold" : "normal", fontFamily: FONT,
      }).setOrigin(0.5).setData("isToken", true);

      if (token.isNoun || !token.isNoun) {
        bg.setInteractive({ useHandCursor: true });
        bg.on("pointerdown", () => this.tapToken(bg, txt, token.isNoun));
        bg.on("pointerover", () => { if (!bg.getData("found")) bg.setFillStyle(0x334155); });
        bg.on("pointerout",  () => { if (!bg.getData("found")) bg.setFillStyle(0x1e293b); });
      }

      xCursor += width + 8;
    });
  }

  private tapToken(bg: Phaser.GameObjects.Rectangle, txt: Phaser.GameObjects.Text, isNoun: boolean) {
    if (bg.getData("found")) return;
    if (isNoun) {
      bg.setData("found", true).setFillStyle(0x14532d);
      txt.setColor("#4ade80");
      this.score += 10;
      this.scoreText.setText(`${this.score} pts`);
      this.found++;
      this.progressText.setText(`Noms trouvés : ${this.found} / ${this.totalNouns}`);
      this.feedbackText.setColor("#4ade80").setText("C'est un nom !");
      if (this.found >= this.totalNouns) {
        this.time.delayedCall(800, () => { this.sentenceIdx++; this.showSentence(); });
      }
    } else {
      bg.setFillStyle(0x450a0a);
      txt.setColor("#f87171");
      this.feedbackText.setColor("#f87171").setText("Ce n'est pas un nom.");
      this.time.delayedCall(600, () => {
        bg.setFillStyle(0x1e293b);
        txt.setColor("#f1f5f9");
        this.feedbackText.setText("");
      });
    }
  }

  private endGame() {
    this.children.list.filter(c => c.getData?.("isToken")).forEach(c => (c as Phaser.GameObjects.GameObject).destroy());
    this.feedbackText.setText("").setVisible(false);
    this.progressText.setText("").setVisible(false);

    this.add.text(400, 210, "Bravo !", { fontSize: "44px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.add.text(400, 275, `Tu as trouvé ${this.score / 10} noms !`, { fontSize: "24px", color: "#fbbf24", fontFamily: FONT }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
