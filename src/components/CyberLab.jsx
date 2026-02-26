import { useState } from 'react';
import { Shield, Lock, Unlock, Search, Cpu, Globe, Hash, RefreshCcw, Copy, Check } from 'lucide-react';

export default function CyberLab() {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: 'encoding', name: 'Encriptar / Desencriptar', description: 'Base64, Rot13', icon: <Lock className="w-6 h-6" /> },
    { id: 'steganography', name: 'Mensajes Ocultos', description: 'Esconder texto en texto', icon: <Shield className="w-6 h-6" /> },
    { id: 'transcribe', name: 'Transcribir', description: 'Binario, Hexadecimal', icon: <Cpu className="w-6 h-6" /> },
    { id: 'ip-lookup', name: 'Buscar IP', description: 'Información de red', icon: <Globe className="w-6 h-6" /> },
    { id: 'subnet', name: 'Submáscaras', description: 'Cálculo de redes', icon: <Search className="w-6 h-6" /> },
    { id: 'hash', name: 'Hash Generator', description: 'SHA-256, MD5', icon: <Hash className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen pt-8 pb-20 px-6 lg:px-12 max-w-7xl mx-auto 2xl:ms-32">
      <div className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Zona CyberLab
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Un espacio dedicado a herramientas de seguridad, criptografía y redes. 
          Utiliza estas herramientas para tus pruebas y desarrollos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              activeTool === tool.id 
                ? 'border-blue-500 shadow-blue-500/20 shadow-lg' 
                : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl transition-colors ${activeTool === tool.id ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{tool.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTool && (
        <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl animate-in slide-in-from-bottom duration-500">
           <ToolContainer id={activeTool} onBack={() => setActiveTool(null)} />
        </div>
      )}
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

    const encode = () => {
        try {
            if (mode === 'base64') {
                // Robust Base64 encoding for Unicode
                const b64 = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => 
                    String.fromCharCode('0x' + p1)
                ));
                setOutput(b64);
            } else {
                setOutput(rot13(input));
            }
        } catch (e) {
            setOutput('Error al codificar: Asegúrate de usar caracteres válidos.');
        }
    };

    const decode = () => {
        try {
            if (mode === 'base64') {
                // Robust Base64 decoding for Unicode
                const str = decodeURIComponent(atob(input).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                setOutput(str);
            } else {
                setOutput(rot13(input)); // Rot13 is its own inverse
            }
        } catch (e) {
            setOutput('Error al decodificar: Entrada no válida.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{mode === 'base64' ? 'Base64' : 'Rot13'} Encode / Decode</h4>
                <select 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-none text-sm font-bold"
                >
                    <option value="base64">Base64</option>
                    <option value="rot13">Rot13</option>
                </select>
            </div>
            <textarea 
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white min-h-[150px]"
                placeholder="Ingresa texto aquí..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-4">
                <button onClick={encode} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" /> {mode === 'base64' ? 'ENCRIPTAR' : 'APLICAR ROT13'}
                </button>
                {mode === 'base64' && (
                    <button onClick={decode} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <Unlock className="w-4 h-4" /> DESENCRIPTAR
                    </button>
                )}
            </div>
            {output && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase">Resultado:</p>
                    <p className="text-gray-900 dark:text-white break-all font-mono">{output}</p>
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
        setResult('MENSAJE REVELADO: ' + text);
    };

    return (
        <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Esteganografía (Zero-Width)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea 
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    placeholder="Texto público (visible)"
                    value={publicText}
                    onChange={(e) => setPublicText(e.target.value)}
                />
                <textarea 
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    placeholder="Mensaje secreto (invisible)"
                    value={secretText}
                    onChange={(e) => setSecretText(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <button onClick={hide} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">OCULTAR</button>
                <button onClick={reveal} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors">REVELAR DESDE PÚBLICO</button>
            </div>
            {result && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase">Resultado:</p>
                    <p className="text-gray-900 dark:text-white break-words">{result}</p>
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
            setResult({ error: 'Formato inválido. Usa IP/CIDR (e.g. 192.168.1.0/24)' });
        }
    };

    return (
        <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Calculadora de Subredes</h4>
            <div className="flex gap-4">
                <input 
                    className="flex-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    placeholder="192.168.1.0/24"
                    value={cidr}
                    onChange={(e) => setCidr(e.target.value)}
                />
                <button onClick={calculate} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">CALCULAR</button>
            </div>
            {result && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                    {result.error ? (
                        <p className="text-red-500">{result.error}</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] uppercase font-black text-blue-800 dark:text-blue-300">Máscara:</p>
                                <p className="font-bold text-gray-900 dark:text-white">{result.netmask}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-blue-800 dark:text-blue-300">Hosts Útiles:</p>
                                <p className="font-bold text-gray-900 dark:text-white">{result.hosts}</p>
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
        <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Mi Información de Red</h4>
            <button 
                onClick={fetchIp} 
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
                {loading ? 'BUSCANDO...' : 'OBTENER MI IP'}
            </button>
            
            {ipData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {Object.entries({
                        'IP': ipData.ip,
                        'Ciudad': ipData.city,
                        'Región': ipData.region,
                        'País': ipData.country_name,
                        'Proveedor (ISP)': ipData.org,
                        'Versión': ipData.version
                    }).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                            <span className="text-[10px] uppercase font-black text-gray-500 mb-1 block">{key}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{value}</span>
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
        } catch (e) {
            setOutput('Error: Asegúrate de ingresar binario separado por espacios.');
        }
    };

    const toHex = () => {
        const hex = input.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        setOutput(hex);
    };

    const fromHex = () => {
        try {
            const text = input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
            setOutput(text);
        } catch (e) {
            setOutput('Error: Asegúrate de ingresar hexadecimal separado por espacios.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Transcriptor {mode === 'binary' ? 'Binario' : 'Hexadecimal'}</h4>
                <select 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-none text-sm font-bold"
                >
                    <option value="binary">Binario</option>
                    <option value="hex">Hexadecimal</option>
                </select>
            </div>
            <textarea 
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white min-h-[150px]"
                placeholder={mode === 'binary' ? "Texto a binario o viceversa..." : "Texto a hexadecimal o viceversa..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-4">
                <button onClick={mode === 'binary' ? toBinary : toHex} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    A {mode.toUpperCase()}
                </button>
                <button onClick={mode === 'binary' ? fromBinary : fromHex} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors">
                    DE {mode.toUpperCase()}
                </button>
            </div>
            {output && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase">Resultado:</p>
                    <p className="text-gray-900 dark:text-white break-all font-mono">{output}</p>
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Hash Generator</h4>
                <select 
                    value={algo} 
                    onChange={(e) => setAlgo(e.target.value)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-none text-sm font-bold"
                >
                    <option value="SHA-1">SHA-1</option>
                    <option value="SHA-256">SHA-256</option>
                    <option value="SHA-384">SHA-384</option>
                    <option value="SHA-512">SHA-512</option>
                </select>
            </div>
            <input 
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="Escribe algo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={generateHash} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                GENERAR HASH
            </button>
            {hash && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase">{algo} Hash:</p>
                    <p className="text-gray-900 dark:text-white break-all font-mono">{hash}</p>
                </div>
            )}
        </div>
    );
}
