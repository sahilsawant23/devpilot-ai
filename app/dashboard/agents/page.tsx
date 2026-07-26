'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  Terminal, 
  Cpu, 
  Sparkles, 
  GitPullRequest, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Clock,
  Shield,
  Zap,
  TestTube,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

interface AgentType {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  description: string;
  color: string;
  metrics: { cpu: string; speed: string; reliability: string };
}

const AGENT_TYPES: AgentType[] = [
  {
    id: 'auditor',
    name: 'Security Auditor Agent',
    role: 'Vulnerability Analysis & Patching',
    icon: Shield,
    description: 'Scans files for security leaks, injection vectors, and signs cryptographic fixes.',
    color: 'hsl(346, 84%, 61%)',
    metrics: { cpu: 'High', speed: 'Fast', reliability: '98%' }
  },
  {
    id: 'tuner',
    name: 'Performance Optimizer',
    role: 'Database & Code Execution Tuner',
    icon: Zap,
    description: 'Finds N+1 queries, memory bottlenecks, and rewrites async logic for speed.',
    color: 'hsl(45, 93%, 47%)',
    metrics: { cpu: 'Medium', speed: 'Ultra-Fast', reliability: '94%' }
  },
  {
    id: 'tester',
    name: 'QA Test Expansion Agent',
    role: 'Automated Unit/Integration Testing',
    icon: TestTube,
    description: 'Increases file coverage, mocks network requests, and tests complex edge cases.',
    color: 'hsl(142, 71%, 45%)',
    metrics: { cpu: 'Low', speed: 'Standard', reliability: '99%' }
  }
];

interface LogEntry {
  time: string;
  type: 'system' | 'thought' | 'action' | 'success' | 'error';
  text: string;
}

const SIMULATION_STEPS = [
  { id: 'fetch', label: 'Retrieve Repo', desc: 'Cloning and loading file context' },
  { id: 'search', label: 'Semantic Search', desc: 'Analyzing files and locating symbols' },
  { id: 'analyze', label: 'Analyze Issues', desc: 'Evaluating vulnerabilities or bottlenecks' },
  { id: 'patch', label: 'Generate Patch', desc: 'Writing cleaner code replacements' },
  { id: 'compile', label: 'Compile & Validate', desc: 'Running types check, lints and tests' },
  { id: 'pr', label: 'Push PR', desc: 'Committing code and opening a pull request' }
];

const AGENT_LOGS: Record<string, LogEntry[]> = {
  auditor: [
    { time: '00:01', type: 'system', text: 'Spawning Security Auditor Agent...' },
    { time: '00:03', type: 'thought', text: 'Thought: Checking src/lib/auth.ts for insecure JWT signatures.' },
    { time: '00:06', type: 'action', text: 'Action: Scanning line 18-35. Found payload decoding without signature verification.' },
    { time: '00:09', type: 'thought', text: 'Thought: Crafting security patch replacing jwt.decode() with jwt.verify().' },
    { time: '00:12', type: 'action', text: 'Action: Injecting jwt.verify() checks using verification keys.' },
    { time: '00:15', type: 'system', text: 'Running compilation checks & lints...' },
    { time: '00:17', type: 'success', text: 'Compilation checks passed. 0 issues detected.' },
    { time: '00:20', type: 'system', text: 'Committing fixes to branch: patch/secure-jwt-auth...' },
    { time: '00:22', type: 'success', text: 'Opened Pull Request #14: Secure authentication payload verification.' }
  ],
  tuner: [
    { time: '00:01', type: 'system', text: 'Spawning Performance Optimizer Agent...' },
    { time: '00:03', type: 'thought', text: 'Thought: Analysing list query loops in src/app/api/posts/route.ts.' },
    { time: '00:06', type: 'action', text: 'Action: Detected N+1 query vulnerability fetching users inside map loop.' },
    { time: '00:09', type: 'thought', text: 'Thought: Refactoring prisma queries to use dynamic include relations.' },
    { time: '00:12', type: 'action', text: 'Action: Rewrote query statement incorporating relational joins.' },
    { time: '00:15', type: 'system', text: 'Testing database latency and syntax validations...' },
    { time: '00:18', type: 'success', text: 'Latency reduced by 64%. Compilation tests passed.' },
    { time: '00:21', type: 'system', text: 'Committing fixes to branch: performance/batch-query...' },
    { time: '00:23', type: 'success', text: 'Opened Pull Request #15: Optimize database N+1 posts retrieval queries.' }
  ],
  tester: [
    { time: '00:01', type: 'system', text: 'Spawning QA Test Expansion Agent...' },
    { time: '00:03', type: 'thought', text: 'Thought: Reviewing Vitest coverage report for src/lib/utils.ts.' },
    { time: '00:06', type: 'action', text: 'Action: Found formatBytes has branches with 0 test coverage.' },
    { time: '00:09', type: 'thought', text: 'Thought: Mocking size inputs: 0 Bytes, decimals defaults, and MB scaling.' },
    { time: '00:12', type: 'action', text: 'Action: Appended 4 new assertion tests inside utils.test.ts.' },
    { time: '00:15', type: 'system', text: 'Executing test suite: npm run test...' },
    { time: '00:17', type: 'success', text: 'Test run complete: 18 passed, 0 failed. Coverage increased to 96%.' },
    { time: '00:20', type: 'system', text: 'Committing fixes to branch: tests/expand-coverage...' },
    { time: '00:22', type: 'success', text: 'Opened Pull Request #16: Increase coverage on format utility functions.' }
  ]
};

export default function AgentsConsolePage() {
  const [selectedAgent, setSelectedAgent] = React.useState<AgentType>(AGENT_TYPES[0]);
  const [instructions, setInstructions] = React.useState('');
  const [running, setRunning] = React.useState(false);
  const [currentStepIdx, setCurrentStepIdx] = React.useState(-1);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [completedPR, setCompletedPR] = React.useState<string | null>(null);

  const timerRef = React.useRef<NodeJS.Timeout[]>([]);
  const logContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Auto scroll logs console
  React.useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const deployAgent = async () => {
    if (!instructions.trim()) {
      toast.error('Please enter a goal or instructions for the agent.');
      return;
    }
    
    setRunning(true);
    setCompletedPR(null);
    setCurrentStepIdx(0);
    setLogs([{ time: '00:00', type: 'system', text: `Deploying ${selectedAgent.name}...` }]);
    toast.success(`${selectedAgent.name} successfully deployed!`);

    try {
      const res = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id === 'auditor' ? 'security' : selectedAgent.id === 'tuner' ? 'perf' : 'refactor',
        }),
      });
      const data = await res.json();

      if (data.steps) {
        let stepCount = 0;
        for (const s of data.steps) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          stepCount++;
          setCurrentStepIdx(Math.min(stepCount, SIMULATION_STEPS.length - 1));
          setLogs((prev) => [
            ...prev,
            { time: s.time, type: s.status === 'warn' ? 'error' : 'action', text: s.log },
          ]);
        }

        if (data.findings && data.findings.length > 0) {
          setLogs((prev) => [
            ...prev,
            { time: '00:01.8', type: 'success', text: `Discovered ${data.findings.length} actionable patch candidates.` },
          ]);
        }

        setCompletedPR(`Opened Pull Request #${Math.floor(Math.random() * 50) + 10}: ${data.agentName} automated resolution`);
        setLogs((prev) => [
          ...prev,
          { time: '00:02.0', type: 'success', text: `Agent execution completed successfully in ${data.executionTimeMs}ms.` },
        ]);
        toast.success(`${selectedAgent.name} execution finished!`);
      }
    } catch {
      toast.error('Network error during agent execution');
    } finally {
      setRunning(false);
    }
  };

  const terminateAgent = () => {
    // Clear all scheduled simulation triggers
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
    setRunning(false);
    setCurrentStepIdx(-1);
    setLogs(prev => [...prev, { time: 'CANCEL', type: 'error', text: 'Agent execution manually terminated by user.' }]);
    toast.error('Agent execution stopped.');
  };

  const resetConsole = () => {
    terminateAgent();
    setLogs([]);
    setInstructions('');
    setCurrentStepIdx(-1);
    setCompletedPR(null);
  };

  React.useEffect(() => {
    return () => {
      timerRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="AI Developer Agents"
        description="Launch specialized developer agents to solve bugs, optimize speeds, and manage code tests autonomously."
      />

      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        
        {/* Left pane: Spawn Control panel */}
        <div className="flex flex-col overflow-y-auto rounded-2xl border border-border/60 bg-card/45 p-5 backdrop-blur-sm scrollbar-thin">
          <h3 className="text-base font-semibold">Agent Dispatcher</h3>
          <p className="text-xs text-muted-foreground mt-1">Configure and launch autonomous agents in your codebase.</p>
          
          {/* Agent Selection List */}
          <div className="space-y-3 mt-5 flex-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">1. Select Specialist</label>
            <div className="space-y-2.5">
              {AGENT_TYPES.map((agent) => {
                const isSelected = selectedAgent.id === agent.id;
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    disabled={running}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' 
                        : 'border-border bg-background/40 hover:border-border/80 hover:bg-background/80'
                    } ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: agent.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{agent.role}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                    
                    {/* Metrics Footer */}
                    <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground font-mono">
                      <span>Reliability: <strong className="text-foreground">{agent.metrics.reliability}</strong></span>
                      <span>Speed: <strong className="text-foreground">{agent.metrics.speed}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructions Input */}
          <div className="mt-6 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">2. Assign Instructions</label>
            <Input
              disabled={running}
              placeholder="e.g., Audit authentication middleware..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="bg-background text-sm h-11"
            />
            <p className="text-[10px] text-muted-foreground leading-normal">
              Specify files, folders, or rules you want this agent to target.
            </p>
          </div>

          {/* Start/Stop Actions Footer */}
          <div className="mt-6 flex gap-2">
            {running ? (
              <Button 
                onClick={terminateAgent}
                variant="destructive" 
                className="w-full h-11 text-sm"
              >
                <Square className="mr-2 h-4 w-4 fill-white" />
                Terminate Agent
              </Button>
            ) : (
              <Button 
                onClick={deployAgent}
                disabled={!instructions.trim()}
                className="w-full h-11 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
              >
                <Play className="mr-2 h-4 w-4 fill-white" />
                Deploy Agent
              </Button>
            )}
            <Button 
              disabled={running}
              onClick={resetConsole}
              size="icon"
              variant="outline" 
              className="h-11 w-11 shrink-0 bg-background/60 hover:bg-accent/40"
              aria-label="Reset console"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right pane: Agent monitor console / Timeline */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/45 backdrop-blur-sm">
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className={`h-4.5 w-4.5 text-primary ${running ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-semibold">Active Agent Console</span>
            </div>
            {running && (
              <Badge variant="secondary" className="animate-pulse bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
                Executing Task
              </Badge>
            )}
          </div>

          {/* Main workspace scrolling panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
            
            {/* Simulation Timeline (Branching SVG layout) */}
            <div className="rounded-xl border border-border/60 bg-background/20 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">Task Timeline Flow</p>
              
              {/* Timeline nodes row */}
              <div className="flex items-center justify-between overflow-x-auto gap-4 py-2 scrollbar-thin">
                {SIMULATION_STEPS.map((step, idx) => {
                  const isActive = currentStepIdx === idx;
                  const isCompleted = currentStepIdx > idx;
                  const isLocked = currentStepIdx < idx;
                  
                  return (
                    <React.Fragment key={step.id}>
                      {/* Node circle */}
                      <div className="flex flex-col items-center shrink-0 min-w-20">
                        <div 
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ${
                            isActive 
                              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20 scale-110' 
                              : isCompleted 
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                              : 'border-border bg-background text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          ) : isActive ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <span className="text-xs font-semibold">{idx + 1}</span>
                          )}
                        </div>
                        <p className={`mt-2 text-[11px] font-semibold text-center ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className="text-[9px] text-muted-foreground text-center max-w-[80px] truncate">{step.desc}</p>
                      </div>
                      
                      {/* Connecting Line link between nodes */}
                      {idx < SIMULATION_STEPS.length - 1 && (
                        <div className="flex-1 min-w-[20px] h-[2px] bg-border relative overflow-hidden">
                          {isCompleted && (
                            <div className="absolute inset-0 bg-emerald-500 transition-all" />
                          )}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent animate-[shimmer_1.5s_infinite]" />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Bottom splits: Logs Console & Proposed output items */}
            <div className="grid gap-4 md:grid-cols-2">
              
              {/* Agent Thought stream logs console */}
              <div className="rounded-xl border border-border bg-[hsl(230,25%,4%)] p-4 flex flex-col h-72">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-3">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-slate-300 font-mono">Thought_Process_Log</span>
                </div>
                
                <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] scrollbar-thin">
                  {logs.length === 0 ? (
                    <span className="text-muted-foreground italic">Deploy an agent to watch code execution thought logs.</span>
                  ) : (
                    logs.map((log, idx) => {
                      let textCol = 'text-muted-foreground';
                      if (log.type === 'system') textCol = 'text-blue-400';
                      if (log.type === 'thought') textCol = 'text-purple-400';
                      if (log.type === 'action') textCol = 'text-cyan-400';
                      if (log.type === 'success') textCol = 'text-emerald-400';
                      if (log.type === 'error') textCol = 'text-rose-400';
                      
                      return (
                        <div key={idx} className="flex gap-2 items-start py-0.5 leading-relaxed">
                          <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                          <span className={textCol}>{log.text}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Dynamic Artifact Output (Wow output show) */}
              <div className="flex flex-col h-72">
                <AnimatePresence mode="wait">
                  {completedPR ? (
                    <motion.div
                      key="pr"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex-1 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5 flex flex-col items-center justify-center text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-3.5">
                        <GitPullRequest className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-emerald-400">Agent Task Completed</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                        The agent has successfully analyzed the files, built automated patches, and generated a Pull Request.
                      </p>
                      
                      <div className="mt-4 rounded-lg bg-background border border-border/80 p-2.5 text-xs text-foreground font-mono">
                        {completedPR}
                      </div>

                      <Button size="sm" className="mt-4 bg-emerald-500 text-white hover:bg-emerald-600 font-medium">
                        Review Pull Request
                      </Button>
                    </motion.div>
                  ) : running ? (
                    <motion.div
                      key="running"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 rounded-xl border border-border/60 bg-background/20 p-5 flex flex-col items-center justify-center text-center"
                    >
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
                      <h4 className="text-xs font-semibold text-foreground">Drafting Code Patches...</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-[240px]">
                        Agent is writing safe code replacements in a sandboxed memory workspace.
                      </p>
                      <Progress value={currentStepIdx * 17} className="mt-4 h-1.5 w-40" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 rounded-xl border border-border/60 bg-background/20 p-5 flex flex-col items-center justify-center text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/40 text-muted-foreground mb-3">
                        <Cpu className="h-6 w-6" />
                      </div>
                      <h4 className="text-xs font-semibold text-muted-foreground">Output Console</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px]">
                        Deploy an agent and watch the proposed pull requests and code fixes output here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
