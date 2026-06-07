"""Run: python seed_grammar.py  (depuis backend/ avec venv activé)"""
from sqlmodel import Session, select
from app.core.database import engine, create_db_and_tables
from app.models.game import Game, Skill, Cycle

create_db_and_tables()

GRAMMAR_GAMES = [
    ("Les noms",                "Nom commun ou nom propre ?",             "GrammarNom",              "📝", 1),
    ("Les articles",            "Défini, indéfini, contracté, partitif",  "GrammarArticle",           "📰", 1),
    ("Les adjectifs",           "Qualificatif, possessif, démonstratif…", "GrammarAdjectif",          "🎨", 2),
    ("Les adjectifs numéraux",  "Cardinal ou ordinal ?",                  "GrammarAdjectifNumeral",   "🔢", 2),
    ("Les verbes",              "Action, état ou auxiliaire ?",           "GrammarVerbe",             "⚡", 2),
    ("Les adverbes",            "Identifie et classe les adverbes",       "GrammarAdverbe",           "💨", 2),
    ("Les pronoms",             "Personnel, possessif, relatif…",         "GrammarPronom",            "👤", 3),
    ("Les conjonctions",        "Coordination ou subordination ?",        "GrammarConjonction",       "🔗", 2),
    ("Les prépositions",        "Identifie les prépositions",             "GrammarPreposition",       "📍", 2),
    ("Interjections",           "Interjection ou onomatopée ?",           "GrammarInterjection",      "❗", 1),
    ("Les déterminants",        "Classe les déterminants",                "GrammarDeterminant",       "🏷️", 2),
]

with Session(engine) as session:
    existing = session.exec(
        select(Skill).where(Skill.name == "Grammaire – Nature des mots")
    ).first()
    if existing:
        print("Grammaire déjà seedée — rien à faire.")
        exit()

    skill = Skill(
        name="Grammaire – Nature des mots",
        description="Identifier la nature grammaticale des mots : nom, article, adjectif, verbe…",
        cycle=Cycle.primaire,
        icon="📚",
    )
    session.add(skill)
    session.commit()
    session.refresh(skill)

    games = [
        Game(
            title=title,
            description=desc,
            cycle=Cycle.primaire,
            skill_id=skill.id,
            thumbnail=icon,
            phaser_scene_key=key,
            min_age=7,
            max_age=12,
            difficulty=diff,
        )
        for title, desc, key, icon, diff in GRAMMAR_GAMES
    ]
    for g in games:
        session.add(g)
    session.commit()
    print(f"✓ Compétence 'Grammaire – Nature des mots' + {len(games)} jeux créés.")
