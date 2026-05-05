from fastapi import APIRouter
from pydantic import BaseModel
import math

router = APIRouter()

class GroverRunRequest(BaseModel):
    dataset_size: int

@router.post("/run")
def run_grover(request: GroverRunRequest):
    N = request.dataset_size
    classical_steps = N / 2
    quantum_steps = math.pi / 4 * math.sqrt(N)
    
    steps = [
        {"step": "Initialize Superposition", "formula": "|s⟩ = 1/√N ∑|x⟩", "values": f"N = {N}"},
        {"step": "Oracle Application", "formula": "U_w|x⟩ = -|x⟩ if x=w", "values": "Flips the phase of target"},
        {"step": "Diffusion Operator", "formula": "U_s = 2|s⟩⟨s| - I", "values": "Amplifies the probability of target"},
        {"step": "Measurement", "formula": "O(√N) iterations", "values": f"Approx {int(quantum_steps)} steps"}
    ]
    
    return {
        "classical_average_steps": classical_steps,
        "quantum_steps": quantum_steps,
        "speedup": classical_steps / quantum_steps if quantum_steps > 0 else 0,
        "steps": steps,
        "analogy": "Turning spotlight brighter on correct answer 🔦"
    }
