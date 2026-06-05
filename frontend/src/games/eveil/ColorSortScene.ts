import Phaser from "phaser";

const COLORS = [
  { name: "rouge", hex: 0xe74c3c },
  { name: "bleu", hex: 0x3498db },
  { name: "vert", hex: 0x2ecc71 },
  { name: "jaune", hex: 0xf1c40f },
];

export default class ColorSortScene extends Phaser.Scene {
  private score = 0;
  private total = 6;
  private matched = 0;

  constructor() {
    super({ key: "ColorSortScene" });
  }

  create() {
    this.add.text(400, 30, "Trie les couleurs !", {
      fontSize: "28px",
      color: "#4a3728",
      fontFamily: "Arial Rounded MT Bold, Arial",
    }).setOrigin(0.5);

    this.createBuckets();
    this.createDraggableItems();
  }

  private createBuckets() {
    COLORS.forEach((color, i) => {
      const x = 120 + i * 180;
      const bucket = this.add.rectangle(x, 500, 100, 80, color.hex, 0.4)
        .setStrokeStyle(3, color.hex);
      bucket.setData("color", color.name);
      this.add.text(x, 500, color.name, { fontSize: "14px", color: "#333" }).setOrigin(0.5);
    });
  }

  private createDraggableItems() {
    for (let i = 0; i < this.total; i++) {
      const color = Phaser.Utils.Array.GetRandom(COLORS);
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 320);
      const circle = this.add.circle(x, y, 30, color.hex).setInteractive({ draggable: true });
      circle.setData("color", color.name);
    }

    this.input.on("dragend", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Arc) => {
      const bucket = this.getBucketUnder(obj.x, obj.y);
      if (bucket && bucket.getData("color") === obj.getData("color")) {
        obj.destroy();
        this.score += 10;
        this.matched++;
        if (this.matched >= this.total) this.endGame();
      }
    });
  }

  private getBucketUnder(x: number, y: number) {
    return this.children.list.find((c) => {
      if (!(c instanceof Phaser.GameObjects.Rectangle)) return false;
      return Phaser.Math.Distance.Between(x, y, c.x, c.y) < 70;
    }) as Phaser.GameObjects.Rectangle | undefined;
  }

  private endGame() {
    this.add.text(400, 300, `Bravo ! Score: ${this.score}`, {
      fontSize: "36px",
      color: "#27ae60",
    }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
