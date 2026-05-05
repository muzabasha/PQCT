from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ECCSimulateRequest(BaseModel):
    a: int
    b: int
    p: int  # Prime field
    scalar: int
    point_x: int
    point_y: int

@router.post("/simulate")
def simulate(request: ECCSimulateRequest):
    # This is a simplified ECC simulation.
    # In a real app, you would implement proper point addition and scalar multiplication over finite fields
    # Here we just return the setup for educational purposes
    
    # Check if point is on curve: y^2 = x^3 + ax + b mod p
    y2 = (request.point_y ** 2) % request.p
    x3_ax_b = (request.point_x ** 3 + request.a * request.point_x + request.b) % request.p
    
    if y2 != x3_ax_b:
        raise HTTPException(status_code=400, detail="Point is not on the curve")
        
    steps = [
        {"step": "Define Curve", "formula": "y² ≡ x³ + ax + b (mod p)", "values": f"y² ≡ x³ + {request.a}x + {request.b} (mod {request.p})"},
        {"step": "Verify Base Point", "formula": "y² ≡ x³ + ax + b", "values": f"{y2} ≡ {x3_ax_b} (mod {request.p}) - Valid"},
        {"step": "Scalar Multiplication", "formula": "Q = dP", "values": f"Q = {request.scalar}P"}
    ]
    
    return {
        "curve": {"a": request.a, "b": request.b, "p": request.p},
        "base_point": {"x": request.point_x, "y": request.point_y},
        "steps": steps,
        "analogy": "Jumping across stones on a curved river 🪨"
    }
