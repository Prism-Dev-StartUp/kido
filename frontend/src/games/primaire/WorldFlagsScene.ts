import Phaser from "phaser";

interface Country { name: string; flag: string; continent: string }

const COUNTRIES: Country[] = [
  { name: "France",      flag: "🇫🇷", continent: "Europe" },
  { name: "Allemagne",   flag: "🇩🇪", continent: "Europe" },
  { name: "Espagne",     flag: "🇪🇸", continent: "Europe" },
  { name: "Italie",      flag: "🇮🇹", continent: "Europe" },
  { name: "Portugal",    flag: "🇵🇹", continent: "Europe" },
  { name: "Royaume-Uni", flag: "🇬🇧", continent: "Europe" },
  { name: "Japon",       flag: "🇯🇵", continent: "Asie" },
  { name: "Chine",       flag: "🇨🇳", continent: "Asie" },
  { name: "Inde",        flag: "🇮🇳", continent: "Asie" },
  { name: "Corée",       flag: "🇰🇷", continent: "Asie" },
  { name: "USA",         flag: "🇺🇸", continent: "Amériques" },
  { name: "Canada",      flag: "🇨🇦", continent: "Amériques" },
  { name: "Brésil",      flag: "🇧🇷", continent: "Amériques" },
  { name: "Mexique",     flag: "🇲🇽", continent: "Amériques" },
  { name: "Maroc",       flag: "🇲🇦", continent: "Afrique" },
  { name: "Algérie",     flag: "🇩🇿", continent: "Afrique" },
  { name: "Égypte",      flag: "🇪🇬", continent: "Afrique" },
  { name: "Sénégal",     flag: "🇸🇳", continent: "Afrique" },
  { name: "Australie",   flag: "🇦🇺", continent: "Océanie" },
  { name: "Russie",      flag: "🇷🇺", continent: "Europe" },
];

const FONT = "'Poppins', sans-serif";
const BTN_POSITIONS = [
  { x: 130, y: 370 }, { x: 400, y: 370 }, { x: 670, y: 370 },
  { x: 130, y: 445 }, { x: 400, y: 445 }, { x: 670, y: 445 },
];

type Mode = "flagToName" | "nameToFlag";

export default class WorldFlagsScene extends Phaser.Scene {
  private score = 0;
  private roundIndex = 0;
  private rounds: Country[] = [];
  private locked = false;
  private mode: Mode = "flagToName";
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private questionDisplay!: Phaser.GameObjects.Text;
  private subText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "WorldFlagsScene" });
  }

  create() {
    this.rounds = Phaser.Utils.Array.Shuffle([...COUNTRIES]).slice(0, 8) as Country[];

    this.add.rectangle(400, 250, 800, 500, 0x021526);
    this.add.rectangle(400, 75, 760, 1, 0xffffff, 0.08);

    this.roundText = this.add.text(40, 38, "1 / 8", {
      fontSize: "16px", color: "#ffffff50", fontFamily: FONT,
    }).setOrigin(0, 0.5);

    this.add.text(400, 38, "Géographie du monde", {
      fontSize: "19px", color: "#ffffff80", fontFamily: FONT,
    }).setOrigin(0.5);

    this.scoreText = this.add.text(760, 38, "0 pts", {
      fontSize: "18px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(1, 0.5);

    this.subText = this.add.text(400, 120, "", {
      fontSize: "17px", color: "#ffffff50", fontFamily: FONT,
    }).setOrigin(0.5);

    this.questionDisplay = this.add.text(400, 220, "", {
      fontSize: "90px",
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(400, 310, "", {
      fontSize: "20px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5);

    this.nextRound();
  }

  private nextRound() {
    if (this.roundIndex >= this.rounds.length) { this.endGame(); return; }
    this.locked = false;
    const country = this.rounds[this.roundIndex];
    this.roundIndex++;
    this.roundText.setText(`${this.roundIndex} / ${this.rounds.length}`);
    this.feedbackText.setText("");

    // Alternate modes
    this.mode = this.roundIndex % 2 === 1 ? "flagToName" : "nameToFlag";

    // Clear buttons
    this.children.list
      .filter(c => c.getData?.("isBtn"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    if (this.mode === "flagToName") {
      this.subText.setText("De quel pays est ce drapeau ?");
      this.questionDisplay.setFontSize("90px").setText(country.flag);
    } else {
      this.subText.setText("Clique sur le drapeau de ce pays :");
      this.questionDisplay.setFontSize("32px").setStyle({ fontStyle: "bold", color: "#ffffff" }).setText(country.name);
    }

    // Pick 3 distractors from same continent when possible
    const sameContinent = COUNTRIES.filter(c => c.continent === country.continent && c.name !== country.name);
    const others = Phaser.Utils.Array.Shuffle([
      ...sameContinent,
      ...COUNTRIES.filter(c => c.name !== country.name && !sameContinent.includes(c)),
    ]).slice(0, 5) as Country[];

    const options = Phaser.Utils.Array.Shuffle([country, ...others]) as Country[];

    options.forEach((opt, i) => {
      const pos = BTN_POSITIONS[i];
      const label = this.mode === "flagToName" ? opt.name : opt.flag;
      const fontSize = this.mode === "flagToName" ? "15px" : "36px";

      const bg = this.add.rectangle(pos.x, pos.y, 190, 52, 0x1e3a5f)
        .setStrokeStyle(2, 0x3b82f6, 0.4)
        .setInteractive({ useHandCursor: true })
        .setData("isBtn", true);

      this.add.text(pos.x, pos.y, label, {
        fontSize, color: "#ffffff", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5).setData("isBtn", true);

      bg.on("pointerover", () => { if (!this.locked) bg.setFillStyle(0x2d4a70); });
      bg.on("pointerout",  () => { if (!this.locked) bg.setFillStyle(0x1e3a5f); });
      bg.on("pointerdown", () => {
        if (this.locked) return;
        this.locked = true;
        if (opt.name === country.name) {
          bg.setFillStyle(0x16a34a).setStrokeStyle(2, 0x4ade80);
          this.score += 12;
          this.scoreText.setText(`${this.score} pts`);
          this.feedbackText.setColor("#4ade80").setText(`✓ ${country.flag} ${country.name} (${country.continent})`);
        } else {
          bg.setFillStyle(0xdc2626).setStrokeStyle(2, 0xf87171);
          this.feedbackText.setColor("#f87171").setText(`C'était ${country.flag} ${country.name}`);
        }
        this.time.delayedCall(1100, () => this.nextRound());
      });
    });
  }

  private endGame() {
    this.children.list
      .filter(c => c.getData?.("isBtn"))
      .forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    this.questionDisplay.setText("");
    this.subText.setText("");
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
