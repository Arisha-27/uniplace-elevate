import { useState } from "react";
import { mockEvents } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Events() {
  const [events, setEvents] = useState(mockEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", type: "Workshop" as "Workshop" | "Webinar" | "Seminar", date: "", time: "", location: "", description: "", registrationLink: "" });

  const handleSave = () => {
    if (!form.title) return;
    setEvents(prev => [...prev, { id: Date.now().toString(), ...form, registered: 0 }]);
    toast({ title: "Event created successfully" });
    setDialogOpen(false);
    setForm({ title: "", type: "Workshop", date: "", time: "", location: "", description: "", registrationLink: "" });
  };

  const typeBadge = (type: string) => {
    if (type === "Workshop") return "badge-active";
    if (type === "Webinar") return "badge-pending";
    return "badge-approved";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Events</h1>
          <p className="page-subtitle">Workshops, webinars, and seminars</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2"><Label>Event Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" /></div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v: "Workshop" | "Webinar" | "Seminar") => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1" /></div>
              <div><Label>Time</Label><Input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="2:00 PM" className="mt-1" /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1" /></div>
              <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" /></div>
              <div className="col-span-2"><Label>Registration Link</Label><Input value={form.registrationLink} onChange={e => setForm(p => ({ ...p, registrationLink: e.target.value }))} className="mt-1" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="stat-card">
            <div className="mb-3">
              <span className={typeBadge(event.type)}>{event.type}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="w-4 h-4" /> {event.registered} registered</span>
              <Button size="sm">Register Now</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
