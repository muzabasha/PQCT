from fastapi import APIRouter
from pydantic import BaseModel
import math
import random

router = APIRouter()

class ShorRunRequest(BaseModel):
    N: int

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

@router.post("/run")
def run_shor(request: ShorRunRequest):
    N = request.N
    if N % 2 == 0:
        return {"result": [2, N//2], "steps": [{"step": "Check Even", "message": f"{N} is even."}]}
        
    # Simplified simulation
    # Choose random a
    a = random.randint(2, N - 1)
    k = gcd(a, N)
    
    steps = [
        {"step": "Choose 'a'", "formula": "1 < a < N", "values": f"a = {a}"},
        {"step": "Compute GCD", "formula": "gcd(a, N)", "values": f"gcd({a}, {N}) = {k}"}
    ]
    
    if k > 1:
        steps.append({"step": "Lucky Guess", "message": "Found factor by GCD"})
        return {"result": [k, N//k], "steps": steps}
        
    # Period finding simulation
    r = 1
    while pow(a, r, N) != 1 and r < 1000:
        r += 1
        
    steps.append({"step": "Quantum Period Finding", "formula": "f(x) = a^x mod N", "values": f"Period r = {r}"})
    
    if r % 2 != 0:
        steps.append({"step": "Check Period", "message": "Period is odd, try again."})
        return {"result": None, "steps": steps, "status": "failed_odd_period"}
        
    p1 = gcd(pow(a, r//2) - 1, N)
    p2 = gcd(pow(a, r//2) + 1, N)
    
    steps.append({"step": "Compute Factors", "formula": "gcd(a^(r/2) ± 1, N)", "values": f"p1={p1}, p2={p2}"})
    
    return {
        "result": [p1, p2] if p1 * p2 == N or p1 > 1 else None,
        "steps": steps,
        "analogy": "Finding the repeating pattern in a sequence to break the lock."
    }
