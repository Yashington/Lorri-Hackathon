from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    AZURE_ENDPOINT: str = ""
    AZURE_API_KEY: str = ""
    USE_MOCK_DATA: bool = True
    CORS_ORIGINS: str = "http://localhost:3000"
    UPLOAD_DIR: str = "./uploads"

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
