import Phaser from "phaser";

const FONT = "'Nunito', sans-serif";
const BG = 0x0f172a;

const ALL_ROUNDS = Phaser.Utils.Array.Shuffle([
  { word: "table",    cat: "objet" },
  { word: "livre",    cat: "objet" },
  { word: "vélo",     cat: "objet" },
  { word: "stylo",    cat: "objet" },
  { word: "médecin",  cat: "personne" },
  { word: "élève",    cat: "personne" },
  { word: "roi",      cat: "personne" },
  { word: "acteur",   cat: "personne" },
  { word: "chat",     cat: "animal" },
  { word: "oiseau",   cat: "animal" },
  { word: "dauphin",  cat: "animal" },
  { word: "fourmi",   cat: "animal" },
  { word: "école",    cat: "lieu" },
  { word: "forêt",    cat: "lieu" },
  { word: "plage",    cat: "lieu" },
  { word: "jardin",   cat: "lieu" },
]);

const BUCKETS = [
  { id: "objet",    label: "Objet",    color: 0x475569, x: 110 },
  { id: "personne", label: "Personne", color: 0x1d4ed8, x: 290 },
  { id: "animal",   label: "Animal",   color: 0x15803d, x: 470 },
  { id: "lieu",     label: "Lieu",     color: 0xc2410c, x: 650 },
];

export default class NomSortScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private maxRounds = 12;
  private wordCard!: Phaser.GameObjects.Rectangle;
  private wordText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private feedback!: Phaser.GameObjects.Text;
  private locked = false;

  constructor() { super({ key: "NomSortScene" }); }

  create() {
    this.add.rectangle(400, 250, 800, 500, BG);

    this.roundText = this.add.text(30, 32, "", { fontSize: "15px", color: "#94a3b8", fontFamily: FONT }).setOrigin(0, 0.5);
    this.add.text(400, 32, "Trie les noms", { fontSize: "20px", color: "#f1f5f9", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.scoreText = this.add.text(770, 32, "0 pts", { fontSize: "17px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT }).setOrigin(1, 0.5);
    this.add.rectangle(400, 62, 760, 1, 0xffffff, 0.07);

    this.feedback = this.add.text(400, 100, "", { fontSize: "18px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);

    // Word card
    this.wordCard = this.add.rectangle(400, 210, 240, 90, 0xffffff).setInteractive({ draggable: true });
    this.wordText = this.add.text(400, 210, "", { fontSize: "30px", color: "#0f172a", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);

    // Buckets
    BUCKETS.forEach(b => {
      const rect = this.add.rectangle(b.x, 390, 155, 85, b.color, 0.9).setInteractive();
      rect.setData("catId", b.id);
      this.add.text(b.x, 390, b.label, {
        fontSize: "15px", color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5);
    });

    // Drag logic
    this.input.on("drag", (_: unknown, obj: Phaser.GameObjects.Rectangle, x: number, y: number) => {
      if (obj === this.wordCard) { obj.x = x; obj.y = y; this.wordText.setPosition(x, y); }
    });

    this.input.on("dragend", (_: unknown, obj: Phaser.GameObjects.Rectangle) => {
      if (obj !== this.wordCard || this.locked) return;
      let hit: string | null = null;
      BUCKETS.forEach(b => {
        if (Math.abs(obj.x - b.x) < 80 && Math.abs(obj.y - 390) < 55) hit = b.id;
      });
      if (hit) {
        this.checkAnswer(hit);
      } else {
        this.resetCard();
      }
    });

    this.showRound();
  }

  private showRound() {
    if (this.round >= this.maxRounds) { this.endGame(); return; }
    this.locked = false;
    const r = ALL_ROUNDS[this.round];
    this.roundText.setText(`${this.round + 1} / ${this.maxRounds}`);
    this.wordText.setText(r.word);
    this.wordCard.setPosition(400, 210);
    this.wordText.setPosition(400, 210);
    this.wordCard.setFillStyle(0xffffff);
    this.feedback.setText("");
  }

  private resetCard() {
    this.tweens.add({ targets: [this.wordCard, this.wordText], x: 400, y: 210, duration: 300, ease: "Back.easeOut" });
  }

  private checkAnswer(catId: string) {
    this.locked = true;
    const correct = ALL_ROUNDS[this.round].cat === catId;
    if (correct) {
      this.score += 6;
      this.scoreText.setText(`${this.score} pts`);
      this.wordCard.setFillStyle(0x166534);
      this.feedback.setColor("#4ade80").setText("Bien trié !");
    } else {
      const rightBucket = BUCKETS.find(b => b.id === ALL_ROUNDS[this.round].cat)!;
      this.wordCard.setFillStyle(0x7f1d1d);
      this.feedback.setColor("#f87171").setText(`C'est un ${rightBucket.label.toLowerCase()}.`);
      this.resetCard();
    }
    this.time.delayedCall(1000, () => {
      this.round++;
      this.showRound();
    });
  }

  private endGame() {
    this.add.rectangle(400, 250, 800, 500, BG);
    this.add.text(400, 210, "Excellent !", { fontSize: "44px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.add.text(400, 275, `Score : ${this.score} / ${this.maxRounds * 6}`, { fontSize: "26px", color: "#fbbf24", fontFamily: FONT }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
