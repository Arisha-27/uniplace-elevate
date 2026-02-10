import { useState } from "react";
import { mockJobPostings, mockCompanies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ALL_BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "CE", "Math"];

export default function JobPostings() {
  const [jobs, setJobs] = useState(mockJobPostings);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", company: "", type: "Intern" as "Intern" | "FTE", location: "", ctc: "",
    description: "", deadline: "", rounds: "" , minCgpa: "", branches: [] as string[], batch: "",
  });

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.title || !form.company) return;
    const newJob = {
      id: Date.now().toString(),
      title: form.title, company: form.company, type: form.type, location: form.location,
      ctc: form.ctc, description: form.description, deadline: form.deadline,
      rounds: form.rounds.split(",").map(s => s.trim()), minCgpa: parseFloat(form.minCgpa) || 0,
      branches: form.branches, batch: form.batch, status: "Open" as const,
    };
    setJobs(prev => [...prev, newJob]);
    toast({ title: "Job posting created successfully" });
    setDialogOpen(false);
    setForm({ title: "", company: "", type: "Intern", location: "", ctc: "", description: "", deadline: "", rounds: "", minCgpa: "", branches: [], batch: "" });
  };

  const toggleBranch = (branch: string) => {
    setForm(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Job Postings</h1>
          <p className="page-subtitle">Manage all job postings and eligibility</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Create Job Posting</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Job Title</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Company</Label>
                <Select value={form.company} onValueChange={v => setForm(p => ({ ...p, company: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Job Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as any }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="FTE">Full Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>CTC / Stipend</Label>
                <Input value={form.ctc} onChange={e => setForm(p => ({ ...p, ctc: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Selection Rounds (comma separated)</Label>
                <Input value={form.rounds} onChange={e => setForm(p => ({ ...p, rounds: e.target.value }))} placeholder="OA, Interview, HR" className="mt-1" />
              </div>
              <div>
                <Label>Min CGPA</Label>
                <Input type="number" step="0.1" value={form.minCgpa} onChange={e => setForm(p => ({ ...p, minCgpa: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Batch</Label>
                <Input value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} placeholder="2026" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Allowed Branches</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {ALL_BRANCHES.map(b => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={form.branches.includes(b)} onCheckedChange={() => toggleBranch(b)} />
                      {b}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Create Posting</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="data-table">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Job Title", "Company", "Type", "CTC/Stipend", "Deadline", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{j.title}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{j.company}</td>
                <td className="px-4 py-3"><span className={j.type === "Intern" ? "badge-pending" : "badge-active"}>{j.type}</span></td>
                <td className="px-4 py-3 text-sm text-primary font-medium">{j.ctc}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{j.deadline}</td>
                <td className="px-4 py-3"><span className={j.status === "Open" ? "badge-open" : "badge-closed"}>{j.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
