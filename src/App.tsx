import { GoogleGenAI } from '@google/genai';
import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Layers, Palette, Rocket, Settings,
    Plus, Search, Code, Eye, Copy, Download,
    ChevronRight, Terminal, User, Bell, LogOut,
    Sparkles, RefreshCw, Smartphone, Monitor, Command, Zap,
    ShieldCheck, Lock, ArrowRight, X, FileJson, FileCode
} from 'lucide-react';
import { Login } from './components/Login';
import { onAuthChange } from './firebase';

// --- SYSTEM CONFIG ---
const IAM_TAILWIND_CONFIG = {
    theme: {
        extend: {
            colors: {
                'bg-primary': '#000000',
                'bg-secondary': '#050505',
                'glass-surface': 'rgba(255, 255, 255, 0.03)',
                'accent': '#ffffff',
                'accent-dim': '#a1a1aa',
                'text-main': '#ffffff',
                'text-muted': '#737373',
                'border-color': 'rgba(255, 255, 255, 0.12)',
                'border-highlight': 'rgba(255, 255, 255, 0.3)',
                'success': '#ffffff',
                'warning': '#d4d4d4',
                'error': '#ffffff'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        }
    }
};

const IAM_CUSTOM_CSS = `
    body { background-color: #000000; color: #ffffff; }
    .glass-panel {
        background: rgba(5, 5, 5, 0.7);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
    }
    .btn-titanium {
        background: #ffffff;
        color: #000000;
        font-weight: 700;
        border: 1px solid #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.5rem 1rem;
        border-radius: 0.125rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    .btn-titanium:hover { background: #d4d4d4; }
`;

// --- MOCK DATA ---
interface Design {
    id: string;
    name: string;
    category: string;
    projectId: string;
    updatedAt: string;
    status: string;
    code?: string;
}

const MOCK_PROJECTS = [
    { id: 'p1', name: 'i.AM Mail', stage: 'live', color: '#fff', tech: ['React', 'Firebase'] },
    { id: 'p2', name: 'Turbocharger', stage: 'dev', color: '#a1a1aa', tech: ['Next.js', 'Supabase'] },
];

const MOCK_DESIGNS: Design[] = [
    { id: 'd1', name: 'Auth / Login V2', category: 'card', projectId: 'p1', updatedAt: '2h ago', status: 'live' },
    { id: 'd2', name: 'Analytics Widget', category: 'module', projectId: 'p2', updatedAt: '5h ago', status: 'draft' },
    { id: 'd3', name: 'Hero Section', category: 'landing', projectId: 'p3', updatedAt: '1d ago', status: 'testing' },
    { id: 'd4', name: 'Settings Panel', category: 'page', projectId: 'p1', updatedAt: '2d ago', status: 'live' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

// Wrap HTML with the specific config injection so previews look correct
const wrapHtml = (bodyContent) => `<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"><\\/script>
    <script>
        tailwind.config = ${JSON.stringify(IAM_TAILWIND_CONFIG)}
    <\\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        ${IAM_CUSTOM_CSS}
        /* Reset for preview */
        body { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
    </style>
</head>
<body>
    ${bodyContent}
<script type="module" src="/index.tsx"></script>
</body>

</html>`;

// --- SIDEBAR ---
const Sidebar = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: Terminal },
        { id: 'designs', label: 'Vault Library', icon: Layers },
        { id: 'tokens', label: 'Token Studio', icon: Palette },
        { id: 'deploy', label: 'Deployments', icon: Rocket },
    ];

    return (
        <div
            className="w-64 h-screen bg-black/80 backdrop-blur-xl border-r border-border-color flex flex-col flex-shrink-0 z-20 relative">
            <div className="p-8 flex items-center gap-3 mb-2">
                <div
                    className="w-10 h-10 bg-white text-black flex items-center justify-center font-bold text-xl rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    i</div>
                <div className="flex flex-col">
                    <span className="font-bold tracking-tight text-lg text-white leading-none">i.AM</span>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-text-muted">VAULT</span>
                </div>
            </div>

            <div className="px-4 flex-1 mt-6">
                <div
                    className="text-[10px] font-mono text-text-muted uppercase mb-4 px-3 tracking-widest border-b border-border-color pb-2">
                    Workspace</div>
                <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button key={item.id} onClick={() => setActiveView(item.id)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-sm text-sm transition-all duration-300 group ${activeView === item.id
                                ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={16} className={activeView === item.id ? "text-black"
                                : "text-text-muted group-hover:text-white"} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-border-color bg-black/50">
                <div
                    className="flex items-center gap-3 p-3 rounded-sm hover:bg-white/5 cursor-pointer transition-colors group border border-transparent hover:border-white/10">
                    <div
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs">
                        F</div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200 group-hover:text-white">Founder</div>
                        <div className="text-[10px] text-text-muted font-mono">PRO ACCOUNT</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DASHBOARD ---
const DashboardView = () => (
    <div className="p-12 animate-in max-w-[1600px] mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-border-color pb-6">
            <div>
                <h1 className="text-5xl font-light mb-2 tracking-tight text-white">Dashboard</h1>
                <p className="text-text-muted font-light">System overview & statistics.</p>
            </div>
            <div className="flex gap-4">
                <div className="text-right">
                    <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Status</div>
                    <div className="flex items-center gap-2 text-white text-sm font-mono"><span
                        className="relative flex h-2 w-2"><span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span
                                className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span> ONLINE</div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div
                className="glass-panel p-8 rounded-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers size={80} />
                </div>
                <div
                    className="text-xs font-mono text-text-muted uppercase mb-6 tracking-widest border-l-2 border-white pl-3">
                    Total Assets</div>
                <div className="text-5xl font-light text-white mb-2">24</div>
                <div className="text-xs text-white/50 flex items-center gap-1">+2 this week</div>
            </div>
            <div
                className="glass-panel p-8 rounded-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Rocket size={80} />
                </div>
                <div
                    className="text-xs font-mono text-text-muted uppercase mb-6 tracking-widest border-l-2 border-white pl-3">
                    Deployments</div>
                <div className="text-5xl font-light text-white mb-2">108</div>
                <div className="text-xs text-text-muted">Stable Release</div>
            </div>
            <div
                className="glass-panel p-8 rounded-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Terminal size={80} />
                </div>
                <div
                    className="text-xs font-mono text-text-muted uppercase mb-6 tracking-widest border-l-2 border-white pl-3">
                    Projects</div>
                <div className="text-5xl font-light text-white mb-2">5</div>
                <div className="text-xs text-white/50">Active Development</div>
            </div>
        </div>

        <h2 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-6">Recent System Logs</h2>
        <div className="border border-border-color rounded-sm overflow-hidden">
            {[1, 2, 3].map((_, i) => (
                <div key={i}
                    className="py-4 px-6 bg-black/40 hover:bg-white/5 transition-colors border-b border-border-color last:border-0 flex items-center gap-6 text-sm group">
                    <span className="font-mono text-xs text-text-muted w-20">10:4{i} AM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
                    <span className="flex-1 text-gray-400 group-hover:text-gray-200 transition-colors">Deployed <span
                        className="text-white font-medium">i.AM Mail</span> updates to production environment.</span>
                    <span
                        className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-text-muted bg-white/5">v2.4.{i}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- TOKEN STUDIO ---
const TokenStudio = () => {
    const [activeTab, setActiveTab] = useState('colors');
    const [showExport, setShowExport] = useState(false);
    const [colors, setColors] = useState({
        primary: '#000000',
        surface: '#000000',
        accent: '#ffffff'
    });

    return (
        <div className="h-full flex flex-col animate-in relative">

            {/* EXPORT MODAL */}
            {showExport && (
                <div
                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-12 animate-in">
                    <div
                        className="bg-[#09090b] border border-border-color w-full max-w-4xl h-[80%] rounded-sm shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-border-color bg-black/40">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded-sm">
                                    <Code size={16} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">System Configuration</h3>
                                    <p className="text-xs text-text-muted font-mono uppercase">Tailwind Config & CSS Variables</p>
                                </div>
                            </div>
                            <button onClick={() => setShowExport(false)} className="text-text-muted hover:text-white
                    transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden flex">
                            <div className="w-1/2 border-r border-border-color flex flex-col">
                                <div
                                    className="p-3 bg-black/60 border-b border-border-color text-xs font-mono text-text-muted flex justify-between">
                                    <span>tailwind.config.js</span>
                                    <Copy size={12} className="cursor-pointer hover:text-white" />
                                </div>
                                <div className="flex-1 overflow-auto p-4 bg-[#050505]">
                                    <pre
                                        className="text-xs font-mono text-gray-400 leading-relaxed whitespace-pre-wrap">{JSON.stringify(IAM_TAILWIND_CONFIG, null, 2)}</pre>
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col">
                                <div
                                    className="p-3 bg-black/60 border-b border-border-color text-xs font-mono text-text-muted flex justify-between">
                                    <span>globals.css</span>
                                    <Copy size={12} className="cursor-pointer hover:text-white" />
                                </div>
                                <div className="flex-1 overflow-auto p-4 bg-[#050505]">
                                    <pre
                                        className="text-xs font-mono text-gray-400 leading-relaxed whitespace-pre-wrap">{IAM_CUSTOM_CSS}</pre>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border-color bg-black/40 flex justify-end">
                            <button onClick={() => setShowExport(false)} className="btn-titanium px-6 py-2 rounded-sm text-xs
                    font-bold">Done</button>
                        </div>
                    </div>
                </div>
            )}

            <header className="p-8 border-b border-border-color bg-black/20 backdrop-blur-sm flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-light tracking-tight">Token Studio</h1>
                    <p className="text-text-muted text-xs font-mono mt-2 tracking-widest uppercase">Global Design System
                        Controller</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowExport(true)} className="btn-glass px-5 py-2 text-xs font-mono flex
                items-center gap-2 rounded-sm uppercase tracking-wide group hover:border-white">
                        <FileJson size={14} className="group-hover:text-white transition-colors" /> View Config
                    </button>
                    <button
                        className="btn-titanium px-5 py-2 text-xs font-mono flex items-center gap-2 rounded-sm uppercase tracking-wide">
                        <Zap size={14} /> Deploy
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* CONTROLS */}
                <div className="w-80 border-r border-border-color bg-black/60 p-6 overflow-y-auto backdrop-blur-md">
                    <div className="flex gap-1 mb-8 p-1 bg-white/5 rounded-sm border border-white/5">
                        {['colors', 'type', 'space'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`flex-1 text-[10px] font-mono uppercase py-2 rounded-sm transition-all ${activeTab ===
                                    tab ? 'bg-white text-black font-bold shadow-sm' : 'text-text-muted hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'colors' && (
                        <div className="space-y-8">
                            {Object.entries(colors).map(([key, val]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-3">
                                        <label
                                            className="text-[10px] font-mono uppercase text-white font-bold tracking-wider">{key}</label>
                                        <span className="text-[10px] font-mono text-text-muted">{val}</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div
                                            className="relative w-10 h-10 rounded-sm overflow-hidden border border-border-color shrink-0 group-hover:border-white transition-colors">
                                            <input type="color" value={val} onChange={(e) => setColors({
                                                ...colors, [key]:
                                                    e.target.value
                                            })}
                                                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] cursor-pointer p-0 m-0
                            border-0"
                                            />
                                        </div>
                                        <input type="text" value={val} readOnly
                                            className="w-full bg-black/50 border border-border-color rounded-sm px-3 py-2 text-xs font-mono text-text-muted focus:border-white focus:text-white outline-none transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab !== 'colors' && (
                        <div
                            className="h-64 flex flex-col items-center justify-center text-text-muted opacity-30 border-2 border-dashed border-white/10 rounded-sm">
                            <div className="w-12 h-12 flex items-center justify-center mb-4">
                                <Lock size={20} />
                            </div>
                            <span className="text-xs font-mono uppercase tracking-widest">Locked</span>
                        </div>
                    )}
                </div>

                {/* PREVIEW CANVAS */}
                <div className="flex-1 bg-[#050505] relative flex flex-col">
                    <div
                        className="h-10 border-b border-border-color flex items-center justify-between px-6 bg-black/40 backdrop-blur-sm">
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Preview: i.AM Auth
                            Card</span>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full border border-white/20"></div>
                            <div className="w-2 h-2 rounded-full border border-white/20"></div>
                        </div>
                    </div>
                    <div
                        className="flex-1 flex items-center justify-center p-10 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]">
                        {/* DYNAMIC PREVIEW - THE SIGNATURE I.AM CARD */}
                        <div className="w-full max-w-[380px] p-10 rounded-sm border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-colors duration-300 relative overflow-hidden backdrop-blur-xl"
                            style={{ backgroundColor: colors.surface }}>

                            {/* Card Ambient Glow */}
                            <div
                                className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-5 blur-[60px] pointer-events-none rounded-full">
                            </div>

                            <div className="mb-8">
                                <div
                                    className="w-12 h-12 bg-white text-black flex items-center justify-center text-xl font-bold rounded-sm mb-6">
                                    i</div>
                                <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Welcome back</h2>
                                <p className="text-sm text-gray-500 font-light">Enter your credentials to access the vault.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <label
                                        className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Email</label>
                                    <div
                                        className="h-12 bg-black/50 rounded-sm border border-white/20 w-full flex items-center px-4 text-sm text-gray-300">
                                        founder@rayzen.io</div>
                                </div>
                                <div className="space-y-1">
                                    <label
                                        className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Password</label>
                                    <div
                                        className="h-12 bg-black/50 rounded-sm border border-white/20 w-full flex items-center px-4 text-sm text-gray-300">
                                        •••••••••••••</div>
                                </div>

                                <button
                                    className="w-full h-12 rounded-sm font-bold text-xs uppercase tracking-[0.15em] transition-all hover:opacity-90 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                                    style={{
                                        backgroundColor: colors.accent, color: colors.primary === '#ffffff' ? '#000' :
                                            (colors.accent === '#ffffff' ? '#000' : '#fff')
                                    }}>
                                    Authenticate
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DESIGN VAULT ---
const DesignVault = () => {
    const [mode, setMode] = useState('list');
    const [designs, setDesigns] = useState<Design[]>(MOCK_DESIGNS);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Generate a UI component using Tailwind CSS with Custom i.AM Config.

SYSTEM TOKENS (MUST USE):
- BG: 'bg-bg-primary' (Black) or 'bg-bg-secondary' (Dark Grey)
- TEXT: 'text-main' (White) or 'text-text-muted' (Grey)
- BORDER: 'border-border-color' (White/12)
- PANEL: 'glass-panel' (Class for frosted glass backgrounds)
- BUTTON: 'btn-titanium' (Class for primary white buttons)

Style: Stark Black/White, Enterprise, Sharp Corners.
Request: ${prompt}.
Output ONLY raw HTML code. No markdown.`
            });
            const raw = response.text.replace(/```html/g, '').replace(/```/g, '');
            setGeneratedCode(raw);
        } catch (e) {
            console.error(e);
            alert('Check API Key configuration.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedCode) return;
        setDesigns([{
            id: generateId(),
            name: prompt.substring(0, 20) || 'New Design',
            category: 'component',
            projectId: 'p1',
            updatedAt: 'Just now',
            status: 'draft',
            code: generatedCode
        }, ...designs]);
        setMode('list');
        setPrompt('');
        setGeneratedCode(null);
    };

    if (mode === 'create') {
        return (
            <div className="h-full flex flex-col animate-in p-8">
                <header className="flex items-center gap-6 mb-8 pb-6 border-b border-border-color">
                    <button onClick={() => setMode('list')} className="w-10 h-10 flex items-center justify-center hover:bg-white/10
            rounded-sm transition-colors border border-transparent hover:border-white/10 group">
                        <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
                    </button>
                    <h1 className="text-2xl font-light tracking-tight">Generator Protocol</h1>
                </header>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
                    <div className="glass-panel p-8 rounded-sm flex flex-col h-full border-l-4 border-l-white bg-black/40">
                        <label
                            className="text-[10px] font-mono font-bold mb-4 text-white flex items-center gap-2 uppercase tracking-widest">
                            <Sparkles size={12} /> AI Command Terminal
                        </label>
                        <textarea
                            className="w-full h-48 bg-black/60 border border-border-color rounded-sm p-5 text-sm mb-6 focus:border-white outline-none transition-colors font-mono text-gray-300 resize-none leading-relaxed"
                            placeholder="// Initialize component generation..." value={prompt} onChange={e => setPrompt(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mb-8">
                            <button onClick={handleGenerate} disabled={isGenerating} className={`btn-titanium px-8 py-3 rounded-sm
                    text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-3 ${isGenerating
                                    ? 'opacity-50' : ''}`}>
                                {isGenerating ?
                                    <RefreshCw className="animate-spin" size={14} /> :
                                    <Zap size={14} />}
                                {isGenerating ? 'Compiling...' : 'Execute Build'}
                            </button>
                        </div>

                        {generatedCode && (
                            <div className="flex-1 flex flex-col min-h-0 animate-in border-t border-border-color pt-6">
                                <div className="text-[10px] text-text-muted mb-3 font-mono uppercase flex justify-between">
                                    <span>Output Source</span>
                                    <span className="text-white flex items-center gap-1">
                                        <ShieldCheck size={10} /> Verified
                                    </span>
                                </div>
                                <div
                                    className="flex-1 bg-black/80 p-5 rounded-sm overflow-auto code-preview border border-border-color mb-6 text-xs font-mono text-gray-400">
                                    {generatedCode}
                                </div>
                                <button onClick={handleSave}
                                    className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-sm text-xs uppercase tracking-widest border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    Commit to Vault
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel rounded-sm flex flex-col overflow-hidden border border-border-color">
                        <div
                            className="h-12 bg-black/60 border-b border-border-color flex justify-between items-center px-5 backdrop-blur-md">
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Viewport Render</span>
                            <div className="flex gap-3 opacity-50">
                                <Monitor size={14} />
                                <Smartphone size={14} />
                            </div>
                        </div>
                        <div className="flex-1 bg-[#000] flex items-center justify-center p-8 relative">
                            <div
                                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]">
                            </div>
                            {generatedCode ? (
                                <iframe className="w-full h-full border-0 relative z-10 bg-transparent"
                                    srcDoc={wrapHtml(generatedCode)} />
                            ) : (
                                <div className="text-center text-text-muted opacity-20">
                                    <div
                                        className="w-20 h-20 border border-white/20 rounded-sm flex items-center justify-center mx-auto mb-6">
                                        <Command size={40} />
                                    </div>
                                    <p className="font-mono text-xs uppercase tracking-widest">Awaiting Input Signal</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-12 h-full animate-in flex flex-col">
            <header className="flex justify-between items-end mb-12 border-b border-border-color pb-6">
                <div>
                    <h1 className="text-5xl font-light mb-2 tracking-tight">i.AM VAULT</h1>
                    <p className="text-text-muted text-sm font-light uppercase tracking-widest">Component Registry:
                        {designs.length} Units</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-3 text-text-muted group-hover:text-white transition-colors"
                            size={16} />
                        <input type="text" placeholder="SEARCH REGISTRY..."
                            className="bg-black/40 border border-border-color rounded-sm pl-11 pr-5 py-2.5 text-xs font-mono w-64 focus:border-white outline-none text-white transition-colors placeholder:text-gray-700 uppercase" />
                    </div>
                    <button onClick={() => setMode('create')}
                        className="btn-titanium px-6 py-2.5 rounded-sm text-xs font-bold flex items-center gap-2 uppercase
                tracking-wide"
                    >
                        <Plus size={16} /> New Entry
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-y-auto pb-10">
                {designs.map(design => (
                    <div key={design.id}
                        className="glass-panel rounded-sm overflow-hidden hover:border-white/40 transition-all duration-500 group cursor-pointer flex flex-col hover:-translate-y-1">
                        <div
                            className="h-48 bg-black/40 border-b border-border-color relative flex items-center justify-center group-hover:bg-black/60 transition-colors">
                            <div className="text-6xl font-bold text-white/5 select-none tracking-tighter">
                                {design.category[0].toUpperCase()}</div>
                            <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                                <button className="bg-white text-black rounded-sm p-3 hover:scale-110 transition-transform">
                                    <Eye size={18} />
                                </button>
                                <button
                                    className="bg-black text-white border border-white/20 rounded-sm p-3 hover:scale-110 transition-transform"><Code
                                        size={18} /></button>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-base text-gray-200 truncate pr-2 tracking-tight">{design.name}</h3>
                                {design.status === 'live' && <div
                                    className="w-2 h-2 rounded-full bg-white mt-1.5 shadow-[0_0_10px_rgba(255,255,255,0.6)]"></div>}
                            </div>
                            <div className="text-[10px] text-text-muted font-mono mb-6 uppercase tracking-wider">{design.category}
                            </div>
                            <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                                <span
                                    className="text-[10px] font-mono text-text-muted group-hover:text-white transition-colors">{design.projectId}</span>
                                <span className="text-[10px] text-text-muted">{design.updatedAt}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const App = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((authUser) => {
            setUser(authUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono text-sm animate-pulse">Loading vault...</div>
            </div>
        );
    }

    if (!user) {
        return <Login onLogin={() => setLoading(true)} />;
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden text-sm font-sans">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 bg-transparent relative z-10 overflow-hidden flex flex-col">
                {activeView === 'dashboard' && <DashboardView />}
                {activeView === 'designs' && <DesignVault />}
                {activeView === 'tokens' && <TokenStudio />}
                {(activeView === 'projects' || activeView === 'deploy') && (
                    <div className="h-full flex items-center justify-center flex-col animate-in">
                        <div className="w-20 h-20 border border-white/10 rounded-sm flex items-center justify-center mb-8 bg-black/20">
                            <Terminal size={40} className="text-white/20" />
                        </div>
                        <h2 className="text-2xl font-light text-white mb-2 tracking-tight">Module Offline</h2>
                        <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Awaiting Phase 5 Implementation</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;