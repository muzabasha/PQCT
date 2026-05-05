from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sympy
import math

router = APIRouter()

class RSAGenerateRequest(BaseModel):
    key_size: int = 16 # Small for educational purposes

class RSAEncryptRequest(BaseModel):
    message: int
    e: int
    n: int

class RSADecryptRequest(BaseModel):
    ciphertext: int
    d: int
    n: int

@router.post("/generate")
def generate_keys(request: RSAGenerateRequest):
    # Educational RSA generation
    # For small key sizes, we can generate primes
    # For a real system, key_size would be much larger (e.g. 2048)
    # But for educational purposes we want small numbers
    # To prevent server hanging, cap key_size
    if request.key_size > 32:
        raise HTTPException(status_code=400, detail="Key size too large for educational mode")
    
    # Simple prime generation
    p = sympy.randprime(2**(request.key_size//2 - 1), 2**(request.key_size//2))
    q = sympy.randprime(2**(request.key_size//2 - 1), 2**(request.key_size//2))
    while p == q:
        q = sympy.randprime(2**(request.key_size//2 - 1), 2**(request.key_size//2))
        
    n = p * q
    phi = (p - 1) * (q - 1)
    
    e = 65537
    if phi % e == 0 or e >= phi:
        # fallback
        e = 3
        while math.gcd(e, phi) != 1:
            e += 2
            
    d = sympy.mod_inverse(e, phi)
    
    steps = [
        {"step": "Choose Primes", "formula": "p, q", "values": f"p={p}, q={q}"},
        {"step": "Compute n", "formula": "n = p × q", "values": f"n = {n}"},
        {"step": "Compute φ(n)", "formula": "φ(n) = (p-1)(q-1)", "values": f"φ(n) = {phi}"},
        {"step": "Choose e", "formula": "gcd(e, φ(n)) = 1", "values": f"e = {e}"},
        {"step": "Compute d", "formula": "d ≡ e⁻¹ mod φ(n)", "values": f"d = {d}"}
    ]
    
    return {
        "public_key": {"e": e, "n": n},
        "private_key": {"d": d, "n": n},
        "details": {
            "p": p,
            "q": q,
            "phi": phi
        },
        "steps": steps
    }

@router.post("/encrypt")
def encrypt(request: RSAEncryptRequest):
    if request.message >= request.n:
         raise HTTPException(status_code=400, detail="Message must be less than n")
         
    c = pow(request.message, request.e, request.n)
    
    steps = [
        {"step": "Encryption", "formula": "c ≡ m^e mod n", "values": f"{request.message}^{request.e} mod {request.n} = {c}"}
    ]
    
    return {
        "ciphertext": c,
        "steps": steps
    }

@router.post("/decrypt")
def decrypt(request: RSADecryptRequest):
    m = pow(request.ciphertext, request.d, request.n)
    
    steps = [
        {"step": "Decryption", "formula": "m ≡ c^d mod n", "values": f"{request.ciphertext}^{request.d} mod {request.n} = {m}"}
    ]
    
    return {
        "message": m,
        "steps": steps
    }
