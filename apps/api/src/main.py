from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from .auth import auth_backend, current_active_user, fastapi_users
from .config import settings
from .db import get_session
from .models import (
    Hero,
    HeroCreate,
    HeroRead,
    HeroUpdate,
    User,
    UserCreate,
    UserRead,
    UserUpdate,
)

app = FastAPI(title="Pynext-Turbo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@app.post("/heroes/", response_model=HeroRead)
async def create_hero(
    hero: HeroCreate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(current_active_user),
):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    await session.commit()
    await session.refresh(db_hero)
    return db_hero


@app.get("/heroes/", response_model=list[HeroRead])
async def read_heroes(
    session: AsyncSession = Depends(get_session),
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    user: User = Depends(current_active_user),
):
    statement = select(Hero).offset(skip).limit(limit)
    result = await session.execute(statement)
    heroes = result.scalars().all()
    return heroes


@app.get("/heroes/{hero_id}", response_model=HeroRead)
async def read_hero(
    hero_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(current_active_user),
):
    hero = await session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@app.patch("/heroes/{hero_id}", response_model=HeroRead)
async def update_hero(
    hero_id: int,
    hero_update: HeroUpdate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(current_active_user),
):
    db_hero = await session.get(Hero, hero_id)
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero not found")

    hero_data = hero_update.model_dump(exclude_unset=True)
    for key, value in hero_data.items():
        setattr(db_hero, key, value)

    session.add(db_hero)
    await session.commit()
    await session.refresh(db_hero)
    return db_hero


@app.delete("/heroes/{hero_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hero(
    hero_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(current_active_user),
):
    hero = await session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    await session.delete(hero)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/")
async def read_root():
    return {"message": "Hello from Pynext-Turbo API", "version": "0.1.0"}
