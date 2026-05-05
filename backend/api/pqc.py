from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LatticeRequest(BaseModel):
    dimension: int
    noise_level: float

@router.post("/lattice")
def simulate_lattice(request: LatticeRequest):
    # LWE Simulation
    steps = [
        {"step": "Generate Matrix A", "formula": "A", "values": f"Random {request.dimension}x{request.dimension} matrix"},
        {"step": "Generate Secret s", "formula": "s", "values": f"Random vector of size {request.dimension}"},
        {"step": "Add Noise e", "formula": "e", "values": f"Noise variance {request.noise_level}"},
        {"step": "Compute Public Key b", "formula": "b = A·s + e", "values": "Public key generated"}
    ]
    
    return {
        "status": "success",
        "technique": "Lattice-Based (LWE)",
        "steps": steps
    }

class CodeRequest(BaseModel):
    message_length: int
    error_weight: int

@router.post("/code")
def simulate_code(request: CodeRequest):
    steps = [
        {"step": "Generate Generator Matrix G", "formula": "G", "values": "Linear code generator"},
        {"step": "Encode Message m", "formula": "mG", "values": "Codeword"},
        {"step": "Add Error e", "formula": "e", "values": f"Weight {request.error_weight}"},
        {"step": "Ciphertext c", "formula": "c = mG + e", "values": "Requires syndrome decoding"}
    ]
    
    return {
        "status": "success",
        "technique": "Code-Based",
        "steps": steps
    }
