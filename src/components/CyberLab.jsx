import { useState } from 'react';
import { Shield, Lock, Unlock, Search, Cpu, Globe, Hash, RefreshCcw, ArrowLeft, X } from 'lucide-react';

export default function CyberLab() {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: 'encoding', name: 'Encriptar / Desencriptar', description: 'Base64, Rot13', icon: <Lock className="w-5 h-5" /> },
    { id: 'steganography', name: 'Mensajes Ocultos', description: 'Esconder texto en texto', icon: <Shield className="w-5 h-5" /> },
    { id: 'transcribe', name: 'Transcribir', description: 'Binario, Hexadecimal', icon: <Cpu className="w-5 h-5" /> },
    { id: 'ip-lookup', name: 'Buscar IP', description: 'Información de red', icon: <Globe className="w-5 h-5" /> },
    { id: 'subnet', name: 'Submáscaras', description: 'Cálculo de redes', icon: <Search className="w-5 h-5" /> },
    { id: 'hash', name: 'Hash Generator', description: 'SHA-256, MD5', icon: <Hash className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen py-12 lg:py-20 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
      {/* Dynamic Header */}
      <div className="mb-12 transition-all">
        {!activeTool ? (
          <div className="animate-in fade-in slide-in-from-top duration-500">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase italic">
              CyberLab
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-6" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
              Herramientas experimentales de seguridad, criptografía y redes en un entorno controlado.
            </p>
          </div>
        ) : (
          <button 
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Volver al laboratorio
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tools Selection - Hidden on mobile if tool is active */}
        <div className={`lg:col-span-4 grid grid-cols-1 gap-4 ${activeTool ? 'hidden lg:grid' : 'grid animate-in fade-in slide-in-from-left duration-500'}`}>
          {tools.map((tool) => (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 text-left group overflow-hidden relative ${
                activeTool === tool.id 
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'border-white/10 dark:border-white/5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md hover:border-blue-500/50 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all ${
                activeTool === tool.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-blue-600/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white shadow-sm'
              }`}>
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-black text-sm uppercase tracking-tight ${activeTool === tool.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {tool.name}
                </h3>
                <p className={`text-[10px] font-bold ${activeTool === tool.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tool.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Tool Content Container */}
        <div className={`lg:col-span-8 ${!activeTool ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-right duration-500'}`}>
          {activeTool ? (
            <div className="p-8 lg:p-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/20 dark:border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                {tools.find(t => t.id === activeTool)?.icon}
              </div>
              <ToolContainer id={activeTool} onBack={() => setActiveTool(null)} />
            </div>
          ) : (
            <div className="hidden lg:flex h-full min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] items-center justify-center text-center p-12">
               <div className="max-w-xs space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto text-gray-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest leading-relaxed">
                    Selecciona una herramienta para comenzar la inspección
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolContainer({ id, onBack }) {
    switch (id) {
        case 'encoding': return <EncodingTool />;
        case 'ip-lookup': return <IpLookupTool />;
        case 'transcribe': return <TranscribeTool />;
        case 'hash': return <HashTool />;
        case 'steganography': return <SteganographyTool />;
        case 'subnet': return <SubnetTool />;
        default: return (
            <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Esta herramienta estará disponible próximamente.</p>
                <button onClick={onBack} className="text-blue-600 font-bold hover:underline">Volver</button>
            </div>
        );
    }
}

function EncodingTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('base64');

    const rot13 = (str) => {
        return str.replace(/[a-zA-Z]/g, (c) => {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    };

    const atbash = (str) => {
        return str.replace(/[a-zA-Z]/g, (c) => {
            const isUpper = c === c.toUpperCase();
            const start = isUpper ? 65 : 97;
            const end = isUpper ? 90 : 122;
            return String.fromCharCode(end - (c.charCodeAt(0) - start));
        });
    };

    const morseDict = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
        'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
        'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
    };

    const toMorse = (str) => {
        return str.toUpperCase().split('').map(c => morseDict[c] || c).join(' ');
    };

    const fromMorse = (str) => {
        const invMorse = Object.fromEntries(Object.entries(morseDict).map(([k, v]) => [v, k]));
        return str.split(' ').map(c => invMorse[c] || c).join('');
    };

    const encode = () => {
        try {
            if (mode === 'base64') {
                const b64 = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => 
                    String.fromCharCode('0x' + p1)
                ));
                setOutput(b64);
            } else if (mode === 'rot13') {
                setOutput(rot13(input));
            } else if (mode === 'atbash') {
                setOutput(atbash(input));
            } else if (mode === 'url') {
                setOutput(encodeURIComponent(input));
            } else if (mode === 'morse') {
                setOutput(toMorse(input));
            }
        } catch (e) {
            setOutput('Error al codificar.');
        }
    };

    const decode = () => {
        try {
            if (mode === 'base64') {
                const str = decodeURIComponent(atob(input).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                setOutput(str);
            } else if (mode === 'rot13') {
                setOutput(rot13(input));
            } else if (mode === 'atbash') {
                setOutput(atbash(input));
            } else if (mode === 'url') {
                setOutput(decodeURIComponent(input));
            } else if (mode === 'morse') {
                setOutput(fromMorse(input));
            }
        } catch (e) {
            setOutput('Error al decodificar.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                    {mode}
                </h4>
                <div className="flex flex-wrap bg-gray-100 dark:bg-gray-900/50 p-1 rounded-2xl border border-white/5 gap-1">
                    {['base64', 'rot13', 'atbash', 'url', 'morse'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                                mode === m 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Entrada</label>
                <textarea 
                    className="w-full p-6 rounded-[2rem] bg-gray-100/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-600/30 text-gray-900 dark:text-white min-h-[150px] outline-none transition-all placeholder:text-gray-400 font-mono text-sm shadow-inner"
                    placeholder="Escribe o pega el contenido aquí..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-4">
                <button onClick={encode} className="flex-1 px-8 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest">
                    Encriptar
                </button>
                <button onClick={decode} className="flex-1 px-8 py-4 bg-gray-800 dark:bg-white text-white dark:text-gray-900 font-black text-xs rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                    Desencriptar
                </button>
            </div>

            {output && (
                <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-300">
                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] ml-2">Resultado</label>
                    <div className="mt-2 p-6 rounded-[2rem] bg-blue-600/5 dark:bg-blue-400/5 border-2 border-blue-600/10 text-gray-900 dark:text-white break-all font-mono text-sm relative group">
                        {output}
                        <button 
                            onClick={() => navigator.clipboard.writeText(output)}
                            className="absolute top-4 right-4 p-2 bg-blue-600/10 text-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function SteganographyTool() {
    const [publicText, setPublicText] = useState('');
    const [secretText, setSecretText] = useState('');
    const [result, setResult] = useState('');

    const hide = () => {
        const secretBin = secretText.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
        const zeroWidth = secretBin.split('').map(bit => bit === '1' ? '\u200B' : '\u200C').join('');
        setResult(publicText + zeroWidth);
    };

    const reveal = () => {
        const zeroWidthPart = publicText.match(/[\u200B\u200C]+/g);
        if (!zeroWidthPart) {
            setResult('No se encontró mensaje oculto.');
            return;
        }
        const bin = zeroWidthPart[0].split('').map(char => char === '\u200B' ? '1' : '0').join('');
        const text = bin.match(/.{1,8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('');
        setResult('REVELADO: ' + text);
    };

    return (
        <div className="space-y-8">
            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Zero-Width</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Texto Público</label>
                   <textarea 
                        className="w-full p-6 rounded-[2rem] bg-gray-100/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-600/30 text-gray-900 dark:text-white min-h-[120px] outline-none transition-all placeholder:text-gray-400 text-sm shadow-inner"
                        placeholder="El mensaje que todos verán..."
                        value={publicText}
                        onChange={(e) => setPublicText(e.target.value)}
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Mensaje Secreto</label>
                    <textarea 
                        className="w-full p-6 rounded-[2rem] bg-gray-100/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-600/30 text-gray-900 dark:text-white min-h-[120px] outline-none transition-all placeholder:text-gray-400 text-sm shadow-inner"
                        placeholder="El mensaje que quieres ocultar..."
                        value={secretText}
                        onChange={(e) => setSecretText(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
                <button onClick={hide} className="flex-1 px-8 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest">Ocultar</button>
                <button onClick={reveal} className="flex-1 px-8 py-4 bg-gray-800 dark:bg-white text-white dark:text-gray-900 font-black text-xs rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 uppercase tracking-widest">Revelar</button>
            </div>
            {result && (
                <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-300">
                    <div className="p-6 rounded-[2rem] bg-blue-600/5 dark:bg-blue-400/5 border-2 border-blue-600/10 text-gray-900 dark:text-white break-words text-sm font-bold text-center">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}

function SubnetTool() {
    const [cidr, setCidr] = useState('192.168.1.0/24');
    const [result, setResult] = useState(null);

    const calculate = () => {
        try {
            const [ip, mask] = cidr.split('/');
            const maskInt = parseInt(mask);
            const hosts = Math.pow(2, 32 - maskInt) - 2;
            const netmask = Array(4).fill(0).map((_, i) => {
                const bits = Math.min(Math.max(maskInt - i * 8, 0), 8);
                return 256 - Math.pow(2, 8 - bits);
            }).join('.');
            setResult({ hosts, netmask });
        } catch (e) {
            setResult({ error: 'Formato inválido. Usa IP/CIDR' });
        }
    };

    return (
        <div className="space-y-8">
            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Subredes</h4>
            <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    className="flex-[2] p-6 rounded-2xl bg-gray-100/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-600/30 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 font-mono text-sm"
                    placeholder="192.168.1.0/24"
                    value={cidr}
                    onChange={(e) => setCidr(e.target.value)}
                />
                <button onClick={calculate} className="flex-1 px-8 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest">Calcular</button>
            </div>
            {result && (
                <div className="pt-2 animate-in fade-in slide-in-from-bottom duration-300">
                    {result.error ? (
                        <p className="text-red-500 font-bold text-center">{result.error}</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-blue-600/5 dark:bg-blue-400/5 border-2 border-blue-600/10">
                                <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-widest mb-1">Máscara</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{result.netmask}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-blue-600/5 dark:bg-blue-400/5 border-2 border-blue-600/10">
                                <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-widest mb-1">Hosts Útiles</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{result.hosts}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function IpLookupTool() {
    const [ipData, setIpData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchIp = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            setIpData(data);
        } catch (err) {
            alert('Error al obtener datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Network Inspector</h4>
            <button 
                onClick={fetchIp} 
                disabled={loading}
                className="w-full px-8 py-5 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
            >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
                {loading ? 'Consultando...' : 'Escanear mi red'}
            </button>
            
            {ipData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-bottom duration-500">
                    {Object.entries({
                        'IP': ipData.ip,
                        'Ciudad': ipData.city,
                        'Región': ipData.region,
                        'País': ipData.country_name,
                        'Proveedor': ipData.org,
                        'Protocolo': ipData.version
                    }).map(([key, value]) => (
                        <div key={key} className="p-5 rounded-3xl bg-white/40 dark:bg-gray-900/40 border-2 border-white/5 shadow-inner">
                            <span className="text-[9px] uppercase font-black text-gray-400 mb-1 block tracking-widest">{key}</span>
                            <span className="font-black text-gray-900 dark:text-white text-sm tracking-tight">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function TranscribeTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('binary');

    const toBinary = () => {
        const bin = input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        setOutput(bin);
    };

    const fromBinary = () => {
        try {
            const text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            setOutput(text);
        } catch (e) { setOutput('Error: Binario no válido.'); }
    };

    const toHex = () => {
        const hex = input.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        setOutput(hex);
    };

    const fromHex = () => {
        try {
            const text = input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
            setOutput(text);
        } catch (e) { setOutput('Error: Hexadecimal no válido.'); }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Transcriptor</h4>
                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-2xl border border-white/5">
                    {['binary', 'hex'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                                mode === m 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {m === 'binary' ? 'Binario' : 'Hex'}
                        </button>
                    ))}
                </div>
            </div>
            
            <textarea 
                className="w-full p-6 rounded-[2rem] bg-gray-100/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-600/30 text-gray-900 dark:text-white min-h-[150px] outline-none transition-all placeholder:text-gray-400 font-mono text-sm shadow-inner"
                placeholder={mode === 'binary' ? "01001000 01101111 01101100 01100001" : "48 6f 6c 61"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-wrap gap-4">
                <button onClick={mode === 'binary' ? toBinary : toHex} className="flex-1 px-8 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest">A {mode}</button>
                <button onClick={mode === 'binary' ? fromBinary : fromHex} className="flex-1 px-8 py-4 bg-gray-800 dark:bg-white text-white dark:text-gray-900 font-black text-xs rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 uppercase tracking-widest">Desde {mode}</button>
            </div>
            
            {output && (
                <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-300">
                    <div className="p-6 rounded-[2rem] bg-blue-600/5 dark:bg-blue-400/5 border-2 border-blue-600/10 text-gray-900 dark:text-white break-all font-mono text-sm">
                        {output}
                    </div>
                </div>
            )}
        </div>
    );
}

function HashTool() {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');
    const [algo, setAlgo] = useState('SHA-256');

    const generateHash = async () => {
        const msgUint8 = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Hashing</h4>
                <select 
                    value={algo} 
                    onChange={(e) => setAlgo(e.target.value)}
                    className="p-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-none text-[10px] font-black uppercase outline-none shadow-sm cursor-pointer"
                >
                    <option value="SHA-1">SHA-1</option>
                    <option value="SHA-256">SHA-256</option>
                    <option value="SHA-384">SHA-384</option>
                    <option value="SHA-512">SHA-512</option>
                </select>
            </div>
            
            <input 
                className="w-full p-6 rounded-2xl bg-gray-100/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-600/30 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 font-mono text-sm shadow-inner"
                placeholder="Ingresa texto para generar hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            
            <button onClick={generateHash} className="w-full px-8 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-[0.2em]">
                Generar Firma Digital
            </button>
            
            {hash && (
                <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-300">
                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] ml-2">{algo}</label>
                    <div className="mt-2 p-6 rounded-[2rem] bg-blue-600/5 dark:bg-blue-400/5 border-2 border-blue-600/10 text-gray-900 dark:text-white break-all font-mono text-xs">
                        {hash}
                    </div>
                </div>
            )}
        </div>
    );
}
