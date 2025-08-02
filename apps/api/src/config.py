from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    CORS_ORIGINS: list[str]
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = False
    JWT_SECRET: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        print(f"DATABASE_URL: {self.DATABASE_URL}")
        print(f"CORS_ORIGINS: {self.CORS_ORIGINS}")
        print(f"API_HOST: {self.API_HOST}")
        print(f"API_PORT: {self.API_PORT}")
        print(f"DEBUG: {self.DEBUG}")
        print(f"JWT_SECRET: {self.JWT_SECRET}")

    @field_validator("DATABASE_URL")
    @classmethod
    def ensure_async_driver(cls, v: str) -> str:
        # Automatically add the +asyncpg driver for async operations if not present
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v


settings = Settings()
