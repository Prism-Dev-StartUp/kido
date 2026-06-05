"""Run: python seed.py  (from backend/ with venv activated)"""
from sqlmodel import Session, select
from app.core.database import engine, create_db_and_tables
from app.models.game import Game, Skill, Cycle

create_db_and_tables()

with Session(engine) as session:
    if session.exec(select(Game)).first():
        print("Déjà seedé — rien à faire.")
        exit()

    skills = [
        Skill(name="Discrimination sensorielle", description="Trier et distinguer les couleurs et les textures", cycle=Cycle.eveil, icon="🎨"),
        Skill(name="Reconnaissance des formes", description="Identifier et classer les formes géométriques", cycle=Cycle.maternelle, icon="🔷"),
        Skill(name="Langage oral", description="Associer des sons aux lettres et aux mots", cycle=Cycle.maternelle, icon="🔤"),
        Skill(name="Numération", description="Compter, dénombrer et comparer des quantités", cycle=Cycle.primaire, icon="🔢"),
        Skill(name="Géographie", description="Découvrir les pays, continents et cultures", cycle=Cycle.primaire, icon="🌍"),
    ]
    for s in skills:
        session.add(s)
    session.commit()
    for s in skills:
        session.refresh(s)

    games = [
        # Éveil
        Game(title="Tri des couleurs", description="Glisse les objets vers la bonne couleur",
             cycle=Cycle.eveil, skill_id=skills[0].id, thumbnail="🎨",
             phaser_scene_key="ColorSortScene", min_age=1, max_age=4, difficulty=1),
        # Maternelle
        Game(title="Reconnais les formes", description="Observe et clique sur la bonne forme géométrique",
             cycle=Cycle.maternelle, skill_id=skills[1].id, thumbnail="🔷",
             phaser_scene_key="ShapeMatchScene", min_age=3, max_age=6, difficulty=1),
        Game(title="La chasse aux lettres", description="Retrouve la lettre demandée parmi les autres",
             cycle=Cycle.maternelle, skill_id=skills[2].id, thumbnail="🔤",
             phaser_scene_key="ShapeMatchScene", min_age=4, max_age=6, difficulty=2),
        # Primaire
        Game(title="Compte les étoiles", description="Dénombre les étoiles et choisis la bonne réponse",
             cycle=Cycle.primaire, skill_id=skills[3].id, thumbnail="⭐",
             phaser_scene_key="NumberCountScene", min_age=6, max_age=9, difficulty=1),
        Game(title="Les additions", description="Calcule et trouve le bon résultat",
             cycle=Cycle.primaire, skill_id=skills[3].id, thumbnail="➕",
             phaser_scene_key="NumberCountScene", min_age=7, max_age=10, difficulty=2),
        Game(title="Tour du monde", description="Associe les drapeaux à leurs pays",
             cycle=Cycle.primaire, skill_id=skills[4].id, thumbnail="🌍",
             phaser_scene_key="NumberCountScene", min_age=8, max_age=12, difficulty=3),
    ]
    for g in games:
        session.add(g)
    session.commit()
    print(f"✓ {len(skills)} compétences et {len(games)} jeux créés.")
