import Phaser from "phaser";

interface Round { a: number; b: number; operator: "+" | "-" }

const FONT = "'Poppins', sans-serif";
const BTN_POSITIONS = [
  { x: 130, y: 440 }, { x: 310, y: 440 },
  { x: 490, y: 440 }, { x: 670, y: 440 },
];

const DOT_EMOJIS = ["🔵", "🟡", "🔴", "🟢", "🟠", "🟣"];

function buildRounds(): Round[] {
  const rounds: Round[] = [];
  // 4 additions simples (1-5)
  for (let i = 0; i < 4; i++) {
    const a = Phaser.Math.Between(1, 6);
    const b = Phaser.Math.Between(1, 6);
    rounds.push({ a, b, operator: "+" });
  }
  // 2 additions moyennes (5-10)
  for (let i = 0; i < 2; i++) {
    const a = Phaser.Math.Between(4, 9);
    const b = Phaser.Math.Between(3, 8);
    rounds.push({ a, b, operator: "+" });
  }
  // 2 soustractions simples
  for (let i = 0; i < 2; i++) {
    const b = Phaser.Math.Between(1, 5);
    const a = Phaser.Math.Between(b + 1, b + 7);
    rounds.push({ a, b, operator: "-" });
  }
  return Phaser.Utils.Array.Shuffle(rounds) as Round[];
}

export default class AdditionScene extends Phaser.Scene {
  private score = 0;
  private roundIndex = 0;
  private rounds: Round[] = [];
  private locked = false;
  private dotEmoji = "🔵";
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private formulaText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "AdditionScene" });
  }

  create() {
    this.rounds = buildRounds();
    this.dotEmoji = Phaser.Utils.Array.GetRandom(DOT_EMOJIS) as string;

    this.add.rectangle(400, 250, 800, 500, 0x021526);
    this.add.rectangle(400, 75, 760, 1, 0xffffff, 0.08);

    this.roundText = this.add.text(40, 38, "1 / 8", {
      fontSize: "16px", color: "#ffffff50", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.add.text(400, 38, "Calcule et clique sur la bonne réponse", {
      fontSize: "19px", color: "#ffffff80", fontFamily: FONT,
    }).setOrigin(0.5);

    this.scoreText = this.add.text(760, 38, "0 pts", {
      fontSize: "18px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);

    this.formulaText = this.add.text(400, 185, "", {
      fontSize: "72px", color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(400, 400, "", {
      fontSize: "20px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.nextRound();
  }

  private nextRound() {
    if (this.roundIndex >= this.rounds.length) { this.endGame(); return; }
    this.locked = false;
    const round = this.rounds[this.roundIndex];
    this.roundIndex++;
    this.roundText.setText(`${this.roundIndex} / ${this.rounds.length}`);
    this.feedbackText.setText("");

    // Clear buttons and dots
    this.children.list
      .filter(c => c.getData?.("isBtn") || c.getData?.("isDot"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    const answer = round.operator === "+" ? round.a + round.b : round.a - round.b;
    this.formulaText.setText(`${round.a} ${round.operator} ${round.b} = ?`);

    // Visual dots for group A
    this.spawnDots(round.a, 180, 280, "#01b273");
    if (round.operator === "+") {
      this.spawnDots(round.b, 490, 280, "#f97316");
    } else {
      // Show crossed dots for subtraction
      this.spawnDots(round.b, 490, 280, "#dc2626");
    }

    // Answer buttons
    const options = this.buildOptions(answer);
    options.forEach((opt, i) => {
      const { x, y } = BTN_POSITIONS[i];
      const bg = this.add.rectangle(x, y, 130, 52, 0x1e3a5f)
        .setStrokeStyle(2, 0x3b82f6, 0.5)
        .setInteractive({ useHandCursor: true })
        .setData("isBtn", true);

      this.add.text(x, y, String(opt), {
        fontSize: "26px", color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5).setData("isBtn", true);

      bg.on("pointerover", () => { if (!this.locked) bg.setFillStyle(0x2d4a70); });
      bg.on("pointerout",  () => { if (!this.locked) bg.setFillStyle(0x1e3a5f); });
      bg.on("pointerdown", () => {
        if (this.locked) return;
        this.locked = true;
        if (opt === answer) {
          bg.setFillStyle(0x16a34a).setStrokeStyle(2, 0x4ade80);
          this.score += 12;
          this.scoreText.setText(`${this.score} pts`);
          this.feedbackText.setColor("#4ade80").setText(`Correct ! ${round.a} ${round.operator} ${round.b} = ${answer}`);
        } else {
          bg.setFillStyle(0xdc2626).setStrokeStyle(2, 0xf87171);
          this.feedbackText.setColor("#f87171").setText(`La réponse était ${answer}`);
        }
        this.time.delayedCall(1000, () => this.nextRound());
      });
    });
  }

  private spawnDots(count: number, cx: number, cy: number, _color: string) {
    const cols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = cx - (cols - 1) * 18 + col * 36;
      const y = cy - Math.floor(count / cols) * 16 + row * 32;
      this.add.text(x, y, this.dotEmoji, { fontSize: "24px" })
        .setOrigin(0.5)
        .setData("isDot", true);
    }
  }

  private buildOptions(correct: number): number[] {
    const set = new Set<number>([correct]);
    while (set.size < 4) {
      const delta = Phaser.Math.Between(1, 4) * (Math.random() < 0.5 ? 1 : -1);
      const v = correct + delta;
      if (v >= 0) set.add(v);
    }
    return Phaser.Utils.Array.Shuffle([...set]) as number[];
  }

  private endGame() {
    this.children.list
      .filter(c => c.getData?.("isBtn") || c.getData?.("isDot"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.formulaText.setText("");
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
