import Phaser from "phaser";

let gameInstance: Phaser.Game | null = null;

export function launchGame(containerId: string, sceneKey: string, onComplete: (score: number) => void) {
  destroyGame();

  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    width: 800,
    height: 600,
    backgroundColor: "#fef9f0",
    scene: getScene(sceneKey, onComplete),
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  });
}

export function destroyGame() {
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }
}

function getScene(sceneKey: string, onComplete: (score: number) => void) {
  // Registry of all game scenes — add new scenes here
  const registry: Record<string, unknown> = {
    ColorSortScene: () => import("./eveil/ColorSortScene").then((m) => m.default),
    ShapeMatchScene: () => import("./maternelle/ShapeMatchScene").then((m) => m.default),
    NumberCountScene: () => import("./primaire/NumberCountScene").then((m) => m.default),
  };

  const loader = registry[sceneKey];
  if (!loader) {
    console.warn(`Scene "${sceneKey}" not registered`);
    return [];
  }

  // Scenes receive onComplete via scene data
  return [{ key: sceneKey, onComplete }];
}
