from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .config import settings
from .db import get_session
from .models import Hero, HeroCreate, HeroRead, HeroUpdate

app = FastAPI(title="Pynext-Turbo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/heroes/", response_model=HeroRead)
def create_hero(hero: HeroCreate, session: Session = Depends(get_session)):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero


@app.get("/heroes/", response_model=list[HeroRead])
def read_heroes(
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = Query(default=100, le=100),
):
    heroes = session.exec(select(Hero).offset(skip).limit(limit)).all()
    return heroes


@app.get("/heroes/{hero_id}", response_model=HeroRead)
def read_hero(hero_id: int, session: Session = Depends(get_session)):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@app.patch("/heroes/{hero_id}", response_model=HeroRead)
def update_hero(
    hero_id: int, hero_update: HeroUpdate, session: Session = Depends(get_session)
):
    db_hero = session.get(Hero, hero_id)
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero not found")

    hero_data = hero_update.model_dump(exclude_unset=True)
    for key, value in hero_data.items():
        setattr(db_hero, key, value)

    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero


@app.delete("/heroes/{hero_id}", response_model=HeroRead)
def delete_hero(hero_id: int, session: Session = Depends(get_session)):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return hero


@app.get("/")
def read_root():
    return {"message": "Hello from Pynext-Turbo API", "version": "0.1.0"}
