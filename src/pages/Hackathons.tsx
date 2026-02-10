import { useState } from "react";
import { mockHackathons } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState(mockHackathons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", organizer: "", mode: "Online" as "Online" | "Offline", deadline: "", rewards: "", description: "", registrationLink: "" });

  const handleSave = () => {
    if (!form.name) return;
    setHackathons(prev => [...prev, { id: Date.now().toString(), ...form, participants: 0 }]);
    toast({ title: "Hackathon added successfully" });
    setDialogOpen(false);
    setForm({ name: "", organizer: "", mode: "Online", deadline: "", rewards: "", description: "", registrationLink: "" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Hackathons</h1>
          <p className="page-subtitle">Manage hackathons and competitions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Add Hackathon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Hackathon</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2"><Label>Hackathon Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1" /></div>
              <div><Label>Organizer</Label><Input value={form.organizer} onChange={e => setForm(p => ({ ...p, organizer: e.target.value }))} className="mt-1" /></div>
              <div>
                <Label>Mode</Label>
                <Select value={form.mode} onValueChange={(v: "Online" | "Offline") => setForm(p => ({ ...p, mode: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="mt-1" /></div>
              <div><Label>Rewards</Label><Input value={form.rewards} onChange={e => setForm(p => ({ ...p, rewards: e.target.value }))} className="mt-1" /></div>
              <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" /></div>
              <div className="col-span-2"><Label>Registration Link</Label><Input value={form.registrationLink} onChange={e => setForm(p => ({ ...p, registrationLink: e.target.value }))} className="mt-1" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Add Hackathon</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hackathons.map(h => (
          <div key={h.id} className="stat-card">
            <h3 className="text-lg font-semibold text-foreground">{h.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{h.organizer}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Deadline: <strong className="text-foreground">{h.deadline}</strong></span>
              <span className="flex items-center gap-1"><Gift className="w-4 h-4 text-primary" /> <span className="text-primary font-medium">{h.rewards}</span></span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="w-4 h-4" /> {h.participants.toLocaleString()} participants</span>
              <Button size="sm">Register</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
