import Phaser from "phaser";

const SHAPES = ["circle", "square", "triangle", "star"];

export default class ShapeMatchScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private maxRounds = 5;
  private targetShape = "";
  private targetText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "ShapeMatchScene" });
  }

  create() {
    this.add.text(400, 30, "Trouve la bonne forme !", {
      fontSize: "28px",
      color: "#4a3728",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.targetText = this.add.text(400, 80, "", {
      fontSize: "22px",
      color: "#8e44ad",
    }).setOrigin(0.5);

    this.nextRound();
  }

  private nextRound() {
    if (this.round >= this.maxRounds) {
      this.endGame();
      return;
    }
    this.round++;
    this.children.list
      .filter((c) => c.getData?.("isShape"))
      .forEach((c) => (c as Phaser.GameObjects.GameObject).destroy());

    this.targetShape = Phaser.Utils.Array.GetRandom(SHAPES);
    this.targetText.setText(`Clique sur : ${this.targetShape}`);

    const shuffled = Phaser.Utils.Array.Shuffle([...SHAPES]);
    shuffled.forEach((shape, i) => {
      const x = 130 + i * 180;
      const btn = this.add.text(x, 320, shape, {
        fontSize: "20px",
        backgroundColor: "#ecf0f1",
        padding: { x: 16, y: 10 },
        color: "#2c3e50",
      }).setOrigin(0.5).setInteractive().setData("isShape", true).setData("shape", shape);

      btn.on("pointerdown", () => {
        if (shape === this.targetShape) {
          this.score += 20;
          this.showFeedback(x, 250, "✓", "#27ae60");
        } else {
          this.showFeedback(x, 250, "✗", "#e74c3c");
        }
        this.time.delayedCall(600, () => this.nextRound());
      });
    });
  }

  private showFeedback(x: number, y: number, text: string, color: string) {
    const fb = this.add.text(x, y, text, { fontSize: "40px", color }).setOrigin(0.5);
    this.time.delayedCall(500, () => fb.destroy());
  }

  private endGame() {
    this.add.text(400, 300, `Félicitations ! Score: ${this.score}`, {
      fontSize: "32px",
      color: "#27ae60",
    }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
