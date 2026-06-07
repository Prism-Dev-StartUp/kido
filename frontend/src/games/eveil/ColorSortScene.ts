import Phaser from "phaser";

interface Item { emoji: string; color: string }
interface Bucket { name: string; label: string; hex: number; light: number }

const ALL_ITEMS: Item[] = [
  { emoji: "🍎", color: "rouge" }, { emoji: "🍅", color: "rouge" },
  { emoji: "🌹", color: "rouge" }, { emoji: "❤️",  color: "rouge" },
  { emoji: "🫐", color: "bleu"  }, { emoji: "🐋",  color: "bleu"  },
  { emoji: "💧", color: "bleu"  }, { emoji: "🔷",  color: "bleu"  },
  { emoji: "🍃", color: "vert"  }, { emoji: "🐸",  color: "vert"  },
  { emoji: "🥦", color: "vert"  }, { emoji: "🌿",  color: "vert"  },
  { emoji: "🌻", color: "jaune" }, { emoji: "🍋",  color: "jaune" },
  { emoji: "⭐",  color: "jaune" }, { emoji: "🍌",  color: "jaune" },
];

const BUCKETS: Bucket[] = [
  { name: "rouge", label: "🧺 Rouge", hex: 0xe74c3c, light: 0xfce4e4 },
  { name: "bleu",  label: "🧺 Bleu",  hex: 0x3498db, light: 0xd5eaf8 },
  { name: "vert",  label: "🧺 Vert",  hex: 0x27ae60, light: 0xd5f0e0 },
  { name: "jaune", label: "🧺 Jaune", hex: 0xf1c40f, light: 0xfef9d5 },
];

const FONT = "'Poppins', sans-serif";

export default class ColorSortScene extends Phaser.Scene {
  private score = 0;
  private matched = 0;
  private total = 8;
  private scoreText!: Phaser.GameObjects.Text;
  private counterText!: Phaser.GameObjects.Text;
  private items: Item[] = [];

  constructor() {
    super({ key: "ColorSortScene" });
  }

  create() {
    // Background
    this.add.rectangle(400, 250, 800, 500, 0xfff9ec);

    // Title
    this.add.text(400, 32, "Glisse chaque objet dans le bon panier !", {
      fontSize: "20px", color: "#1c1d1f", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    // Score & counter
    this.scoreText = this.add.text(740, 32, "0 pts", {
      fontSize: "18px", color: "#f97316", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);

    this.counterText = this.add.text(60, 32, "0 / 8", {
      fontSize: "16px", color: "#9b9b9b", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.createBuckets();

    // Pick 8 random items (2 per color)
    this.items = Phaser.Utils.Array.Shuffle(
      ALL_ITEMS.filter((_, i) => i % 4 < 2).concat(ALL_ITEMS.filter((_, i) => i % 4 >= 2))
    ).slice(0, this.total) as Item[];

    this.spawnItems();
    this.setupDrag();
  }

  private createBuckets() {
    BUCKETS.forEach((b, i) => {
      const x = 100 + i * 200;
      const y = 430;

      // Bucket background
      const bg = this.add.rectangle(x, y, 160, 80, b.light)
        .setStrokeStyle(3, b.hex);
      bg.setData("bucketColor", b.name);
      bg.setData("isBucket", true);

      // Bucket label
      this.add.text(x, y, b.label, {
        fontSize: "16px", color: "#1c1d1f", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5);
    });
  }

  private spawnItems() {
    const positions = [
      { x: 120, y: 160 }, { x: 260, y: 200 }, { x: 400, y: 150 },
      { x: 540, y: 190 }, { x: 670, y: 160 }, { x: 160, y: 290 },
      { x: 400, y: 300 }, { x: 620, y: 280 },
    ];

    this.items.forEach((item, i) => {
      const pos = positions[i] || { x: Phaser.Math.Between(120, 680), y: Phaser.Math.Between(120, 310) };
      const text = this.add.text(pos.x, pos.y, item.emoji, {
        fontSize: "44px",
      })
        .setOrigin(0.5)
        .setInteractive({ draggable: true, useHandCursor: true })
        .setData("itemColor", item.color)
        .setData("startX", pos.x)
        .setData("startY", pos.y);

      this.input.setDraggable(text);
    });
  }

  private setupDrag() {
    this.input.on("drag", (_p: unknown, obj: Phaser.GameObjects.Text, dx: number, dy: number) => {
      obj.setPosition(dx, dy);
    });

    this.input.on("dragend", (_p: unknown, obj: Phaser.GameObjects.Text) => {
      const bucket = this.children.list.find((c) => {
        if (!c.getData?.("isBucket")) return false;
        const rect = c as Phaser.GameObjects.Rectangle;
        return Phaser.Math.Distance.Between(obj.x, obj.y, rect.x, rect.y) < 85;
      }) as Phaser.GameObjects.Rectangle | undefined;

      if (bucket && bucket.getData("bucketColor") === obj.getData("itemColor")) {
        // Correct
        this.score += 10;
        this.matched++;
        this.scoreText.setText(`${this.score} pts`);
        this.counterText.setText(`${this.matched} / ${this.total}`);
        this.showPop(obj.x, obj.y, "✓", "#16a34a");
        obj.destroy();
        if (this.matched >= this.total) {
          this.time.delayedCall(600, () => this.endGame());
        }
      } else {
        // Wrong — snap back
        this.showPop(obj.x, obj.y, "✗", "#dc2626");
        obj.setPosition(obj.getData("startX"), obj.getData("startY"));
      }
    });
  }

  private showPop(x: number, y: number, msg: string, color: string) {
    const t = this.add.text(x, y - 30, msg, {
      fontSize: "32px", color, fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t, y: y - 80, alpha: 0, duration: 700,
      onComplete: () => t.destroy(),
    });
  }

  private endGame() {
    // Overlay
    this.add.rectangle(400, 250, 800, 500, 0x000000, 0.55);
    this.add.text(400, 190, "Bravo !", {
      fontSize: "52px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);
    this.add.text(400, 270, `Score : ${this.score} / 80`, {
      fontSize: "28px", color: "#ffffff", fontFamily: FONT,
    }).setOrigin(0.5);

    this.time.delayedCall(2200, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
