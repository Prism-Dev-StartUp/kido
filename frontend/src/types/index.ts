export type Cycle = "eveil" | "maternelle" | "primaire";

export interface Child {
  id: number;
  name: string;
  birth_year: number;
  avatar: string;
  gender: string | null;
  preferred_cycle: string | null;
  cycle: Cycle;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  cycle: Cycle;
  icon: string;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  cycle: Cycle;
  thumbnail: string;
  phaser_scene_key: string;
  min_age: number;
  max_age: number;
  difficulty: 1 | 2 | 3;
  skill: Skill;
}

export interface Progress {
  game_id: number;
  score: number;
  completed: boolean;
  attempts: number;
}
