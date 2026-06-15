export function gcd(a: number, b: number): number {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function modInverse(a: number, m: number): number {
  let m0 = m;
  let y = 0, x = 1;
  if (m === 1) return 0;
  while (a > 1) {
    let q = Math.floor(a / m);
    let t = m;
    m = a % m;
    a = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0) x += m0;
  return x;
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function getRandomPrime(min: number, max: number): number {
  while (true) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (isPrime(num)) return num;
  }
}

export function modPow(base: number, exp: number, mod: number): number {
  let res = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) res = (res * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return res;
}

export function generateRSA(keySize: number = 16) {
  const min = Math.pow(2, Math.floor(keySize / 2) - 1);
  const max = Math.pow(2, Math.floor(keySize / 2)) - 1;
  
  let p = getRandomPrime(min, max);
  let q = getRandomPrime(min, max);
  while (p === q) {
    q = getRandomPrime(min, max);
  }
  
  return generateRSAFromPrimes(p, q);
}

export function generateRSAFromPrimes(p: number, q: number) {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  let e = 65537;
  if (phi % e === 0 || e >= phi) {
    e = 3;
    while (gcd(e, phi) !== 1) {
      e += 2;
    }
  }
  
  const d = modInverse(e, phi);
  
  return {
    public_key: { e, n },
    private_key: { d, n },
    details: { p, q, phi },
    steps: [
      { step: "Primes Chosen", formula: "p, q", values: `p=${p}, q=${q}` },
      { step: "Compute Modulus (n)", formula: "n = p × q", values: `n = ${p} × ${q} = ${n}` },
      { step: "Compute Totient φ(n)", formula: "φ(n) = (p-1)(q-1)", values: `φ(n) = ${p-1} × ${q-1} = ${phi}` },
      { step: "Choose Public Exponent (e)", formula: "gcd(e, φ(n)) = 1", values: `e = ${e} (commonly 65537)` },
      { step: "Compute Private Exponent (d)", formula: "d ≡ e⁻¹ mod φ(n)", values: `d = ${d}` }
    ]
  };
}

export function encryptRSA(message: number, e: number, n: number) {
  const c = modPow(message, e, n);
  return {
    ciphertext: c,
    steps: [
      { step: "Encryption", formula: "c ≡ m^e mod n", values: `${message}^${e} mod ${n} = ${c}` }
    ]
  };
}

export function runShor(N: number) {
  if (N % 2 === 0) {
    return { result: [2, Math.floor(N/2)], steps: [{ step: "Check Even", message: `${N} is even.` }] };
  }
  
  const a = Math.floor(Math.random() * (N - 3)) + 2;
  const k = gcd(a, N);
  
  let steps: any[] = [
    { step: "Choose 'a'", formula: "1 < a < N", values: `a = ${a}` },
    { step: "Compute GCD", formula: "gcd(a, N)", values: `gcd(${a}, ${N}) = ${k}` }
  ];
  
  if (k > 1) {
    steps.push({ step: "Lucky Guess", message: "Found factor by GCD" });
    return { result: [k, Math.floor(N/k)], steps };
  }
  
  let r = 1;
  while (modPow(a, r, N) !== 1 && r < 1000) {
    r++;
  }
  
  steps.push({ step: "Quantum Period Finding", formula: "f(x) = a^x mod N", values: `Period r = ${r}` });
  
  if (r % 2 !== 0) {
    steps.push({ step: "Check Period", message: "Period is odd, try again." });
    return { result: null, steps, status: "failed_odd_period" };
  }
  
  const p1 = gcd(Math.abs(modPow(a, Math.floor(r/2), N) - 1), N);
  const p2 = gcd(Math.abs(modPow(a, Math.floor(r/2), N) + 1), N);
  
  steps.push({ step: "Compute Factors", formula: "gcd(a^(r/2) ± 1, N)", values: `p1=${p1}, p2=${p2}` });
  
  return {
    result: (p1 * p2 === N || p1 > 1) ? [p1, p2] : null,
    steps,
    analogy: "Finding the repeating pattern in a sequence to break the lock."
  };
}

export function runGrover(datasetSize: number) {
  const N = datasetSize;
  const classical_steps = N / 2;
  const quantum_steps = Math.PI / 4 * Math.sqrt(N);
  
  return {
    classical_average_steps: classical_steps,
    quantum_steps: quantum_steps,
    speedup: quantum_steps > 0 ? classical_steps / quantum_steps : 0,
    steps: [
      { step: "Initialize Superposition", formula: "|s⟩ = 1/√N ∑|x⟩", values: `N = ${N}` },
      { step: "Oracle Application", formula: "U_w|x⟩ = -|x⟩ if x=w", values: "Flips the phase of target" },
      { step: "Diffusion Operator", formula: "U_s = 2|s⟩⟨s| - I", values: "Amplifies the probability of target" },
      { step: "Measurement", formula: "O(√N) iterations", values: `Approx ${Math.floor(quantum_steps)} steps` }
    ],
    analogy: "Turning spotlight brighter on correct answer 🔦"
  };
}

export function simulateLattice(dimension: number, noiseLevel: number) {
  return {
    status: "success",
    technique: "Lattice-Based (LWE)",
    steps: [
      { step: "Generate Matrix A", formula: "A", values: `Random ${dimension}x${dimension} matrix` },
      { step: "Generate Secret s", formula: "s", values: `Random vector of size ${dimension}` },
      { step: "Add Noise e", formula: "e", values: `Noise variance ${noiseLevel}` },
      { step: "Compute Public Key b", formula: "b = A·s + e", values: "Public key generated" }
    ]
  };
}

export function simulateCode(messageLength: number, errorWeight: number) {
  return {
    status: "success",
    technique: "Code-Based",
    steps: [
      { step: "Generate Generator Matrix G", formula: "G", values: "Linear code generator" },
      { step: "Encode Message m", formula: "mG", values: "Codeword" },
      { step: "Add Error e", formula: "e", values: `Weight ${errorWeight}` },
      { step: "Ciphertext c", formula: "c = mG + e", values: "Requires syndrome decoding" }
    ]
  };
}

// ─── Quantum Basics: Qubit & Gate Simulation ────────────────────────────────

export type QubitState = { alpha: number; beta: number }; // |ψ⟩ = α|0⟩ + β|1⟩

export function createQubit(zero: boolean = true): QubitState {
  return zero ? { alpha: 1, beta: 0 } : { alpha: 0, beta: 1 };
}

export function applyXGate(q: QubitState): QubitState {
  return { alpha: q.beta, beta: q.alpha };
}

export function applyHGate(q: QubitState): QubitState {
  const sqrt2 = Math.SQRT1_2;
  return {
    alpha: (q.alpha + q.beta) * sqrt2,
    beta: (q.alpha - q.beta) * sqrt2
  };
}

export function applyZGate(q: QubitState): QubitState {
  return { alpha: q.alpha, beta: -q.beta };
}

export function applyYGate(q: QubitState): QubitState {
  return { alpha: -q.beta, beta: q.alpha };
}

export type TwoQubitState = { alpha: number; beta: number; gamma: number; delta: number }; // |ψ⟩ = α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩

export function createTwoQubit(): TwoQubitState {
  return { alpha: 1, beta: 0, gamma: 0, delta: 0 };
}

export function applyCNOTGate(q: TwoQubitState): TwoQubitState {
  // CNOT: |00⟩→|00⟩, |01⟩→|01⟩, |10⟩→|11⟩, |11⟩→|10⟩
  return { alpha: q.alpha, beta: q.beta, gamma: q.delta, delta: q.gamma };
}

export function measureQubit(q: QubitState): number {
  const prob0 = q.alpha * q.alpha;
  return Math.random() < prob0 ? 0 : 1;
}

export function getProbabilities(q: QubitState): { prob0: number; prob1: number } {
  const total = q.alpha * q.alpha + q.beta * q.beta;
  return {
    prob0: (q.alpha * q.alpha) / total,
    prob1: (q.beta * q.beta) / total
  };
}

export function getTwoQubitProbabilities(q: TwoQubitState): { p00: number; p01: number; p10: number; p11: number } {
  const total = q.alpha * q.alpha + q.beta * q.beta + q.gamma * q.gamma + q.delta * q.delta;
  return {
    p00: (q.alpha * q.alpha) / total,
    p01: (q.beta * q.beta) / total,
    p10: (q.gamma * q.gamma) / total,
    p11: (q.delta * q.delta) / total
  };
}
