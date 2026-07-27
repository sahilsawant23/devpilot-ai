'use client';

import * as React from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  Plus,
  Printer,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, exportToJSON, printExecutiveReport } from '@/lib/export-utils';
import { toast } from 'sonner';

interface ReportItem {
  id: string;
  title: string;
  type: string;
  repo: string;
  date: string;
  status: 'Ready' | 'Processing';
  size: string;
  issuesCount: number;
  healthScore: number;
}

const initialReports: ReportItem[] = [
  { id: '1', title: 'web-platform — Full Code & Architecture Audit', type: 'Analysis', repo: 'web-platform', date: '2026-07-26', status: 'Ready', size: '2.4 MB', issuesCount: 4, healthScore: 92 },
  { id: '2', title: 'billing-api — Security & Vulnerability Scan', type: 'Security', repo: 'billing-api', date: '2026-07-25', status: 'Ready', size: '1.1 MB', issuesCount: 12, healthScore: 68 },
  { id: '3', title: 'analytics-engine — Latency & Memory Benchmark', type: 'Performance', repo: 'analytics-engine', date: '2026-07-22', status: 'Ready', size: '3.2 MB', issuesCount: 2, healthScore: 88 },
  { id: '4', title: 'user-service — Automated Unit Test Suite Coverage', type: 'Testing', repo: 'user-service', date: '2026-07-20', status: 'Ready', size: '0.8 MB', issuesCount: 1, healthScore: 95 },
  { id: '5', title: 'design-system — React Dependency & Component Graph', type: 'Architecture', repo: 'design-system', date: '2026-07-18', status: 'Processing', size: '—', issuesCount: 0, healthScore: 84 },
  { id: '6', title: 'mobile-app — Crash & Exception Diagnostics', type: 'Bugs', repo: 'mobile-app', date: '2026-07-15', status: 'Ready', size: '1.6 MB', issuesCount: 7, healthScore: 79 },
];

const typeColor: Record<string, string> = {
  Analysis: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  Security: 'bg-red-500/15 text-red-500 border-red-500/30',
  Performance: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
  Testing: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  Architecture: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  Bugs: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
};

export default function ReportsPage() {
  const [reportsList, setReportsList] = React.useState<ReportItem[]>(initialReports);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState<string>('All');
  const [selectedReport, setSelectedReport] = React.useState<ReportItem | null>(null);

  // New report dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newRepo, setNewRepo] = React.useState('web-platform');
  const [newType, setNewType] = React.useState('Security');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const filteredReports = React.useMemo(() => {
    return reportsList.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.repo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypeFilter === 'All' || r.type === selectedTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [reportsList, searchQuery, selectedTypeFilter]);

  const handleCreateReport = () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const newItem: ReportItem = {
        id: String(Date.now()),
        title: `${newRepo} — ${newTitle}`,
        type: newType,
        repo: newRepo,
        date: new Date().toISOString().split('T')[0],
        status: 'Ready',
        size: '1.4 MB',
        issuesCount: Math.floor(Math.random() * 8) + 1,
        healthScore: Math.floor(Math.random() * 25) + 75,
      };
      setReportsList([newItem, ...reportsList]);
      setIsGenerating(false);
      setDialogOpen(false);
      setNewTitle('');
      toast.success('Report successfully generated!');
    }, 1200);
  };

  const handleExportSingle = (report: ReportItem, format: 'csv' | 'json' | 'pdf') => {
    const exportData = [
      {
        ReportID: report.id,
        Title: report.title,
        Repository: report.repo,
        Category: report.type,
        GeneratedDate: report.date,
        HealthScore: `${report.healthScore}%`,
        FlaggedIssues: report.issuesCount,
        Status: report.status,
      },
    ];

    if (format === 'csv') {
      exportToCSV(report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(), exportData);
      toast.success('Downloaded CSV export');
    } else if (format === 'json') {
      exportToJSON(report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(), {
        metadata: {
          platform: 'DevPilot AI',
          exportedAt: new Date().toISOString(),
        },
        reportDetails: exportData[0],
      });
      toast.success('Downloaded JSON export');
    } else if (format === 'pdf') {
      const htmlContent = `
        <div style="font-family: sans-serif; padding: 10px;">
          <h2>Report Overview</h2>
          <p><strong>Target Repository:</strong> ${report.repo}</p>
          <p><strong>Category:</strong> ${report.type}</p>
          <p><strong>Health Score:</strong> ${report.healthScore}/100</p>
          <p><strong>Flagged Issues:</strong> ${report.issuesCount}</p>
          <hr />
          <h3>Summary & Recommendations</h3>
          <p>This automated DevPilot AI audit indicates a health index of <strong>${report.healthScore}%</strong>. A total of <strong>${report.issuesCount}</strong> static analysis and vulnerability signals were recorded during execution.</p>
        </div>
      `;
      printExecutiveReport(report.title, htmlContent);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Reports & Analytics Audit"
        description="Generate, inspect, and export comprehensive repository code audits, security scans, and test reports."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Automated AI Audit</DialogTitle>
                <DialogDescription>
                  Select a repository and analysis preset to run a full diagnostic scan.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Target Repository</label>
                  <Select value={newRepo} onValueChange={setNewRepo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repository" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-platform">web-platform (TypeScript / Next.js)</SelectItem>
                      <SelectItem value="billing-api">billing-api (Go / Gin)</SelectItem>
                      <SelectItem value="analytics-engine">analytics-engine (Python / FastAPI)</SelectItem>
                      <SelectItem value="user-service">user-service (Node.js / Express)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Report Type</label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Security">Security & Vulnerability Audit</SelectItem>
                      <SelectItem value="Analysis">Full Code Architecture Audit</SelectItem>
                      <SelectItem value="Performance">Latency & Benchmark Report</SelectItem>
                      <SelectItem value="Testing">Test Suite & Coverage Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Report Title / Topic</label>
                  <Input
                    placeholder="e.g. Q3 Security & Auth Refactor Audit"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateReport} disabled={isGenerating}>
                  {isGenerating ? 'Running Diagnostic...' : 'Generate Report'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsList.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 6 connected microservices</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Avg Repository Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">84%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% improvement over past 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Flagged Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">20 Issues</div>
            <p className="text-xs text-muted-foreground mt-1">12 Security, 8 Performance bottlenecks</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by title or repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 bg-card pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Analysis', 'Security', 'Performance', 'Testing', 'Architecture'].map((t) => (
            <Button
              key={t}
              variant={selectedTypeFilter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTypeFilter(t)}
              className="h-8 text-xs"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="px-0">
          <div className="divide-y divide-border/60">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="mx-auto h-10 w-10 opacity-30 mb-2" />
                <p className="font-medium text-sm">No matching reports found</p>
              </div>
            ) : (
              filteredReports.map((r) => (
                <div key={r.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {r.date}
                        </span>
                        <span>{r.size}</span>
                        <span className="font-medium text-foreground">Health: {r.healthScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColor[r.type] || 'bg-accent'}`}>
                      {r.type}
                    </span>
                    {r.status === 'Ready' ? (
                      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500">Ready</Badge>
                    ) : (
                      <Badge variant="secondary" className="animate-pulse">Processing</Badge>
                    )}
                    {r.status === 'Ready' && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Preview report"
                          onClick={() => setSelectedReport(r)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Download report">
                              <Download className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExportSingle(r, 'csv')}>
                              <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" />
                              Download CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportSingle(r, 'json')}>
                              <FileCode className="mr-2 h-4 w-4 text-blue-500" />
                              Download JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportSingle(r, 'pdf')}>
                              <Printer className="mr-2 h-4 w-4 text-purple-500" />
                              Print / PDF Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColor[selectedReport.type]}`}>
                  {selectedReport.type}
                </span>
                <span className="text-xs text-muted-foreground">{selectedReport.date}</span>
              </div>
              <DialogTitle className="text-lg mt-2">{selectedReport.title}</DialogTitle>
              <DialogDescription>
                Automated diagnostics summary for repository <code className="text-primary">{selectedReport.repo}</code>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3 text-center">
                  <span className="text-xs text-muted-foreground uppercase">Health Score</span>
                  <div className="text-xl font-bold text-emerald-500 mt-1">{selectedReport.healthScore}%</div>
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-center">
                  <span className="text-xs text-muted-foreground uppercase">Issues Flagged</span>
                  <div className="text-xl font-bold text-amber-500 mt-1">{selectedReport.issuesCount}</div>
                </div>
              </div>
              <div className="rounded-lg border border-border/80 bg-accent/20 p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Key Findings & Highlights
                </div>
                <p className="text-muted-foreground">
                  The static analyzer verified all imports, dependencies, and API definitions across the target branch.
                  Vulnerability signals have been prioritized based on CVSS severity indexing.
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportSingle(selectedReport, 'csv')}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportSingle(selectedReport, 'json')}
              >
                <FileCode className="mr-2 h-4 w-4 text-blue-500" />
                JSON
              </Button>
              <Button
                size="sm"
                onClick={() => handleExportSingle(selectedReport, 'pdf')}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print / Export PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}
