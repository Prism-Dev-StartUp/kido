import Phaser from "phaser";

interface ShapeDef { key: string; label: string; color: number }

const SHAPES: ShapeDef[] = [
  { key: "circle",    label: "le cercle",    color: 0x3b82f6 },
  { key: "square",    label: "le carré",     color: 0xe74c3c },
  { key: "triangle",  label: "le triangle",  color: 0x27ae60 },
  { key: "rectangle", label: "le rectangle", color: 0xf97316 },
  { key: "diamond",   label: "le losange",   color: 0x8b5cf6 },
  { key: "star",      label: "l'étoile",     color: 0xf4c150 },
];

const FONT = "'Poppins', sans-serif";
const POSITIONS = [
  { x: 130, y: 260 }, { x: 310, y: 260 },
  { x: 490, y: 260 }, { x: 670, y: 260 },
];

function starPoints(cx: number, cy: number, outer: number, inner: number): { x: number; y: number }[] {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return pts;
}

export default class ShapeMatchScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private maxRounds = 8;
  private target = "";
  private instructionText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private locked = false;

  constructor() {
    super({ key: "ShapeMatchScene" });
  }

  create() {
    this.add.rectangle(400, 250, 800, 500, 0x021526);

    // Header
    this.roundText = this.add.text(40, 38, "1 / 8", {
      fontSize: "16px", color: "#ffffff50", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.instructionText = this.add.text(400, 38, "", {
      fontSize: "22px", color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.scoreText = this.add.text(760, 38, "0 pts", {
      fontSize: "18px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);

    this.add.rectangle(400, 75, 760, 1, 0xffffff, 0.08);

    this.feedbackText = this.add.text(400, 145, "", {
      fontSize: "20px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.add.text(400, 430, "Clique sur la bonne forme !", {
      fontSize: "15px", color: "#ffffff40", fontFamily: FONT,
    }).setOrigin(0.5);

    this.nextRound();
  }

  private nextRound() {
    if (this.round >= this.maxRounds) { this.endGame(); return; }
    this.locked = false;
    this.round++;
    this.roundText.setText(`${this.round} / ${this.maxRounds}`);
    this.feedbackText.setText("");

    // Destroy old shapes
    this.children.list
      .filter(c => c.getData?.("isShape"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    // Pick 4 distinct shapes
    const chosen = Phaser.Utils.Array.Shuffle([...SHAPES]).slice(0, 4) as ShapeDef[];
    this.target = chosen[Phaser.Math.Between(0, 3)].key;
    const targetDef = SHAPES.find(s => s.key === this.target)!;
    this.instructionText.setText(`Clique sur ${targetDef.label}`);

    chosen.forEach((shape, i) => {
      const { x, y } = POSITIONS[i];
      this.drawShape(shape, x, y);
    });
  }

  private drawShape(shape: ShapeDef, x: number, y: number) {
    const g = this.add.graphics().setData("isShape", true).setData("shapeKey", shape.key);
    const hitZone = this.add.zone(x, y, 130, 130)
      .setInteractive({ useHandCursor: true })
      .setData("isShape", true)
      .setData("shapeKey", shape.key);

    g.fillStyle(shape.color, 1);
    g.lineStyle(3, 0xffffff, 0.2);

    switch (shape.key) {
      case "circle":
        g.fillCircle(x, y, 52);
        g.strokeCircle(x, y, 52);
        break;
      case "square":
        g.fillRect(x - 50, y - 50, 100, 100);
        g.strokeRect(x - 50, y - 50, 100, 100);
        break;
      case "triangle":
        g.fillTriangle(x, y - 56, x - 52, y + 44, x + 52, y + 44);
        g.strokeTriangle(x, y - 56, x - 52, y + 44, x + 52, y + 44);
        break;
      case "rectangle":
        g.fillRect(x - 68, y - 34, 136, 68);
        g.strokeRect(x - 68, y - 34, 136, 68);
        break;
      case "diamond":
        g.fillPoints([
          { x, y: y - 55 }, { x: x + 40, y }, { x, y: y + 55 }, { x: x - 40, y },
        ] as unknown as Phaser.Math.Vector2[], true);
        g.strokePoints([
          { x, y: y - 55 }, { x: x + 40, y }, { x, y: y + 55 }, { x: x - 40, y },
        ] as unknown as Phaser.Math.Vector2[], true);
        break;
      case "star":
        g.fillPoints(starPoints(x, y, 52, 24) as unknown as Phaser.Math.Vector2[], true);
        g.strokePoints(starPoints(x, y, 52, 24) as unknown as Phaser.Math.Vector2[], true);
        break;
    }

    hitZone.on("pointerover", () => { g.setAlpha(0.75); });
    hitZone.on("pointerout",  () => { g.setAlpha(1); });
    hitZone.on("pointerdown", () => {
      if (this.locked) return;
      this.locked = true;
      const correct = shape.key === this.target;
      if (correct) {
        this.score += 12;
        this.scoreText.setText(`${this.score} pts`);
        g.setAlpha(0.4);
        this.feedbackText.setColor("#4ade80").setText("Correct !");
      } else {
        g.setAlpha(0.3);
        const correctDef = SHAPES.find(s => s.key === this.target)!;
        this.feedbackText.setColor("#f87171").setText(`C'était ${correctDef.label}`);
      }
      this.time.delayedCall(900, () => this.nextRound());
    });
  }

  private endGame() {
    this.children.list
      .filter(c => c.getData?.("isShape"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.instructionText.setText("");
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
