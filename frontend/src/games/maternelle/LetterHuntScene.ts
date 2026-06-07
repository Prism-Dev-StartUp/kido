import Phaser from "phaser";

interface Round {
  target: string;
  grid: string[];   // 12 letters, some are the target
}

const FONT = "'Poppins', sans-serif";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function buildRound(target: string, occurrences: number): Round {
  const others = ALPHABET.replace(target, "").split("");
  const distractors = Phaser.Utils.Array.Shuffle(others).slice(0, 12 - occurrences) as string[];
  const grid = Phaser.Utils.Array.Shuffle(
    [...Array(occurrences).fill(target), ...distractors]
  ) as string[];
  return { target, grid };
}

const ROUNDS: Round[] = [
  buildRound("A", 3),
  buildRound("E", 4),
  buildRound("O", 3),
  buildRound("M", 2),
  buildRound("S", 3),
  buildRound("T", 4),
  buildRound("R", 2),
  buildRound("L", 3),
];

export default class LetterHuntScene extends Phaser.Scene {
  private score = 0;
  private roundIndex = 0;
  private currentRound!: Round;
  private foundCount = 0;
  private needed = 0;
  private locked = false;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private targetDisplay!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "LetterHuntScene" });
  }

  create() {
    this.add.rectangle(400, 250, 800, 500, 0x021526);
    this.add.rectangle(400, 75, 760, 1, 0xffffff, 0.08);

    this.roundText = this.add.text(40, 38, "1 / 8", {
      fontSize: "16px", color: "#ffffff50", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.add.text(400, 38, "Trouve toutes les lettres !", {
      fontSize: "20px", color: "#ffffff80", fontFamily: FONT,
    }).setOrigin(0.5);

    this.scoreText = this.add.text(760, 38, "0 pts", {
      fontSize: "18px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);

    // Target letter display
    this.add.text(60, 140, "Lettre :", {
      fontSize: "16px", color: "#ffffff60", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.targetDisplay = this.add.text(175, 140, "", {
      fontSize: "52px", color: "#01b273", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.progressText = this.add.text(400, 140, "", {
      fontSize: "17px", color: "#fbbf24", fontFamily: FONT,
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(680, 140, "", {
      fontSize: "20px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.loadRound();
  }

  private loadRound() {
    if (this.roundIndex >= ROUNDS.length) { this.endGame(); return; }
    this.locked = false;
    this.foundCount = 0;
    this.currentRound = ROUNDS[this.roundIndex];
    this.needed = this.currentRound.grid.filter(l => l === this.currentRound.target).length;
    this.roundIndex++;

    this.roundText.setText(`${this.roundIndex} / ${ROUNDS.length}`);
    this.targetDisplay.setText(this.currentRound.target);
    this.progressText.setText(`0 / ${this.needed} trouvée${this.needed > 1 ? "s" : ""}`);
    this.feedbackText.setText("");

    // Clear old tiles
    this.children.list
      .filter(c => c.getData?.("isTile"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.buildGrid();
  }

  private buildGrid() {
    const cols = 4;
    const startX = 155;
    const startY = 210;
    const gapX = 140;
    const gapY = 80;

    this.currentRound.grid.forEach((letter, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * gapX;
      const y = startY + row * gapY;
      const isTarget = letter === this.currentRound.target;

      const bg = this.add.rectangle(x, y, 110, 58, 0x1e3a5f, 1)
        .setStrokeStyle(2, 0x3b82f6, 0.4)
        .setInteractive({ useHandCursor: true })
        .setData("isTile", true)
        .setData("isTarget", isTarget)
        .setData("found", false);

      const label = this.add.text(x, y, letter, {
        fontSize: "28px", color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5).setData("isTile", true);

      bg.on("pointerover", () => {
        if (!bg.getData("found") && !this.locked) bg.setFillStyle(0x2d4a70);
      });
      bg.on("pointerout", () => {
        if (!bg.getData("found") && !this.locked) bg.setFillStyle(0x1e3a5f);
      });
      bg.on("pointerdown", () => {
        if (bg.getData("found") || this.locked) return;

        if (isTarget) {
          bg.setFillStyle(0x16a34a).setStrokeStyle(2, 0x4ade80);
          label.setColor("#ffffff");
          bg.setData("found", true);
          this.foundCount++;
          this.score += 10;
          this.scoreText.setText(`${this.score} pts`);
          this.progressText.setText(`${this.foundCount} / ${this.needed} trouvée${this.needed > 1 ? "s" : ""}`);

          if (this.foundCount >= this.needed) {
            this.locked = true;
            this.feedbackText.setColor("#4ade80").setText("Toutes trouvées !");
            this.time.delayedCall(1000, () => this.loadRound());
          }
        } else {
          // Wrong tap — flash red
          bg.setFillStyle(0xdc2626);
          this.time.delayedCall(400, () => {
            if (!bg.getData("found")) bg.setFillStyle(0x1e3a5f);
          });
          this.score = Math.max(0, this.score - 3);
          this.scoreText.setText(`${this.score} pts`);
          this.feedbackText.setColor("#f87171").setText(`"${letter}" ≠ "${this.currentRound.target}"`);
          this.time.delayedCall(700, () => this.feedbackText.setText(""));
        }
      });
    });
  }

  private endGame() {
    this.children.list
      .filter(c => c.getData?.("isTile"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.targetDisplay.setText("");
    this.progressText.setText("");
    this.feedbackText.setText("");

    this.add.text(400, 210, "Excellent !", {
      fontSize: "46px", color: "#01b273", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);
    this.add.text(400, 280, `Score : ${this.score} pts`, {
      fontSize: "28px", color: "#fbbf24", fontFamily: FONT,
    }).setOrigin(0.5);

    this.time.delayedCall(2200, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
