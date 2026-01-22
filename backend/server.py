import uvicorn
from src import settings

if __name__ == "__main__":
    uvicorn.run('src.fastapi_app:app', host="0.0.0.0",
                port=settings.PORT,
                reload=True)
