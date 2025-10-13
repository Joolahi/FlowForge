from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth
from routes import projects
from database import Base, engine

app = FastAPI()
Base.metadata.create_all(bind=engine)
app.add_middleware(
       
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        )

app.include_router(auth.router)
app.include_router(projects.router)
@app.get("/")
def read_root():
    return {"message": "FlowForge backend running on ubuntu"}


