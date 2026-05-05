import Link from 'next/link';

export default function Home() {
  const modules = [
    { id: 1, path: '/modules/1-need-pqc', title: 'Need for PQC', desc: 'Why classical crypto fails against quantum' },
    { id: 2, path: '/modules/2-rsa-ecc', title: 'RSA & ECC Working', desc: 'Simulate classical encryption step-by-step' },
    { id: 3, path: '/modules/3-shor-grover', title: 'Shor & Grover', desc: 'How quantum algorithms break the lock' },
    { id: 4, path: '/modules/4-shor-impact', title: 'Impact of Shor', desc: 'Timeline of security collapse' },
    { id: 5, path: '/modules/5-pqc', title: 'Post-Quantum Crypto', Lattice: 'Lattice, Code, Hash based solutions' },
    { id: 6, path: '/modules/6-dashboard', title: 'Comparative Dashboard', desc: 'Compare algorithms side-by-side' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Quantum Crypto Lab
          </span>
        </h1>
        <p className="text-xl text-slate-300 md:text-2xl">
          Learn Post-Quantum Cryptography by Doing. Interactive simulations, step-by-step math, and visual cryptography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {modules.map((mod) => (
          <Link href={mod.path} key={mod.id}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:bg-slate-800/50 transition-all cursor-pointer h-full text-left group flex flex-col justify-between">
              <div>
                <div className="text-blue-400 font-mono text-sm mb-2">Module {mod.id}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{mod.title}</h3>
                <p className="text-slate-400">{mod.desc || mod.Lattice}</p>
              </div>
              <div className="mt-4 text-blue-500 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                Explore →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
