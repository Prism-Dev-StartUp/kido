import Phaser from "phaser";

const FONT = "'Nunito', sans-serif";
const BG = 0x0f172a;

const PAIRS = [
  { word: "chat",    emoji: "🐱" },
  { word: "école",   emoji: "🏫" },
  { word: "livre",   emoji: "📚" },
  { word: "vélo",    emoji: "🚲" },
  { word: "jardin",  emoji: "🌿" },
  { word: "médecin", emoji: "👩‍⚕️" },
  { word: "oiseau",  emoji: "🐦" },
  { word: "table",   emoji: "🪑" },
];

interface Card {
  rect: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default class NomMemoryScene extends Phaser.Scene {
  private cards: Card[] = [];
  private flipped: Card[] = [];
  private matches = 0;
  private score = 0;
  private locked = false;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() { super({ key: "NomMemoryScene" }); }

  create() {
    this.add.rectangle(400, 250, 800, 500, BG);

    this.add.text(400, 30, "Trouve les paires mot – image", {
      fontSize: "19px", color: "#f1f5f9", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);
    this.scoreText = this.add.text(770, 30, "0 pts", {
      fontSize: "16px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);
    this.add.rectangle(400, 55, 760, 1, 0xffffff, 0.07);

    this.add.text(400, 470, "Retourne deux cartes pour trouver la paire", {
      fontSize: "14px", color: "#64748b", fontFamily: FONT,
    }).setOrigin(0.5);

    // Build & shuffle deck (word + emoji for each pair)
    const deck = Phaser.Utils.Array.Shuffle([
      ...PAIRS.map((p, i) => ({ label: p.word,  pairId: i, isWord: true  })),
      ...PAIRS.map((p, i) => ({ label: p.emoji, pairId: i, isWord: false })),
    ]);

    // 4 cols × 4 rows
    const cols = 4;
    const cardW = 140, cardH = 72, padX = 30, padY = 78;

    deck.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padX + col * (cardW + 16) + cardW / 2 + 20;
      const y = padY + row * (cardH + 12) + cardH / 2;

      const rect = this.add.rectangle(x, y, cardW, cardH, 0x1e293b)
        .setInteractive({ useHandCursor: true });

      const label = this.add.text(x, y, "?", {
        fontSize: "22px", color: "#64748b", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5);

      const card: Card = { rect, label, pairId: item.pairId, isFlipped: false, isMatched: false };
      this.cards.push(card);

      rect.on("pointerover", () => { if (!card.isFlipped && !card.isMatched) rect.setFillStyle(0x334155); });
      rect.on("pointerout",  () => { if (!card.isFlipped && !card.isMatched) rect.setFillStyle(0x1e293b); });
      rect.on("pointerdown", () => this.flip(card, item.label));
    });
  }

  private flip(card: Card, label: string) {
    if (this.locked || card.isFlipped || card.isMatched || this.flipped.length >= 2) return;
    card.isFlipped = true;
    card.rect.setFillStyle(0x1e40af);
    card.label.setText(label).setColor("#ffffff").setFontSize("24px");
    this.flipped.push(card);

    if (this.flipped.length === 2) {
      this.locked = true;
      this.time.delayedCall(900, () => this.check(label));
    }
  }

  private check(_lastLabel: string) {
    const [a, b] = this.flipped;
    if (a.pairId === b.pairId) {
      a.isMatched = b.isMatched = true;
      a.rect.setFillStyle(0x14532d);
      b.rect.setFillStyle(0x14532d);
      this.score += 15;
      this.scoreText.setText(`${this.score} pts`);
      this.matches++;
      if (this.matches === PAIRS.length) {
        this.time.delayedCall(600, () => this.endGame());
      }
    } else {
      a.rect.setFillStyle(0x450a0a);
      b.rect.setFillStyle(0x450a0a);
      this.time.delayedCall(400, () => {
        [a, b].forEach(c => {
          c.isFlipped = false;
          c.rect.setFillStyle(0x1e293b);
          c.label.setText("?").setColor("#64748b").setFontSize("22px");
        });
      });
    }
    this.flipped = [];
    this.locked = false;
  }

  private endGame() {
    this.add.rectangle(400, 250, 800, 500, BG);
    this.add.text(400, 210, "Toutes les paires !", { fontSize: "40px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.add.text(400, 275, `Score : ${this.score} / ${PAIRS.length * 15}`, { fontSize: "24px", color: "#fbbf24", fontFamily: FONT }).setOrigin(0.5);
    this.time.delayedCall(1800, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
