'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  RotateCcw, 
  Search, 
  FileCode, 
  Folder, 
  Sparkles, 
  Maximize2, 
  Info, 
  Layers, 
  Cpu,
  ChevronRight,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

// Define structures for our custom physics simulation nodes and links
interface Node {
  id: string;
  name: string;
  type: 'root' | 'folder' | 'file';
  size: number; // radius for visualization
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null; // fixed coordinate (during dragging)
  fy: number | null;
  // Metadata
  lines?: number;
  fileSize?: string;
  language?: string;
  path: string;
  codePreview?: string;
}

interface Link {
  source: string;
  target: string;
  type: 'structure' | 'import';
}

const mockNodes: Node[] = [
  { id: 'root', name: 'web-platform', type: 'root', size: 24, color: '#3b82f6', x: 400, y: 300, vx: 0, vy: 0, fx: null, fy: null, path: '/', lines: 2500, fileSize: '1.2 MB' },
  // Folders
  { id: 'src', name: 'src', type: 'folder', size: 18, color: '#a855f7', x: 300, y: 250, vx: 0, vy: 0, fx: null, fy: null, path: '/src' },
  { id: 'components', name: 'components', type: 'folder', size: 16, color: '#d946ef', x: 220, y: 200, vx: 0, vy: 0, fx: null, fy: null, path: '/src/components' },
  { id: 'lib', name: 'lib', type: 'folder', size: 16, color: '#d946ef', x: 420, y: 180, vx: 0, vy: 0, fx: null, fy: null, path: '/src/lib' },
  { id: 'app', name: 'app', type: 'folder', size: 16, color: '#d946ef', x: 350, y: 350, vx: 0, vy: 0, fx: null, fy: null, path: '/src/app' },
  { id: 'public', name: 'public', type: 'folder', size: 16, color: '#d946ef', x: 500, y: 350, vx: 0, vy: 0, fx: null, fy: null, path: '/public' },
  
  // Files in components
  { 
    id: 'Button.tsx', 
    name: 'Button.tsx', 
    type: 'file', 
    size: 10, 
    color: '#06b6d4', 
    x: 150, 
    y: 130, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/components/Button.tsx',
    lines: 74,
    fileSize: '2.4 KB',
    language: 'TypeScript (React)',
    codePreview: `import * as React from 'react';\nimport { Slot } from '@radix-ui/react-slot';\nimport { cva, type VariantProps } from 'class-variance-authority';\n\nconst buttonVariants = cva(\n  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",\n  {\n    variants: {\n      variant: {\n        default: "bg-primary text-primary-foreground hover:bg-primary/90",\n        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",\n        outline: "border border-input hover:bg-accent hover:text-accent-foreground",\n      }\n    }\n  }\n);`
  },
  { 
    id: 'Card.tsx', 
    name: 'Card.tsx', 
    type: 'file', 
    size: 10, 
    color: '#06b6d4', 
    x: 180, 
    y: 100, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/components/Card.tsx',
    lines: 52,
    fileSize: '1.8 KB',
    language: 'TypeScript (React)',
    codePreview: `import * as React from 'react';\nimport { cn } from '@/lib/utils';\n\nconst Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (\n  <div\n    ref={ref}\n    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}\n    {...props}\n  />\n));\nCard.displayName = "Card";`
  },
  { 
    id: 'Sidebar.tsx', 
    name: 'Sidebar.tsx', 
    type: 'file', 
    size: 10, 
    color: '#06b6d4', 
    x: 230, 
    y: 120, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/components/Sidebar.tsx',
    lines: 143,
    fileSize: '4.2 KB',
    language: 'TypeScript (React)',
    codePreview: `'use client';\nimport * as React from 'react';\nimport Link from 'next/link';\nimport { usePathname } from 'next/navigation';\nimport { cn } from '@/lib/utils';\n\nexport function Sidebar({ open, onClose }) {\n  const pathname = usePathname();\n  return (\n    <aside className={cn("fixed inset-y-0 left-0 w-64 border-r bg-card")}>\n      {/* Sidebar navigation list */}\n    </aside>\n  );\n}`
  },

  // Files in lib
  { 
    id: 'utils.ts', 
    name: 'utils.ts', 
    type: 'file', 
    size: 10, 
    color: '#34d399', 
    x: 480, 
    y: 120, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/lib/utils.ts',
    lines: 22,
    fileSize: '0.8 KB',
    language: 'TypeScript',
    codePreview: `import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n\nexport function formatBytes(bytes: number, decimals = 2) {\n  if (!bytes) return "0 Bytes";\n  const k = 1024;\n  const i = Math.floor(Math.log(bytes) / Math.log(k));\n  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + ["Bytes", "KB", "MB"][i];\n}`
  },
  { 
    id: 'auth.ts', 
    name: 'auth.ts', 
    type: 'file', 
    size: 10, 
    color: '#34d399', 
    x: 450, 
    y: 90, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/lib/auth.ts',
    lines: 98,
    fileSize: '3.1 KB',
    language: 'TypeScript',
    codePreview: `import { jwtVerify, SignJWT } from 'jose';\n\nexport async function verifyJWT(token: string) {\n  try {\n    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));\n    return payload;\n  } catch (err) {\n    return null;\n  }\n}`
  },

  // Files in app
  { 
    id: 'layout.tsx', 
    name: 'layout.tsx', 
    type: 'file', 
    size: 10, 
    color: '#06b6d4', 
    x: 310, 
    y: 430, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/app/layout.tsx',
    lines: 48,
    fileSize: '1.2 KB',
    language: 'TypeScript (React)',
    codePreview: `import '@/app/globals.css';\nimport { Inter } from 'next/font/google';\n\nconst inter = Inter({ subsets: ['latin'] });\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en" className="dark">\n      <body className={inter.className}>{children}</body>\n    </html>\n  );\n}`
  },
  { 
    id: 'page.tsx', 
    name: 'page.tsx', 
    type: 'file', 
    size: 10, 
    color: '#06b6d4', 
    x: 390, 
    y: 450, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/src/app/page.tsx',
    lines: 180,
    fileSize: '5.6 KB',
    language: 'TypeScript (React)',
    codePreview: `import { MarketingNavbar } from '@/components/marketing-navbar';\nimport { LandingHero } from '@/components/landing-sections';\n\nexport default function Home() {\n  return (\n    <main className="min-h-screen bg-background text-foreground">\n      <MarketingNavbar />\n      <LandingHero />\n    </main>\n  );\n}`
  },

  // General files
  { 
    id: 'package.json', 
    name: 'package.json', 
    type: 'file', 
    size: 11, 
    color: '#fbbf24', 
    x: 220, 
    y: 380, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/package.json',
    lines: 45,
    fileSize: '1.6 KB',
    language: 'JSON',
    codePreview: `{\n  "name": "web-platform",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start",\n    "lint": "next lint"\n  },\n  "dependencies": {\n    "next": "13.5.4",\n    "react": "18.2.0",\n    "tailwind-merge": "^1.14.0"\n  }\n}`
  },
  { 
    id: 'tsconfig.json', 
    name: 'tsconfig.json', 
    type: 'file', 
    size: 11, 
    color: '#fbbf24', 
    x: 480, 
    y: 280, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/tsconfig.json',
    lines: 28,
    fileSize: '0.6 KB',
    language: 'JSON',
    codePreview: `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noEmit": true\n  }\n}`
  },
  { 
    id: 'README.md', 
    name: 'README.md', 
    type: 'file', 
    size: 11, 
    color: '#f43f5e', 
    x: 550, 
    y: 220, 
    vx: 0, 
    vy: 0, 
    fx: null, 
    fy: null, 
    path: '/README.md',
    lines: 112,
    fileSize: '4.2 KB',
    language: 'Markdown',
    codePreview: `# Web Platform\n\nProduction-ready client application. Built using Next.js 13 and TailwindCSS.\n\n## Get Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
  },
];

const mockLinks: Link[] = [
  // Folder structure links
  { source: 'root', target: 'src', type: 'structure' },
  { source: 'src', target: 'components', type: 'structure' },
  { source: 'src', target: 'lib', type: 'structure' },
  { source: 'src', target: 'app', type: 'structure' },
  { source: 'root', target: 'public', type: 'structure' },
  { source: 'root', target: 'package.json', type: 'structure' },
  { source: 'root', target: 'tsconfig.json', type: 'structure' },
  { source: 'root', target: 'README.md', type: 'structure' },

  // Files in components
  { source: 'components', target: 'Button.tsx', type: 'structure' },
  { source: 'components', target: 'Card.tsx', type: 'structure' },
  { source: 'components', target: 'Sidebar.tsx', type: 'structure' },

  // Files in lib
  { source: 'lib', target: 'utils.ts', type: 'structure' },
  { source: 'lib', target: 'auth.ts', type: 'structure' },

  // Files in app
  { source: 'app', target: 'layout.tsx', type: 'structure' },
  { source: 'app', target: 'page.tsx', type: 'structure' },

  // Code dependency/import links (wow overlay)
  { source: 'page.tsx', target: 'Button.tsx', type: 'import' },
  { source: 'page.tsx', target: 'Card.tsx', type: 'import' },
  { source: 'Sidebar.tsx', target: 'utils.ts', type: 'import' },
  { source: 'layout.tsx', target: 'utils.ts', type: 'import' },
  { source: 'auth.ts', target: 'utils.ts', type: 'import' },
];

export default function CodebaseVisualizerPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  
  // State variables
  const [nodes, setNodes] = React.useState<Node[]>(JSON.parse(JSON.stringify(mockNodes)));
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = React.useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'all' | 'structure' | 'imports'>('all');
  
  // AI Scanning Visualizer
  const [scanning, setScanning] = React.useState(false);
  const [scanIndex, setScanIndex] = React.useState(-1);
  const scanTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Dragging states
  const dragNodeRef = React.useRef<Node | null>(null);
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });

  const fetchGraphData = React.useCallback(async () => {
    try {
      const res = await fetch('/api/visualizer');
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.nodes.length > 0) {
          toast.success(`Loaded architecture graph: ${data.totalModules} modules parsed.`);
        }
      }
    } catch {
      // Keep local mock visualization active
    }
  }, []);

  React.useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  // Update selectedNode if local state changes
  React.useEffect(() => {
    if (selectedNode) {
      const match = nodes.find(n => n.id === selectedNode.id);
      if (match) setSelectedNode(match);
    }
  }, [nodes]);

  // physics forces parameters
  const linkDistance = 70;
  const gravityForce = 0.05;
  const repulsionForce = 450;
  const friction = 0.85;

  // Search filtered node IDs
  const matchingNodeIds = React.useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(nodes.filter(n => n.name.toLowerCase().includes(q)).map(n => n.id));
  }, [searchQuery, nodes]);

  // AI scan runner
  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanIndex(0);
    setSelectedNode(null);
    toast.info('Starting AI codebase mapping scan...');
  };

  const stopScan = () => {
    setScanning(false);
    setScanIndex(-1);
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
  };

  React.useEffect(() => {
    if (scanning && scanIndex >= 0) {
      if (scanIndex >= nodes.length) {
        stopScan();
        toast.success('AI codebase mapping index completed!');
        return;
      }

      // Highlight current node
      setSelectedNode(nodes[scanIndex]);
      
      const timer = setTimeout(() => {
        setScanIndex(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [scanning, scanIndex]);

  // Main animation frame for physics simulation
  React.useEffect(() => {
    let animationId: number;

    const tick = () => {
      setNodes(prevNodes => {
        const nextNodes = prevNodes.map(n => ({ ...n }));
        const nMap = new Map(nextNodes.map(n => [n.id, n]));

        // 1. Repulsion between all nodes (prevent overlaps)
        for (let i = 0; i < nextNodes.length; i++) {
          const u = nextNodes[i];
          for (let j = i + 1; j < nextNodes.length; j++) {
            const v = nextNodes[j];
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const distSq = dx * dx + dy * dy || 1;
            const dist = Math.sqrt(distSq);

            if (dist < 120) {
              const force = repulsionForce / distSq;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (u.fx === null) { u.vx -= fx; u.vy -= fy; }
              if (v.fx === null) { v.vx += fx; v.vy += fy; }
            }
          }
        }

        // 2. Link attractive force
        mockLinks.forEach(link => {
          // Filter based on view mode
          if (viewMode === 'structure' && link.type === 'import') return;
          if (viewMode === 'imports' && link.type === 'structure') return;

          const u = nMap.get(link.source);
          const v = nMap.get(link.target);
          if (!u || !v) return;

          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const delta = dist - linkDistance;

          const strength = link.type === 'structure' ? 0.08 : 0.03;
          const fx = (dx / dist) * delta * strength;
          const fy = (dy / dist) * delta * strength;

          if (u.fx === null) { u.vx += fx; u.vy += fy; }
          if (v.fx === null) { v.vx -= fx; v.vy -= fy; }
        });

        // 3. Gravity pulling toward center
        const cx = 350;
        const cy = 250;
        nextNodes.forEach(u => {
          if (u.fx !== null) return;
          u.vx += (cx - u.x) * gravityForce * 0.1;
          u.vy += (cy - u.y) * gravityForce * 0.1;
        });

        // 4. Apply velocities & friction, bounding box constraints
        nextNodes.forEach(u => {
          if (u.fx !== null && u.fy !== null) {
            u.x = u.fx;
            u.y = u.fy;
            u.vx = 0;
            u.vy = 0;
          } else {
            u.vx *= friction;
            u.vy *= friction;
            u.x += u.vx;
            u.y += u.vy;

            // boundaries
            const padding = 20;
            if (canvasRef.current) {
              const w = canvasRef.current.width;
              const h = canvasRef.current.height;
              u.x = Math.max(padding, Math.min(w - padding, u.x));
              u.y = Math.max(padding, Math.min(h - padding, u.y));
            }
          }
        });

        return nextNodes;
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [viewMode]);

  // Render Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas resolution
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid lines (subtle cyber aesthetic)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw links
    mockLinks.forEach(link => {
      // Filter based on view mode
      if (viewMode === 'structure' && link.type === 'import') return;
      if (viewMode === 'imports' && link.type === 'structure') return;

      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return;

      // Glow lines if related to active or hovered node
      const isHighlighted = 
        (selectedNode && (sourceNode.id === selectedNode.id || targetNode.id === selectedNode.id)) ||
        (hoveredNode && (sourceNode.id === hoveredNode.id || targetNode.id === hoveredNode.id));

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);

      if (link.type === 'import') {
        // Dash pattern for import dependencies
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isHighlighted 
          ? 'rgba(6, 182, 212, 0.8)' 
          : 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
      } else {
        // Solid line for folders directory structures
        ctx.setLineDash([]);
        ctx.strokeStyle = isHighlighted 
          ? 'rgba(168, 85, 247, 0.8)' 
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isHighlighted ? 2 : 1;
      }

      ctx.stroke();
    });
    ctx.setLineDash([]); // Reset line dash

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const isMatching = searchQuery.trim() !== '' && matchingNodeIds.has(node.id);

      // Node shadow/glow
      ctx.shadowBlur = (isSelected || isHovered || isMatching) ? 18 : 0;
      ctx.shadowColor = node.color;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size + (isHovered ? 2 : 0), 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Outer rings
      ctx.shadowBlur = 0; // Reset shadow for outline
      if (isSelected || isMatching) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 6, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Labels
      ctx.fillStyle = (isSelected || isHovered) ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
      ctx.font = (isSelected || isHovered) ? 'semibold 11px system-ui' : '10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Draw background tag for high text contrast
      const text = node.name;
      const metrics = ctx.measureText(text);
      const bgW = metrics.width + 8;
      const bgH = 14;
      ctx.fillStyle = 'rgba(9, 9, 11, 0.6)';
      ctx.fillRect(node.x - bgW / 2, node.y + node.size + 4, bgW, bgH);

      // Text color write
      ctx.fillStyle = (isSelected) 
        ? '#60a5fa' 
        : isHovered 
        ? '#ffffff' 
        : isMatching 
        ? '#fbbf24' 
        : 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(text, node.x, node.y + node.size + 6);
    });

  }, [nodes, selectedNode, hoveredNode, searchQuery, matchingNodeIds, viewMode]);

  // Canvas interaction mouse events
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // Translate client mouse coordinates into canvas coordinates
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (scanning) return; // Prevent interference during automated AI scan
    const { x, y } = getMousePos(e);
    
    // Find clicked node
    const clicked = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.size + 10;
    });

    if (clicked) {
      dragNodeRef.current = clicked;
      dragOffsetRef.current = { x: clicked.x - x, y: clicked.y - y };
      
      // Fix physics anchors
      setNodes(prev => prev.map(n => {
        if (n.id === clicked.id) {
          n.fx = x;
          n.fy = y;
        }
        return n;
      }));

      setSelectedNode(clicked);
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);

    // If dragging node, update its fixed coords
    if (dragNodeRef.current) {
      setNodes(prev => prev.map(n => {
        if (n.id === dragNodeRef.current!.id) {
          n.fx = x;
          n.fy = y;
        }
        return n;
      }));
      return;
    }

    // Otherwise, handle node hovering highlight
    const hoverTarget = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.size + 8;
    });
    setHoveredNode(hoverTarget ?? null);
  };

  const handleMouseUp = () => {
    if (dragNodeRef.current) {
      const dragId = dragNodeRef.current.id;
      setNodes(prev => prev.map(n => {
        if (n.id === dragId) {
          n.fx = null;
          n.fy = null;
        }
        return n;
      }));
      dragNodeRef.current = null;
    }
  };

  const resetGraph = () => {
    stopScan();
    setNodes(JSON.parse(JSON.stringify(mockNodes)));
    setSelectedNode(null);
    setSearchQuery('');
    toast.success('Visualizer physics and positions reset.');
  };

  return (
    <AppShell>
      <PageHeader
        title="Codebase Visualizer"
        description="Interact with a visual 2D/3D map of your directories, file footprints, and dependencies."
        actions={
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant={scanning ? 'destructive' : 'outline'}
              onClick={scanning ? stopScan : startScan}
              className="bg-card hover:bg-accent/40"
            >
              <Sparkles className={`mr-2 h-4 w-4 text-purple-400 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? 'Stop AI Scan' : 'Run AI Code Scan'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={resetGraph}
              className="bg-card hover:bg-accent/40"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Layout
            </Button>
          </div>
        }
      />

      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* Canvas panel */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/45 backdrop-blur-sm">
          {/* Controls Overlay Header */}
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(val) => setViewMode(val as any)}
              className="h-9"
            >
              <TabsList className="bg-background/80 backdrop-blur border border-border/60 h-9 p-0.5">
                <TabsTrigger value="all" className="text-xs h-8">All Links</TabsTrigger>
                <TabsTrigger value="structure" className="text-xs h-8">Folders Only</TabsTrigger>
                <TabsTrigger value="imports" className="text-xs h-8">Imports Only</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="absolute right-4 top-4 z-10 flex w-60 items-center">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 bg-background/80 backdrop-blur pl-9 text-xs"
              />
            </div>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={750}
              height={500}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-full block"
            />
          </div>

          {/* Canvas legends footer */}
          <div className="absolute bottom-4 left-4 flex gap-4 rounded-lg bg-background/60 backdrop-blur border border-border/50 p-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span>Root Project</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span>Folder Directory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-cyan-400" />
              <span>React/TS Component</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span>Library Utility</span>
            </div>
          </div>
        </div>

        {/* Sidebar file information inspector */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/45 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full overflow-hidden"
              >
                {/* Node Details Header */}
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${selectedNode.color}, rgba(0,0,0,0.4))`,
                        boxShadow: `0 4px 12px ${selectedNode.color}25`
                      }}
                    >
                      {selectedNode.type === 'file' ? (
                        <FileCode className="h-5 w-5" />
                      ) : (
                        <Folder className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{selectedNode.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{selectedNode.path}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {/* File/Folder Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/50 bg-background/30 p-3">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Type</p>
                      <p className="mt-1 text-sm font-medium capitalize text-foreground/95">{selectedNode.type}</p>
                    </div>
                    {selectedNode.fileSize && (
                      <div className="rounded-xl border border-border/50 bg-background/30 p-3">
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">File Footprint</p>
                        <p className="mt-1 text-sm font-medium text-foreground/95">{selectedNode.fileSize}</p>
                      </div>
                    )}
                    {selectedNode.lines && (
                      <div className="rounded-xl border border-border/50 bg-background/30 p-3 col-span-2">
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Line Count</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-400">{selectedNode.lines} lines</span>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">Low complexity</Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Code Editor Preview */}
                  {selectedNode.codePreview && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <span className="font-semibold text-foreground/80">Code Snippet</span>
                        <span>{selectedNode.language}</span>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-border bg-[hsl(230_25%_4%)]">
                        <pre className="overflow-x-auto p-3 text-[10.5px] leading-relaxed text-blue-100 font-mono select-all max-h-56 scrollbar-thin">
                          <code>{selectedNode.codePreview}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Dependent Imports summary list */}
                  {selectedNode.type === 'file' && (
                    <div className="rounded-xl border border-border/60 bg-background/25 p-3">
                      <p className="text-xs font-semibold flex items-center gap-1 text-cyan-400 mb-2">
                        <Layers className="h-3.5 w-3.5" />
                        Code Connections
                      </p>
                      <div className="space-y-1.5 text-xs">
                        {mockLinks
                          .filter(link => link.type === 'import' && (link.source === selectedNode.id || link.target === selectedNode.id))
                          .map((link, idx) => {
                            const relation = link.source === selectedNode.id ? 'Imports' : 'Imported by';
                            const fileRef = link.source === selectedNode.id ? link.target : link.source;
                            return (
                              <div key={idx} className="flex items-center justify-between text-muted-foreground py-1 border-b border-border/40 last:border-0">
                                <span className="text-[11px]">{relation}</span>
                                <span className="font-medium text-foreground bg-accent/40 px-1.5 py-0.5 rounded">{fileRef}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full p-8 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-primary">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Interactive Inspector</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                  Click on any node in the codebase network map or run the AI Scan to view file structures, footprints, and code snippets.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
