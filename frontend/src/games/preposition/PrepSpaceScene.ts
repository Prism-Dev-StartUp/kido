import Phaser from "phaser";

const FONT = "'Nunito', sans-serif";
const BG = 0x052e16;

interface Round {
  instruction: string;
  scene: { cat: { x: number; y: number }; box: { x: number; y: number } };
  answer: string;
  options: string[];
}

const ROUNDS: Round[] = [
  { instruction: "La balle est ___ la boîte.", answer: "dans",       options: ["dans","sur","sous","devant"],
    scene: { cat: { x: 400, y: 260 }, box: { x: 400, y: 260 } } },
  { instruction: "Le chat est ___ la boîte.",  answer: "sur",        options: ["dans","sur","sous","à côté"],
    scene: { cat: { x: 400, y: 220 }, box: { x: 400, y: 270 } } },
  { instruction: "Le livre est ___ la table.", answer: "sous",       options: ["sur","sous","dans","devant"],
    scene: { cat: { x: 400, y: 305 }, box: { x: 400, y: 270 } } },
  { instruction: "Le sac est ___ la chaise.",  answer: "devant",     options: ["derrière","devant","sous","dans"],
    scene: { cat: { x: 340, y: 260 }, box: { x: 420, y: 260 } } },
  { instruction: "Le manteau est ___ la porte.",answer: "derrière",  options: ["devant","derrière","sur","dans"],
    scene: { cat: { x: 450, y: 260 }, box: { x: 360, y: 260 } } },
  { instruction: "Le chat joue ___ le chien.", answer: "avec",       options: ["avec","sans","devant","sous"],
    scene: { cat: { x: 350, y: 260 }, box: { x: 450, y: 260 } } },
  { instruction: "Le stylo est ___ le bureau.",answer: "à côté de",  options: ["sur","à côté de","dans","sous"],
    scene: { cat: { x: 480, y: 260 }, box: { x: 370, y: 260 } } },
  { instruction: "Il va ___ l'école.",         answer: "à",          options: ["à","de","dans","pour"],
    scene: { cat: { x: 320, y: 260 }, box: { x: 480, y: 260 } } },
];

const BTN_POS = [
  { x: 200, y: 400 }, { x: 400, y: 400 },
  { x: 200, y: 450 }, { x: 400, y: 450 },
];

export default class PrepSpaceScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private locked = false;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private feedback!: Phaser.GameObjects.Text;
  private catEmoji!: Phaser.GameObjects.Text;
  private boxEmoji!: Phaser.GameObjects.Text;

  constructor() { super({ key: "PrepSpaceScene" }); }

  create() {
    this.add.rectangle(400, 250, 800, 500, BG);

    this.roundText = this.add.text(30, 32, "", { fontSize: "15px", color: "#86efac", fontFamily: FONT }).setOrigin(0, 0.5);
    this.add.text(400, 32, "Choisis la bonne préposition", { fontSize: "20px", color: "#dcfce7", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.scoreText = this.add.text(770, 32, "0 pts", { fontSize: "17px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT }).setOrigin(1, 0.5);
    this.add.rectangle(400, 62, 760, 1, 0xffffff, 0.07);

    this.catEmoji = this.add.text(400, 200, "🐱", { fontSize: "48px", fontFamily: FONT }).setOrigin(0.5);
    this.boxEmoji = this.add.text(400, 270, "📦", { fontSize: "52px", fontFamily: FONT }).setOrigin(0.5);

    this.feedback = this.add.text(610, 425, "", { fontSize: "17px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);

    this.showRound();
  }

  private showRound() {
    if (this.round >= ROUNDS.length) { this.endGame(); return; }
    this.locked = false;

    this.children.list.filter(c => c.getData?.("isBtn")).forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    const r = ROUNDS[this.round];
    this.roundText.setText(`${this.round + 1} / ${ROUNDS.length}`);
    this.feedback.setText("");

    // Position emojis based on scene data
    this.catEmoji.setPosition(r.scene.cat.x, r.scene.cat.y);
    this.boxEmoji.setPosition(r.scene.box.x, r.scene.box.y);

    // Instruction
    this.children.list.filter(c => c.getData?.("isInstruction")).forEach(c => (c as Phaser.GameObjects.GameObject).destroy());
    this.add.text(400, 145, r.instruction, {
      fontSize: "22px", color: "#dcfce7", fontStyle: "bold", fontFamily: FONT,
    }).setOrigin(0.5).setData("isInstruction", true).setData("isBtn", false);

    // Option buttons
    r.options.forEach((opt, i) => {
      const pos = BTN_POS[i];
      const w = Math.max(opt.length * 16 + 40, 140);
      const bg = this.add.rectangle(pos.x, pos.y, w, 40, 0x14532d)
        .setInteractive({ useHandCursor: true })
        .setData("isBtn", true);
      const lbl = this.add.text(pos.x, pos.y, opt, {
        fontSize: "18px", color: "#dcfce7", fontStyle: "bold", fontFamily: FONT,
      }).setOrigin(0.5).setData("isBtn", true);

      bg.on("pointerover", () => { if (!bg.getData("clicked")) bg.setFillStyle(0x166534); });
      bg.on("pointerout",  () => { if (!bg.getData("clicked")) bg.setFillStyle(0x14532d); });
      bg.on("pointerdown", () => this.checkAnswer(bg, lbl, opt, r.answer));
    });
  }

  private checkAnswer(bg: Phaser.GameObjects.Rectangle, lbl: Phaser.GameObjects.Text, opt: string, answer: string) {
    if (this.locked || bg.getData("clicked")) return;
    bg.setData("clicked", true);
    if (opt === answer) {
      this.locked = true;
      bg.setFillStyle(0x166534);
      lbl.setColor("#4ade80");
      this.score += 12;
      this.scoreText.setText(`${this.score} pts`);
      this.feedback.setColor("#4ade80").setText(`"${answer}" — correct !`);
      this.time.delayedCall(1100, () => { this.round++; this.showRound(); });
    } else {
      bg.setFillStyle(0x450a0a);
      lbl.setColor("#f87171");
      this.feedback.setColor("#f87171").setText(`Pas tout à fait… essaie encore.`);
      this.time.delayedCall(700, () => {
        bg.setFillStyle(0x14532d).setData("clicked", false);
        lbl.setColor("#dcfce7");
        this.feedback.setText("");
      });
    }
  }

  private endGame() {
    this.add.rectangle(400, 250, 800, 500, BG);
    this.add.text(400, 210, "Les prépositions n'ont plus de secrets !", {
      fontSize: "30px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT, wordWrap: { width: 600 },
    }).setOrigin(0.5);
    this.add.text(400, 285, `Score : ${this.score} / ${ROUNDS.length * 12}`, { fontSize: "24px", color: "#fbbf24", fontFamily: FONT }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
