"""Corrige les phaser_scene_key pour les jeux qui utilisaient une mauvaise scène.
Run: python update_scene_keys.py  (depuis backend/ avec venv activé)
"""
from sqlmodel import Session, select
from app.core.database import engine
from app.models.game import Game

UPDATES = {
    "La chasse aux lettres": "LetterHuntScene",
    "Les additions":         "AdditionScene",
    "Tour du monde":         "WorldFlagsScene",
}

with Session(engine) as session:
    updated = 0
    for title, new_key in UPDATES.items():
        game = session.exec(select(Game).where(Game.title == title)).first()
        if game:
            old = game.phaser_scene_key
            game.phaser_scene_key = new_key
            session.add(game)
            print(f"  '{title}' : {old} → {new_key}")
            updated += 1
        else:
            print(f"  ⚠ Jeu non trouvé : '{title}'")
    session.commit()
    print(f"\n✓ {updated} jeu(x) mis à jour.")
