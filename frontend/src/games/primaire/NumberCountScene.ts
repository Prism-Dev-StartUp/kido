import Phaser from "phaser";

interface ObjectSet { emoji: string; label: string }

const OBJECT_SETS: ObjectSet[] = [
  { emoji: "⭐", label: "étoiles" },
  { emoji: "🍎", label: "pommes" },
  { emoji: "🐟", label: "poissons" },
  { emoji: "🌸", label: "fleurs" },
  { emoji: "🦋", label: "papillons" },
  { emoji: "🍄", label: "champignons" },
  { emoji: "🐝", label: "abeilles" },
  { emoji: "🎈", label: "ballons" },
];

const FONT = "'Poppins', sans-serif";
const BTN_POSITIONS = [
  { x: 130, y: 445 }, { x: 310, y: 445 },
  { x: 490, y: 445 }, { x: 670, y: 445 },
];

export default class NumberCountScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private maxRounds = 8;
  private correct = 0;
  private locked = false;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private questionText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "NumberCountScene" });
  }

  create() {
    this.add.rectangle(400, 250, 800, 500, 0x021526);
    this.add.rectangle(400, 75, 760, 1, 0xffffff, 0.08);

    this.roundText = this.add.text(40, 38, "1 / 8", {
      fontSize: "16px", color: "#ffffff50", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.add.text(400, 38, "Compte et choisis la bonne réponse", {
      fontSize: "19px", color: "#ffffff80", fontFamily: FONT,
    }).setOrigin(0.5);

    this.scoreText = this.add.text(760, 38, "0 pts", {
      fontSize: "18px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);

    this.questionText = this.add.text(400, 115, "", {
      fontSize: "18px", color: "#01b273", fontFamily: FONT,
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(400, 410, "", {
      fontSize: "20px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.nextRound();
  }

  private nextRound() {
    if (this.round >= this.maxRounds) { this.endGame(); return; }
    this.locked = false;
    this.round++;
    this.roundText.setText(`${this.round} / ${this.maxRounds}`);
    this.feedbackText.setText("");

    // Clear objects and buttons
    this.children.list
      .filter(c => c.getData?.("isItem") || c.getData?.("isBtn"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    const set = Phaser.Utils.Array.GetRandom(OBJECT_SETS) as ObjectSet;
    this.correct = Phaser.Math.Between(3, 15);
    this.questionText.setText(`Combien y a-t-il de ${set.label} ?`);

    // Spawn objects in a zone
    for (let i = 0; i < this.correct; i++) {
      const x = Phaser.Math.Between(60, 740);
      const y = Phaser.Math.Between(140, 370);
      this.add.text(x, y, set.emoji, { fontSize: "30px" })
        .setOrigin(0.5)
        .setData("isItem", true);
    }

    // Answer buttons
    const options = this.buildOptions(this.correct);
    options.forEach((opt, i) => {
      const { x, y } = BTN_POSITIONS[i];
      const bg = this.add.rectangle(x, y, 130, 52, 0x1e3a5f)
        .setStrokeStyle(2, 0x3b82f6, 0.5)
        .setInteractive({ useHandCursor: true })
        .setData("isBtn", true);

      this.add.text(x, y, String(opt), {
        fontSize: "22px", color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5).setData("isBtn", true);

      bg.on("pointerover", () => { if (!this.locked) bg.setFillStyle(0x2d4a70); });
      bg.on("pointerout",  () => { if (!this.locked) bg.setFillStyle(0x1e3a5f); });
      bg.on("pointerdown", () => {
        if (this.locked) return;
        this.locked = true;
        if (opt === this.correct) {
          bg.setFillStyle(0x16a34a).setStrokeStyle(2, 0x4ade80);
          this.score += 12;
          this.scoreText.setText(`${this.score} pts`);
          this.feedbackText.setColor("#4ade80").setText(`Correct ! C'est bien ${this.correct}`);
        } else {
          bg.setFillStyle(0xdc2626).setStrokeStyle(2, 0xf87171);
          this.feedbackText.setColor("#f87171").setText(`Il y en avait ${this.correct} !`);
        }
        this.time.delayedCall(950, () => this.nextRound());
      });
    });
  }

  private buildOptions(correct: number): number[] {
    const set = new Set<number>([correct]);
    while (set.size < 4) {
      const delta = Phaser.Math.Between(1, 4) * (Math.random() < 0.5 ? 1 : -1);
      const v = correct + delta;
      if (v > 0 && v <= 20) set.add(v);
    }
    return Phaser.Utils.Array.Shuffle([...set]) as number[];
  }

  private endGame() {
    this.children.list
      .filter(c => c.getData?.("isItem") || c.getData?.("isBtn"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.questionText.setText("");
    this.feedbackText.setText("");

    this.add.text(400, 210, "Excellent !", {
      fontSize: "46px", color: "#01b273", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);
    this.add.text(400, 280, `Score : ${this.score} / 96`, {
      fontSize: "28px", color: "#fbbf24", fontFamily: FONT,
    }).setOrigin(0.5);

    this.time.delayedCall(2200, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
