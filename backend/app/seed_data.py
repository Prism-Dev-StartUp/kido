"""Seeded automatically at startup — idempotent (safe to run multiple times)."""
from sqlmodel import Session, select
from .core.database import engine
from .models.game import Game, Skill, Cycle


def seed_db():
    with Session(engine) as session:
        if session.exec(select(Game)).first():
            return  # already seeded

        skills = [
            Skill(name="Discrimination sensorielle", description="Trier et distinguer les couleurs", cycle=Cycle.eveil, icon="🎨"),
            Skill(name="Reconnaissance des formes", description="Identifier les formes géométriques", cycle=Cycle.maternelle, icon="🔷"),
            Skill(name="Langage oral", description="Associer sons, lettres et mots", cycle=Cycle.maternelle, icon="🔤"),
            Skill(name="Numération", description="Compter, dénombrer et calculer", cycle=Cycle.primaire, icon="🔢"),
            Skill(name="Géographie", description="Découvrir les pays et continents", cycle=Cycle.primaire, icon="🌍"),
            Skill(name="Grammaire – Nature des mots", description="Identifier la nature grammaticale des mots", cycle=Cycle.primaire, icon="📚"),
        ]
        for s in skills:
            session.add(s)
        session.commit()
        for s in skills:
            session.refresh(s)

        s_eveil, s_formes, s_langage, s_num, s_geo, s_gram = skills

        games = [
            # Éveil
            Game(title="Tri des couleurs", description="Glisse les objets vers la bonne couleur",
                 cycle=Cycle.eveil, skill_id=s_eveil.id, thumbnail="🎨",
                 phaser_scene_key="ColorSortScene", min_age=1, max_age=4, difficulty=1),
            # Maternelle
            Game(title="Reconnais les formes", description="Observe et clique sur la bonne forme géométrique",
                 cycle=Cycle.maternelle, skill_id=s_formes.id, thumbnail="🔷",
                 phaser_scene_key="ShapeMatchScene", min_age=3, max_age=6, difficulty=1),
            Game(title="La chasse aux lettres", description="Retrouve la lettre demandée parmi les autres",
                 cycle=Cycle.maternelle, skill_id=s_langage.id, thumbnail="🔤",
                 phaser_scene_key="LetterHuntScene", min_age=4, max_age=6, difficulty=2),
            # Primaire
            Game(title="Compte les étoiles", description="Dénombre les étoiles et choisis la bonne réponse",
                 cycle=Cycle.primaire, skill_id=s_num.id, thumbnail="⭐",
                 phaser_scene_key="NumberCountScene", min_age=6, max_age=9, difficulty=1),
            Game(title="Les additions", description="Calcule et trouve le bon résultat",
                 cycle=Cycle.primaire, skill_id=s_num.id, thumbnail="➕",
                 phaser_scene_key="AdditionScene", min_age=7, max_age=10, difficulty=2),
            Game(title="Tour du monde", description="Associe les drapeaux à leurs pays",
                 cycle=Cycle.primaire, skill_id=s_geo.id, thumbnail="🌍",
                 phaser_scene_key="WorldFlagsScene", min_age=8, max_age=12, difficulty=3),
            # Grammaire
            Game(title="Les noms", description="Nom commun ou nom propre ?",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="📝",
                 phaser_scene_key="GrammarNom", min_age=7, max_age=12, difficulty=1),
            Game(title="Les articles", description="Défini, indéfini, contracté, partitif",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="📰",
                 phaser_scene_key="GrammarArticle", min_age=7, max_age=12, difficulty=1),
            Game(title="Les adjectifs", description="Qualificatif, possessif, démonstratif…",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="🎨",
                 phaser_scene_key="GrammarAdjectif", min_age=8, max_age=12, difficulty=2),
            Game(title="Les adjectifs numéraux", description="Cardinal ou ordinal ?",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="🔢",
                 phaser_scene_key="GrammarAdjectifNumeral", min_age=8, max_age=12, difficulty=2),
            Game(title="Les verbes", description="Action, état ou auxiliaire ?",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="⚡",
                 phaser_scene_key="GrammarVerbe", min_age=8, max_age=12, difficulty=2),
            Game(title="Les adverbes", description="Identifie et classe les adverbes",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="💨",
                 phaser_scene_key="GrammarAdverbe", min_age=8, max_age=12, difficulty=2),
            Game(title="Les pronoms", description="Personnel, possessif, relatif…",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="👤",
                 phaser_scene_key="GrammarPronom", min_age=9, max_age=12, difficulty=3),
            Game(title="Les conjonctions", description="Coordination ou subordination ?",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="🔗",
                 phaser_scene_key="GrammarConjonction", min_age=8, max_age=12, difficulty=2),
            Game(title="Les prépositions", description="Identifie les prépositions",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="📍",
                 phaser_scene_key="GrammarPreposition", min_age=8, max_age=12, difficulty=2),
            Game(title="Interjections", description="Interjection ou onomatopée ?",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="❗",
                 phaser_scene_key="GrammarInterjection", min_age=7, max_age=12, difficulty=1),
            Game(title="Les déterminants", description="Classe les déterminants",
                 cycle=Cycle.primaire, skill_id=s_gram.id, thumbnail="🏷️",
                 phaser_scene_key="GrammarDeterminant", min_age=8, max_age=12, difficulty=2),
        ]
        for g in games:
            session.add(g)
        session.commit()
