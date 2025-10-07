from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth

app = FastAPI()
app.add_middleware(
       
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        )

app.include_router(auth.router)
@app.get("/")
def read_root():
    return {"message": "FlowForge backend running on ubuntu"}


