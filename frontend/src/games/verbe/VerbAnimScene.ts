import Phaser from "phaser";

const FONT = "'Nunito', sans-serif";
const BG = 0x1a0000;

interface SentenceData {
  words: { text: string; isVerb: boolean }[];
}

const SENTENCES: SentenceData[] = [
  { words: [{ text:"Le",isVerb:false},{ text:"chat",isVerb:false},{ text:"dort",isVerb:true},{ text:"sur",isVerb:false},{ text:"le",isVerb:false},{ text:"canapé",isVerb:false}] },
  { words: [{ text:"La",isVerb:false},{ text:"fille",isVerb:false},{ text:"chante",isVerb:true},{ text:"une",isVerb:false},{ text:"chanson",isVerb:false}] },
  { words: [{ text:"Mon",isVerb:false},{ text:"frère",isVerb:false},{ text:"mange",isVerb:true},{ text:"une",isVerb:false},{ text:"pomme",isVerb:false}] },
  { words: [{ text:"Le",isVerb:false},{ text:"soleil",isVerb:false},{ text:"brille",isVerb:true},{ text:"dans",isVerb:false},{ text:"le",isVerb:false},{ text:"ciel",isVerb:false}] },
  { words: [{ text:"Les",isVerb:false},{ text:"enfants",isVerb:false},{ text:"jouent",isVerb:true},{ text:"dans",isVerb:false},{ text:"la",isVerb:false},{ text:"cour",isVerb:false}] },
  { words: [{ text:"Elle",isVerb:false},{ text:"lit",isVerb:true},{ text:"un",isVerb:false},{ text:"beau",isVerb:false},{ text:"livre",isVerb:false}] },
  { words: [{ text:"Le",isVerb:false},{ text:"vent",isVerb:false},{ text:"souffle",isVerb:true},{ text:"fort",isVerb:false},{ text:"ce",isVerb:false},{ text:"soir",isVerb:false}] },
  { words: [{ text:"Nous",isVerb:false},{ text:"marchons",isVerb:true},{ text:"vers",isVerb:false},{ text:"l'école",isVerb:false}] },
];

export default class VerbAnimScene extends Phaser.Scene {
  private score = 0;
  private round = 0;
  private locked = false;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private feedback!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;

  constructor() { super({ key: "VerbAnimScene" }); }

  create() {
    this.add.rectangle(400, 250, 800, 500, BG);

    this.roundText = this.add.text(30, 32, "", { fontSize: "15px", color: "#fca5a5", fontFamily: FONT }).setOrigin(0, 0.5);
    this.add.text(400, 32, "Trouve le verbe", { fontSize: "20px", color: "#fecaca", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.scoreText = this.add.text(770, 32, "0 pts", { fontSize: "17px", color: "#fbbf24", fontStyle: "bold", fontFamily: FONT }).setOrigin(1, 0.5);
    this.add.rectangle(400, 62, 760, 1, 0xffffff, 0.07);

    this.add.text(400, 110, "Clique sur le mot qui exprime une action ou un état", {
      fontSize: "16px", color: "#fca5a5", fontFamily: FONT,
    }).setOrigin(0.5);

    this.feedback = this.add.text(400, 420, "", { fontSize: "18px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.hint = this.add.text(400, 455, "", { fontSize: "14px", color: "#f87171", fontFamily: FONT }).setOrigin(0.5);

    this.showRound();
  }

  private showRound() {
    if (this.round >= SENTENCES.length) { this.endGame(); return; }
    this.locked = false;
    this.feedback.setText("");
    this.hint.setText("Le verbe dit ce que fait ou est le sujet.");

    this.children.list.filter(c => c.getData?.("isWord")).forEach(c => (c as Phaser.GameObjects.GameObject).destroy());

    const sentence = SENTENCES[this.round];
    this.roundText.setText(`${this.round + 1} / ${SENTENCES.length}`);

    let x = 60, y = 260;
    sentence.words.forEach(w => {
      const wordWidth = w.text.length * 18 + 24;
      if (x + wordWidth > 740) { x = 60; y += 60; }

      const bg = this.add.rectangle(x + wordWidth / 2, y, wordWidth, 48, 0x3f0000)
        .setInteractive({ useHandCursor: true })
        .setData("isWord", true)
        .setData("isVerb", w.isVerb);

      const txt = this.add.text(x + wordWidth / 2, y, w.text, {
        fontSize: "26px", color: "#fecaca", fontStyle: w.isVerb ? "bold" : "normal", fontFamily: FONT,
      }).setOrigin(0.5).setData("isWord", true);

      bg.on("pointerover", () => { if (!bg.getData("clicked")) bg.setFillStyle(0x7f1d1d); });
      bg.on("pointerout",  () => { if (!bg.getData("clicked")) bg.setFillStyle(0x3f0000); });
      bg.on("pointerdown", () => this.checkWord(bg, txt, w.isVerb));

      x += wordWidth + 10;
    });
  }

  private checkWord(bg: Phaser.GameObjects.Rectangle, txt: Phaser.GameObjects.Text, isVerb: boolean) {
    if (this.locked || bg.getData("clicked")) return;
    bg.setData("clicked", true);
    if (isVerb) {
      this.locked = true;
      bg.setFillStyle(0x14532d);
      txt.setColor("#4ade80");
      this.score += 12;
      this.scoreText.setText(`${this.score} pts`);
      this.feedback.setColor("#4ade80").setText("C'est bien le verbe !");
      this.hint.setText("");
      this.time.delayedCall(1100, () => { this.round++; this.showRound(); });
    } else {
      bg.setFillStyle(0x7f1d1d);
      txt.setColor("#f87171");
      this.feedback.setColor("#f87171").setText("Ce n'est pas un verbe — essaie encore.");
      this.time.delayedCall(700, () => {
        bg.setFillStyle(0x3f0000).setData("clicked", false);
        txt.setColor("#fecaca");
        this.feedback.setText("");
      });
    }
  }

  private endGame() {
    this.add.rectangle(400, 250, 800, 500, BG);
    this.add.text(400, 210, "Tu maîtrises le verbe !", { fontSize: "38px", color: "#4ade80", fontStyle: "bold", fontFamily: FONT }).setOrigin(0.5);
    this.add.text(400, 275, `Score : ${this.score} / ${SENTENCES.length * 12}`, { fontSize: "24px", color: "#fbbf24", fontFamily: FONT }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      (this.game as unknown as { onComplete?: (s: number) => void }).onComplete?.(this.score);
    });
  }
}
