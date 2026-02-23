from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.router import include_app_routers

app = FastAPI(description="Warehouse API",
              docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins
    allow_credentials=True, # Allows cookies to be sent cross-origin
    allow_methods=["*"],    # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],    # Allows all headers
)

include_app_routers(app)