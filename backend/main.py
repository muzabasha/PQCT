from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from api.rsa import router as rsa_router
from api.ecc import router as ecc_router
from api.shor import router as shor_router
from api.grover import router as grover_router
from api.pqc import router as pqc_router

app = FastAPI(
    title="Quantum Crypto Lab API",
    description="Backend for Quantum Crypto Lab - Learn by Doing",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(rsa_router, prefix="/api/rsa", tags=["RSA"])
app.include_router(ecc_router, prefix="/api/ecc", tags=["ECC"])
app.include_router(shor_router, prefix="/api/shor", tags=["Shor"])
app.include_router(grover_router, prefix="/api/grover", tags=["Grover"])
app.include_router(pqc_router, prefix="/api/pqc", tags=["PQC"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Quantum Crypto Lab API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
