import Phaser from "phaser";

export default class NumberCountScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private maxRounds = 6;
  private correctAnswer = 0;
  private questionText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "NumberCountScene" });
  }

  create() {
    this.add.text(400, 30, "Compte les objets !", {
      fontSize: "28px",
      color: "#4a3728",
    }).setOrigin(0.5);

    this.scoreText = this.add.text(700, 30, "Score: 0", {
      fontSize: "20px",
      color: "#7f8c8d",
    }).setOrigin(1, 0.5);

    this.questionText = this.add.text(400, 100, "", {
      fontSize: "22px",
      color: "#2c3e50",
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
      .filter((c) => c.getData?.("isOption") || c.getData?.("isItem"))
      .forEach((c) => (c as Phaser.GameObjects.GameObject).destroy());

    const count = Phaser.Math.Between(1, 12);
    this.correctAnswer = count;
    this.questionText.setText(`Combien y a-t-il d'étoiles ?`);

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(80, 720);
      const y = Phaser.Math.Between(150, 340);
      this.add.text(x, y, "⭐", { fontSize: "32px" }).setData("isItem", true);
    }

    const options = Phaser.Utils.Array.Shuffle([
      count,
      count + Phaser.Math.Between(1, 3),
      Math.max(1, count - Phaser.Math.Between(1, 3)),
      count + Phaser.Math.Between(4, 6),
    ]).slice(0, 4);

    options.forEach((opt, i) => {
      const x = 130 + i * 180;
      const btn = this.add.text(x, 460, String(opt), {
        fontSize: "28px",
        backgroundColor: "#3498db",
        padding: { x: 20, y: 12 },
        color: "#fff",
      }).setOrigin(0.5).setInteractive().setData("isOption", true);

      btn.on("pointerdown", () => {
        if (opt === this.correctAnswer) {
          this.score += 15;
          this.scoreText.setText(`Score: ${this.score}`);
          this.showFeedback("Correct !", "#27ae60");
        } else {
          this.showFeedback(`C'était ${count}`, "#e74c3c");
        }
        this.time.delayedCall(800, () => this.nextRound());
      });
    });
  }

  private showFeedback(msg: string, color: string) {
    const fb = this.add.text(400, 390, msg, { fontSize: "26px", color }).setOrigin(0.5);
    this.time.delayedCall(700, () => fb.destroy());
  }

  private endGame() {
    this.add.text(400, 300, `Super ! Score final: ${this.score}`, {
      fontSize: "32px",
      color: "#27ae60",
    }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
