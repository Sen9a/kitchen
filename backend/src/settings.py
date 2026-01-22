from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    DB_PASSWORD: str = ""
    DB_USER: str = "kitchen"
    DB_NAME: str = "kitchen"
    DB_PORT: int = 5432
    DB_HOST: str = "0.0.0.0"

    @property
    def DB_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()